import { COMMANDS } from './commands/index.js';
import { messageHandler } from './messages/index.js';
import { log, AGENDA, DISCORD_CLIENT_ID, DISCORD_TOKEN, MONGO_CONNECTION_URI } from '../index.js';
import { defineAgendaTasks } from './agenda/index.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import mongoose from 'mongoose';
import { Client as DiscordClient, Collection, Intents } from 'discord.js';

export class Umbriel {
    constructor() {
        this.commands = [];
        this.discordClient = new DiscordClient({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
    }

    async init() {
        await this.discordClient.login(DISCORD_TOKEN);
        await this.registerCommands();
        await AGENDA.start();
        defineAgendaTasks();
        await this.dbConnect();
        this.listen();
    }

    async killProcesses() {
        await this.discordClient.destroy();
    }


    listen() {
        this.discordClient.on('ready', (client) => {
            log.info(`Logged in as ${client.user.tag}`);
            client.user.setActivity('CODING', {
                type: 'WATCHING',
            });
        });

        this.discordClient.on('messageCreate', async (msg) => {
            // Ignore bot messages
            if (msg.author.bot) return;

            // Custom message handler
            await messageHandler(msg);
        });

        this.discordClient.on('interactionCreate', async interaction => {
            // Only listen to command interactions, for now
            if (!interaction.isCommand()) return;
            let command = this.discordClient.commands.get(interaction.commandName);

            // Try to run custom execute function
            try {
                await command.execute(interaction);
            } catch (error) {
                log.error(error);
            }
        });
    }

    async dbConnect() {
        try {
            await mongoose.connect(MONGO_CONNECTION_URI);
            log.info('Mongoose connection success');
        } catch (e) {
            log.error(e);
        }
    }

    async registerCommands() {
        this.discordClient.commands = new Collection();

        // Register all of our custom commands, runs every time the bot starts
        for (let key in COMMANDS) {
            this.commands.push(COMMANDS[key].data.toJSON());
            await this.discordClient.commands.set(COMMANDS[key].data.name, COMMANDS[key]);
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




