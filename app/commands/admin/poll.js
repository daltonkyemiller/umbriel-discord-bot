import { SlashCommandBuilder } from '@discordjs/builders';
import { commandHandler } from '../handler.js';
import { AGENDA, log } from '../../../app.js';
import { getRandomResponse } from '../../utils/index.js';
import { POSITIVE_RESPONSES } from '../../messages/index.js';
import { EMOJIS } from '../../utils/constants.js';
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
                add: async (items, length) => {
                    let emojis = EMOJIS;

                    const pollObjs = items.split(', ').map((item, idx) => {
                        const randomEmoji = getRandomResponse(emojis);
                        emojis.splice(emojis.indexOf(randomEmoji), 1);
                        return {
                            id: idx,
                            item: item,
                            emoji: getRandomResponse(EMOJIS)
                        };
                    });
                    let poll = await interaction.reply({
                        embeds: [formatPoll(pollObjs)],
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

const formatPoll = (options) => {
    return new MessageEmbed()
        .setTitle('POLL')
        .setDescription(options.map(option => `React with ${option.emoji} for ***${option.item}*** \n\n`).toString().replaceAll(',', ''));
};