import { SlashCommandBuilder } from '@discordjs/builders';
import { log } from '../../app.js';
import { userSchema } from '../db/schema/user.js';
import { tableGenerator } from '../utils/tableGenerator.js';
import { flattenObj } from '../utils/flatten.js';
import { sliceIntoChunks } from '../utils/sliceIntoChunks.js';
import { commandHandler } from './handler.js';
import { getRandomResponse } from '../utils/index.js';
import { POSITIVE_RESPONSES } from '../messages/index.js';

export const LEADERBOARD = {
    leaderboard: {
        data: new SlashCommandBuilder()
            .setName('leaderboard')
            .setDescription('Shows Leaderboard')
            .addSubcommand(option =>
                option
                    .setName('sort')
                    .setDescription('What to show?')
                    .addStringOption(by =>
                        by
                            .setName('by')
                            .setDescription('What to sort by?')
                            .setRequired(true)
                            .addChoices(...Object.keys(userSchema.schema.paths)
                                .filter(key => !key.includes('_'))
                                .map(key => ({ name: key, value: key })))
                    )
            ),
        execute: async (interaction) => {
            await commandHandler(interaction, {
                sort: async (by, reverseOrder) => {
                    // Get all users, only use username and charsTyped, sort by charsTyped
                    const userData = await userSchema
                        .find({}, `username ${by}`)
                        .sort(`-${by}`).lean();
                    // Flatten the object so we don't have nested objects
                    const flattenedData = userData.map((user, idx) => flattenObj(user));

                    // Slice into chunks, so we don't go over the 2000 character count
                    const chunkedData = sliceIntoChunks(flattenedData, 5);
                    for (let chunk of chunkedData) {
                        await interaction.channel.send('```' + tableGenerator(chunk) + '```');
                    }
                    await interaction.reply(getRandomResponse(POSITIVE_RESPONSES));
                }
            });
        }
    }
};