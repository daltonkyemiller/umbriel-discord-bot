import dotenv from 'dotenv';
import { Logger } from 'tslog';
import { Umbriel } from './app/umbriel.js';
import { Agenda } from 'agenda';
import nodemon from 'nodemon';
import { Client as DiscordClient, Intents } from 'discord.js';

dotenv.config();

export const DISCORD_CLIENT_ID = process.env.DISCORD_TESTING_CLIENT;
export const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
export const DISCORD_CLIENT = new DiscordClient({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });


export const MONGO_CONNECTION_URI = `mongodb+srv://admin:${process.env.MONGO_PASS}@cluster0.2agzp.mongodb.net/${process.env.MONGO_DB}`;
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