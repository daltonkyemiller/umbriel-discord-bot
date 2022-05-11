import { SlashCommandBuilder } from '@discordjs/builders';
import { log } from '../../app.js';
import { userSchema } from '../db/schema/user.js';
import { tableGenerator } from '../utils/tableGenerator.js';
import { flattenObj } from '../utils/flatten.js';

export const LEADERBOARD = {
    leaderboard: {
        data: new SlashCommandBuilder()
            .setName('leaderboard')
            .setDescription('Shows Leaderboard'),
        execute: async (interaction) => {
            const userData = await userSchema.find({}, 'username chatStats').sort('-chatStats.charsTyped').lean();
            const flattenedData = userData.map(user => flattenObj(user));
            await interaction.reply('```' + tableGenerator(flattenedData) + '```');
        }
    }
};