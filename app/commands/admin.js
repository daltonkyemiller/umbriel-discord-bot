import { SlashCommandBuilder } from '@discordjs/builders';
import { restart, umbriel } from '../../index.js';

export const ADMIN_COMMANDS = {
    kill: {
        data: new SlashCommandBuilder()
            .setName('kill')
            .setDescription('Restarts the bot')
            .setDefaultPermission(false),
        execute: async (interaction) => {
            await interaction.reply('aaahahhh why me');
            await restart();
        }
    }
};