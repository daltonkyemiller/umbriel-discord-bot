import { randomBetween } from '../utils/index.js';
import { agenda, CLIENT, log } from '../../index.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { getUserJobs } from '../agenda/index.js';

export const REMINDERS = {
    reminder: {
        data: new SlashCommandBuilder()
            .setName('reminder')
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
                    .addStringOption(option =>
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
            let cmdName = interaction.options.data[0].name;
            let cmdOptions = interaction.options.data[0].options;
            let jobs = await getUserJobs(interaction.user.id, 'sendDM');
            switch (cmdName) {
                case 'add':
                    try {
                        await agenda.schedule(cmdOptions[1].value, 'sendDM', {
                            userId: interaction.user.id,
                            message: cmdOptions[0].value
                        });
                        await interaction.reply(`Done, I will send you a DM to remind you`);
                    } catch (e) {
                        log.error(e);
                        await interaction.reply(`Sorry, that can't be done right now.`);
                    }
                    return;
                case 'view':
                    let reminders = jobs.map((job, idx) => `${idx}. ${job.attrs.data.message}`);
                    let reply = `You have ${jobs.length} reminder(s):\n${reminders.join('\n')} `;
                    await interaction.reply(reply);
                    return;
                case 'remove':
                    let reminderIdx = parseFloat(cmdOptions[0].value);
                    try {
                        await jobs[reminderIdx].remove();
                        await interaction.reply('Okay, reminder canceled!');
                    } catch (e) {
                        log.error(`User: ${interaction.user.username} tried to cancel a reminder that wasn't scheduled`);
                        interaction.reply('Sorry, no reminder found with that index');
                    }
                    return;


            }

        }
    },

};

