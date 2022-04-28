import { getRandomResponse, randomBetween } from '../utils/index.js';
import { agenda, DISCORD_CLIENT, log } from '../../index.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { getJobs } from '../agenda/index.js';
import { commandHandler } from './handler.js';
import { ERROR_RESPONSES } from '../messages/index.js';


// All users can access the reminders command, the reminder will be DMed to them.
export const REMINDERS = {
    reminders: {
        // Creating reminders command with SlashCommandBuilder
        data: new SlashCommandBuilder()
            .setName('reminders')
            .setDescription('Use to remind yourself')
            // Add reminder command
            .addSubcommand(add =>
                add
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
            // Remove reminder command
            .addSubcommand(remove =>
                remove
                    .setName('remove')
                    .setDescription('Removes a reminder')
                    .addIntegerOption(option =>
                        option
                            .setName('index')
                            .setDescription('Which reminder should I remove?')
                            .setRequired(true)
                    )
            )
            // View reminder command
            .addSubcommand(view =>
                view
                    .setName('view')
                    .setDescription('Shows your reminder')
            ),
        execute: async (interaction) => {
            await commandHandler(interaction, {
                add: async (what, when) => {
                    try {
                        await agenda.schedule(when, 'sendDM', {
                            userId: interaction.user.id,
                            message: what
                        });
                        await interaction.reply(`Done, I will send you a DM to remind you`);
                    } catch (e) {
                        log.error(e);
                        await interaction.reply(getRandomResponse(ERROR_RESPONSES));
                    }
                },
                view: async () => {
                    try {
                        let jobs = await getJobs({ userId: interaction.user.id, jobName: 'sendDM' });
                        let reminders = jobs.map((job, idx) => `${idx}. ${job.attrs.data.message}`);
                        let reply = jobs.length !== 0
                            ? `You have ${jobs.length} reminder(s):\n${reminders.join('\n')} `
                            : `You don't have any reminders currently.`;
                        await interaction.reply(reply);
                    } catch (e) {
                        log.error(e);
                        await interaction.reply(getRandomResponse(ERROR_RESPONSES));
                    }
                },
                remove: async (jobIndex) => {
                    let jobs = await getJobs({ userId: interaction.user.id, jobName: 'sendDM' });
                    if (jobs.length === 0) return interaction.reply('No jobs with that index.');
                    try {
                        await jobs[jobIndex].remove();
                        await interaction.reply('Okay, reminder canceled!');
                    } catch (e) {
                        log.error(e);
                        interaction.reply(getRandomResponse(ERROR_RESPONSES));
                    }

                }
            });
        }
    },

};

