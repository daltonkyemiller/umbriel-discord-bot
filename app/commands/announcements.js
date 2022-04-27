import { SlashCommandBuilder } from '@discordjs/builders';

// TODO

export const ANNOUNCEMENTS = {
    announcements: {
        data: new SlashCommandBuilder()
            .setName('announcement')
            .setDescription('Set an announcement')
            // .setDefaultPermission(false)
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
        execute: (interaction) => {

        }
    }
};