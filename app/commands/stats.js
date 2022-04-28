import { SlashCommandBuilder } from '@discordjs/builders';
import { commandHandler } from './handler.js';
import { stat } from 'fs';
import { fetchUser } from '../db/index.js';

export const STATS = {
    stats: {
        data: new SlashCommandBuilder()
            .setName('stats')
            .setDescription('View your stats')
            .addSubcommand(view =>
                view
                    .setName('view')
                    .setDescription('View \'em')
            ),
        execute: async (interaction) => {
            await commandHandler(interaction, {
                view: async () => {
                    let user = await fetchUser(interaction.user);
                    interaction.reply(formatUserStats(user));
                }
            });
        }
    }
};

const formatUserStats = (user) => {
    let statsOutput = `**Your Stats Are:**\nCharacters Typed: ${user.chatStats.charsTyped}\nWords Typed: ${user.chatStats.wordsTyped}\nImages Sent: ${user.chatStats.imagesSent}`;
    return statsOutput;
};
