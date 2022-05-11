import { SlashCommandBuilder } from '@discordjs/builders';
import { log } from '../../app.js';
import { userSchema } from '../db/schema/user.js';
import { tableGenerator } from '../utils/tableGenerator.js';
import { flattenObj } from '../utils/flatten.js';
import { sliceIntoChunks } from '../utils/sliceIntoChunks.js';

export const LEADERBOARD = {
    leaderboard: {
        data: new SlashCommandBuilder()
            .setName('leaderboard')
            .setDescription('Shows Leaderboard'),
        execute: async (interaction) => {
            const userData = await userSchema.find({}, 'username chatStats.charsTyped').sort('-chatStats.charsTyped').lean();
            const flattenedData = userData.map((user, idx) => flattenObj({ rank: idx + 1, ...user }));

            // Slice into chunks, we don't go over character count
            const chunkedData = sliceIntoChunks(flattenedData, 5);
            for (let chunk of chunkedData) {
                await interaction.channel.send('```' + tableGenerator(chunk) + '```');
            }
        }
    }
};