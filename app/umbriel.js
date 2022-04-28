import { COMMANDS } from './commands/index.js';
import { messageHandler } from './messages/index.js';
import { DISCORD_CLIENT, log, __dirname, agenda, clientId, token, mongoConnectionStr } from '../index.js';
import { defineAgendaTasks } from './agenda/index.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import mongoose from 'mongoose';

export class Umbriel {
    commands = [];

    constructor() {
    }

    async init() {
        await this.registerCommands();
        defineAgendaTasks();
        await this.dbConnect();
        this.listen();
    }

    listen() {
        DISCORD_CLIENT.on('ready', (client) => {
            log.info(`Logged in as ${client.user.tag}`);
            client.user.setActivity('CODING', {
                type: 'WATCHING',
            });
        });

        DISCORD_CLIENT.on('messageCreate', (msg) => {
            if (msg.author.bot) return;
            messageHandler(msg);
        });

        DISCORD_CLIENT.on('interactionCreate', async interaction => {
            if (!interaction.isCommand()) return;
            let command = DISCORD_CLIENT.commands.get(interaction.commandName);
            try {
                await command.execute(interaction);
            } catch (error) {
                log.error(error);
            }
        });
    }

    async dbConnect() {
        try {
            await mongoose.connect(mongoConnectionStr);
            log.info('Mongoose connection success');
        } catch (e) {
            log.error(e);
        }
    }

    async registerCommands() {
        for (let key in COMMANDS) {
            this.commands.push(COMMANDS[key].data.toJSON());
            await DISCORD_CLIENT.commands.set(COMMANDS[key].data.name, COMMANDS[key]);
        }

        const rest = new REST({ version: '9' }).setToken(token);
        await agenda.start();
        try {
            await rest.put(
                Routes.applicationCommands(clientId),
                { body: this.commands },
            );
            log.info('Successfully reloaded application (/) commands.');
        } catch (error) {
            log.error(error);
        }
    }


}




