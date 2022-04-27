import dotenv from 'dotenv';
import { Client as DiscordClient, Collection, Intents } from 'discord.js';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Logger } from 'tslog';
import { Umbriel } from './app/umbriel.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { COMMANDS } from './app/commands/index.js';
import { Agenda } from 'agenda';

dotenv.config();

const clientId = process.env.DISCORD_TESTING_CLIENT;
const token = process.env.DISCORD_TOKEN;
const mongoConnectionStr = `mongodb+srv://admin:${process.env.MONGO_PASS}@cluster0.2agzp.mongodb.net/${process.env.MONGO_DB}`;
export const agenda = new Agenda({ db: { address: mongoConnectionStr } });


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

for (let key in COMMANDS) {
    commands.push(COMMANDS[key].data.toJSON());
    let cmd = await CLIENT.commands.set(COMMANDS[key].data.name, COMMANDS[key]);
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    await agenda.start();
    try {
        log.info('Started refreshing application (/) commands.');

        await rest.put(
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
