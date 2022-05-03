import { SlashCommandBuilder } from '@discordjs/builders';
import { restart, umbriel } from '../../../index.js';

export const CLIENT_COMMANDS = {
    restart: {
        data: new SlashCommandBuilder()
            .setName('restart')
            .setDescription('Restarts the bot')
            .setDefaultPermission(false),
        execute: async (interaction) => {
            await interaction.reply('Restarting...');
            await restart();
        }
    }
};