import { SlashCommandBuilder } from '@discordjs/builders';
import { log } from '../../app.js';

export const LEADERBOARD = {
    leaderboard: {
        data: new SlashCommandBuilder()
            .setName('leaderboard')
            .setDescription('Shows Leaderboard'),
        execute: (interaction) => {
            
        }
    }
};