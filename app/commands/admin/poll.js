import { SlashCommandBuilder } from '@discordjs/builders';
import { commandHandler } from '../handler.js';
import { AGENDA, DISCORD_CLIENT, log } from '../../../app.js';
import { getRandomResponse } from '../../utils/index.js';
import { POSITIVE_RESPONSES } from '../../messages/index.js';
import { MessageEmbed } from 'discord.js';

export const POLL_COMMANDS = {
    poll: {
        data: new SlashCommandBuilder()
            .setName('poll')
            .setDescription('Manages polls')
            .setDefaultPermission(false)
            .addSubcommand(add =>
                add
                    .setName('add')
                    .setDescription('adds a poll')
                    .addStringOption(title =>
                        title
                            .setName('title')
                            .setDescription('Set the title of the poll')
                            .setRequired(true)
                    )
                    .addStringOption(items =>
                        items
                            .setName('items')
                            .setDescription('items seperated by comma')
                            .setRequired(true)
                    )
                    .addStringOption(length =>
                        length
                            .setName('length')
                            .setDescription('How long to run the poll for?')
                            .setRequired(true)
                    )
            ),
        execute: async (interaction) => {
            await commandHandler(interaction, {
                add: async (title, items, length) => {

                    // Get server's custom emojis and create an emoji object
                    let emojis = interaction.guild.emojis.cache.map(emoji => ({
                        name: emoji.name,
                        id: emoji.id,
                        content: `<:${emoji.name}:${emoji.id}>`
                    }));

                    // Split each  
                    const pollObjs = items.split(', ').map((item, idx) => {
                        const randomEmoji = getRandomResponse(emojis);
                        emojis.splice(emojis.indexOf(randomEmoji), 1);
                        return {
                            id: idx,
                            item: item,
                            emoji: randomEmoji
                        };
                    });
                    let poll = await interaction.reply({
                        embeds: [formatPoll(title, pollObjs)],
                        fetchReply: true
                    });
                    for (const pollObj of pollObjs) {
                        await poll.react(pollObj.emoji);
                    }
                    await AGENDA.schedule(length, 'checkPoll', {
                        channelId: interaction.channelId,
                        poll: poll.id,
                        pollObjs: pollObjs
                    });
                }
            });
        }
    }
};

const formatPoll = (title, options) => {
    return new MessageEmbed()
        .setTitle(title)
        .setColor('RANDOM')
        .setDescription(options.map(option => `React with ${option.emoji.content} for ***${option.item}*** \n\n`).toString().replaceAll(',', ''));
};