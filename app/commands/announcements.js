import { SlashCommandBuilder } from '@discordjs/builders';
import { commandHandler } from './handler.js';
import { AGENDA, log } from '../../index.js';
import { getJobs } from '../agenda/index.js';

// Announcement is different from reminder in that is sends a message to the channel tagging everyone vs DMing.
// Admins are the only people allowed to use the announcements command
export const ANNOUNCEMENTS = {
    announcements: {
        // Creating announcement command using the SlashCommandBuilder
        data: new SlashCommandBuilder()
            .setName('announcements')
            .setDescription('Set an announcement')
            .setDefaultPermission(false)
            // Add Command
            .addSubcommand(add =>
                add
                    .setName('add')
                    .setDescription('Add an announcement')
                    .addStringOption(what =>
                        what
                            .setName('what')
                            .setDescription('What to announce?')
                            .setRequired(true)
                    )
                    .addStringOption(when =>
                        when
                            .setName('when')
                            .setDescription('When to announce it?')
                            .setRequired(true)
                    )
            )
            // Remove Command
            .addSubcommand(remove =>
                remove
                    .setName('remove')
                    .setDescription('Removes an announcement.')
                    .addIntegerOption(index =>
                        index
                            .setName('index')
                            .setDescription('Index of announcement to remove')
                            .setRequired(true)
                    )
            )
            // View Command
            .addSubcommand(view =>
                view
                    .setName('view')
                    .setDescription('Show all announcements')
            ),
        execute: async (interaction) => {
            await commandHandler(interaction, {
                    add: async (what, when) => {
                        await AGENDA.schedule(when, 'sendAnnouncement', {
                            message: what,
                            channel: interaction.channelId
                        });
                        await interaction.reply('Okay! Announcement set.');
                    },
                    view: async (id) => {
                        let jobs = await getJobs({ jobName: 'sendAnnouncement' });
                        let announcements = jobs.map((job, idx) => `${idx}. ${job.attrs.data.message}`);
                        let reply = jobs.length !== 0
                            ? `**${jobs.length} announcement(s):**\n${announcements.join('\n')} `
                            : `There aren't any announcements currently.`;
                        await interaction.reply(reply);
                    },
                    remove: async (jobIndex) => {
                        let jobs = await getJobs({ jobName: 'sendAnnouncement' });
                        try {
                            await jobs[jobIndex].remove();
                            await interaction.reply('Okay! announcement canceled.');
                        } catch (e) {
                            interaction.reply('Sorry, no announcement found with that index');
                        }
                    }
                }
            );

        }
    }
};