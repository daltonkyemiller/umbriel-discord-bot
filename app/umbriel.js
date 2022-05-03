import { COMMANDS } from './commands/index.js';
import { messageHandler } from './messages/index.js';
import { log, AGENDA, DISCORD_CLIENT_ID, DISCORD_TOKEN, MONGO_CONNECTION_URI, DISCORD_CLIENT } from '../index.js';
import { defineAgendaTasks } from './agenda/index.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import mongoose from 'mongoose';
import { Collection } from 'discord.js';

export class Umbriel {
    constructor() {
        this.commands = [];
    }

    async init() {
        this.registerListeners();
        await this.registerCommands();
        await AGENDA.start();
        defineAgendaTasks();
        await this.dbConnect();

    }

    // Force kill processes used by Umbriel
    async killProcesses() {
        await DISCORD_CLIENT.destroy();
    }


    registerListeners() {
        // When the bot logs in successfully
        DISCORD_CLIENT.on('ready', (client) => {
            log.info(`Logged in as ${client.user.tag}`);
            client.user.setActivity('CODING', {
                type: 'WATCHING',
            });
        });

        // When a message is created on the server
        DISCORD_CLIENT.on('messageCreate', async (msg) => {
            // Ignore bot messages
            if (msg.author.bot) return;

            // Custom message handler
            await messageHandler(msg);
        });

        DISCORD_CLIENT.on('interactionCreate', async interaction => {
            // Only listen to command interactions, for now
            if (!interaction.isCommand()) return;
            let command = DISCORD_CLIENT.commands.get(interaction.commandName);

            // Try to run custom execute function
            try {
                await command.execute(interaction);
            } catch (error) {
                log.error(error);
            }
        });
    }

    // Set up mongoose connection
    async dbConnect() {
        try {
            await mongoose.connect(MONGO_CONNECTION_URI);
            log.info('Mongoose connection success');
        } catch (e) {
            log.error(e);
        }
    }

    // Register all of our custom commands, runs every time the bot starts
    async registerCommands() {
        DISCORD_CLIENT.commands = new Collection();

        for (let key in COMMANDS) {
            this.commands.push(COMMANDS[key].data.toJSON());
            await DISCORD_CLIENT.commands.set(COMMANDS[key].data.name, COMMANDS[key]);
        }

        const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);
        try {
            await rest.put(
                Routes.applicationCommands(DISCORD_CLIENT_ID),
                { body: this.commands },
            );
            log.info('Successfully reloaded application (/) commands.');
        } catch (error) {
            log.error(error);
        }
    }

}




