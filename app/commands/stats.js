import { SlashCommandBuilder } from '@discordjs/builders';
import { commandHandler } from './handler.js';
import { fetchUser } from '../db/index.js';
import { MessageEmbed } from 'discord.js';
import { stat } from 'fs';

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
                    interaction.reply({ embeds: [embedStatsOutput(user)] });
                }
            });
        }
    }
};

const embedStatsOutput = (user) => {
    let stats = `Characters Typed: ${user.chatStats.charsTyped}\nWords Typed: ${user.chatStats.wordsTyped}\nImages Sent: ${user.chatStats.imagesSent}`;
    let statsOutput = new MessageEmbed().setTitle('Your Stats').setColor('RED').setDescription(stats);
    return statsOutput;
};
