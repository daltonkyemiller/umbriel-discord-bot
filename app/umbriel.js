import { COMMANDS, onMessageCreate } from './commands/index.js';
import { join } from 'path';
import { CLIENT, log, __dirname } from '../index.js';

export class Umbriel {
    db;

    constructor() {
        this.start();
    }

    start() {
        this.listen();

    }

    dbConnect() {

    }

    listen() {
        CLIENT.on('ready', (client) => {
            log.info(`Logged in as ${client.user.tag}`);
        });

        CLIENT.on('messageCreate', (msg) => {
            if (msg.author.bot) return;
            onMessageCreate(msg);
        });

        CLIENT.on('interactionCreate', async interaction => {
            if (!interaction.isCommand()) return;
            let command = CLIENT.commands.get(interaction.commandName);
            if (!command) return log.warn('Command doesn\'t exist');
            try {
                await command.execute(interaction);
            } catch (error) {
                log.error(error);
            }
        });
    }

    removeListeners() {
        CLIENT.removeAllListeners();
    }

    exit() {
        this.removeListeners();
    }

}




