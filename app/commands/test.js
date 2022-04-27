import { randomBetween } from '../utils/index.js';
import { log } from '../../index.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export const TESTS = {
    addReminder: {
        data: new SlashCommandBuilder()
            .setName('reminder')
            .setDescription('Use to remind yourself')
            .addSubcommand(subcommand =>
                subcommand
                    .setName('add')
                    .setDescription('Adds a new reminder')
                    .addStringOption(option =>
                        option
                            .setName('what')
                            .setDescription('What should I remind you to do?')
                            .setRequired(true)
                    )
                    .addStringOption(option =>
                        option
                            .setName('when')
                            .setDescription('When should I remind you?')
                            .setRequired(true)
                    )
            )
            .addSubcommand(subcommand =>
                subcommand
                    .setName('remove')
                    .setDescription('Removes a reminder')
                    .addStringOption(option =>
                        option
                            .setName('name')
                            .setDescription('Which reminder should I remove?')
                    )),
        execute: async (interaction) => {
            let cmdName = interaction.options.data.name;

        }
    },

};

