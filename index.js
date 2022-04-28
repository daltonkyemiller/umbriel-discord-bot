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

export const clientId = process.env.DISCORD_TESTING_CLIENT;
export const token = process.env.DISCORD_TOKEN;
export const mongoConnectionStr = `mongodb+srv://admin:${process.env.MONGO_PASS}@cluster0.2agzp.mongodb.net/${process.env.MONGO_DB}`;
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
export const DISCORD_CLIENT = new DiscordClient(
    { intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] }
);

// Authenticate
await DISCORD_CLIENT.login(process.env.DISCORD_TOKEN);
DISCORD_CLIENT.commands = new Collection();


export let umbriel;
if (!umbriel) {
    umbriel = new Umbriel();
    await umbriel.init();
}
