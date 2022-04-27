import { SlashCommandBuilder } from '@discordjs/builders';
import { commandHandler } from './handler.js';
import { agenda, log } from '../../index.js';

// TODO

export const ANNOUNCEMENTS = {
    announcements: {
        data: new SlashCommandBuilder()
            .setName('announcements')
            .setDescription('Set an announcement')
            .setDefaultPermission(false)
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
            ),
        execute: async (interaction) => {
            await commandHandler(interaction, {
                    add: async (what, when) => {
                        await agenda.schedule(when, 'sendAnnouncement', {
                            message: what,
                            channel: interaction.channelId
                        });
                        await interaction.reply('Okay! Announcement set.');
                    }
                }
            );

        }
    }
};