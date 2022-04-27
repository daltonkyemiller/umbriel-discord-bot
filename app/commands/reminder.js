import { randomBetween } from '../utils/index.js';
import { agenda, CLIENT, log } from '../../index.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { getUserJobs } from '../agenda/index.js';
import { commandHandler } from './handler.js';

export const REMINDERS = {
    reminders: {
        data: new SlashCommandBuilder()
            .setName('reminders')
            .setDescription('Use to remind yourself')
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
                        await interaction.reply(`Sorry, that can't be done right now.`);
                    }
                },
                view: async () => {
                    let jobs = await getUserJobs(interaction.user.id, 'sendDM');
                    let reminders = jobs.map((job, idx) => `${idx}. ${job.attrs.data.message}`);
                    let reply = `You have ${jobs.length} reminder(s):\n${reminders.join('\n')} `;
                    await interaction.reply(reply);
                },
                remove: async (jobIndex) => {
                    let jobs = await getUserJobs(interaction.user.id, 'sendDM');
                    try {
                        await jobs[jobIndex].remove();
                        await interaction.reply('Okay, reminder canceled!');
                    } catch (e) {
                        log.error(`User: ${interaction.user.username} tried to cancel a reminder that wasn't scheduled`);
                        interaction.reply('Sorry, no reminder found with that index');
                    }

                }
            });
        }
    },

};

