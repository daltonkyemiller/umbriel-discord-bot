import dotenv from 'dotenv';
import { Logger } from 'tslog';
import { Umbriel } from './app/umbriel.js';
import { Agenda } from 'agenda';
import nodemon from 'nodemon';
import { Client as DiscordClient, Intents } from 'discord.js';

dotenv.config();


export const DISCORD_CLIENT_ID = process.env.NODE_ENV !== 'production'
    ? process.env.DISCORD_TESTING_CLIENT
    : process.env.DISCORD_PROD_CLIENT;

export const DISCORD_TOKEN = process.env.NODE_ENV !== 'production'
    ? process.env.DISCORD_TESTING_TOKEN
    : process.env.DISCORD_PROD_TOKEN;

export const MONGO_CONNECTION_URI = process.env.NODE_ENV !== 'production'
    ? process.env.MONGO_TESTING_URI
    : process.env.MONGO_URI

export const DISCORD_CLIENT = new DiscordClient({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


export const AGENDA = new Agenda({ db: { address: MONGO_CONNECTION_URI } });

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
await DISCORD_CLIENT.login(DISCORD_TOKEN);


export let umbriel;
if (!umbriel) {
    umbriel = new Umbriel();
    await umbriel.init();
}

export const restart = async () => {
    await umbriel.killProcesses();
    umbriel = new Umbriel();
    await umbriel.init();
};