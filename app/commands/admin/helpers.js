import { SlashCommandBuilder } from '@discordjs/builders';
import { log } from '../../../index.js';
import { commandHandler } from '../handler.js';

export const HELPER_COMMANDS = {
    clear: {
        data: new SlashCommandBuilder()
            .setName('clear')
            .setDescription('Clears messages...')
            .setDefaultPermission(false)
            .addIntegerOption(num =>
                num
                    .setName('number')
                    .setDescription('How many messages to clear?')
                    .setRequired(true)
                    .setMinValue(1)
            ),
        execute: async (interaction) => {
            await commandHandler(interaction, {
                number: async (number) => {
                    let messages = await interaction.channel.messages.fetch({ limit: number });
                    await messages.forEach(message => message.delete());
                    interaction.reply(`${messages.size} message(s) deleted`);
                }
            });
        }
    }
};