import dotenv from 'dotenv';
import { Client as DiscordClient, Collection, Intents } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Logger } from 'tslog';
import { Umbriel } from './app/umbriel.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { COMMANDS } from './app/commands/index.js';

dotenv.config();

const clientId = process.env.DISCORD_TESTING_CLIENT;
const token = process.env.DISCORD_TOKEN;

export const log = new Logger({
    name: 'MainLogger',
    overwriteConsole: true,
    displayDateTime: false,
    displayLoggerName: false,
    displayFilePath: true,
    displayFunctionName: false,
    minLevel: 'trace',
    displayTypes: true,
});
export const __dirname = dirname(fileURLToPath(import.meta.url));

// Instantiate a new client with some necessary parameters.
export const CLIENT = new DiscordClient(
    { intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] }
);
// Authenticate
CLIENT.login(process.env.DISCORD_TOKEN);

CLIENT.commands = new Collection();

const commands = [];

for (let commandsKey in COMMANDS) {
    commands.push(COMMANDS[commandsKey].data.toJSON());
    CLIENT.commands.set(COMMANDS[commandsKey].data.name, COMMANDS[commandsKey]);
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        log.info('Started refreshing application (/) commands.');

        let res = await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );

        log.info('Successfully reloaded application (/) commands.');
    } catch (error) {
        log.error(error);
    }
})();


export let umbriel;
if (!umbriel) {
    umbriel = new Umbriel();
}
