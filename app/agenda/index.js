import { log, DISCORD_CLIENT } from '../../app.js';
import { AGENDA } from '../../app.js';
import { MessageEmbed } from 'discord.js';
import { randomBetween } from '../utils/index.js';

export const getJobs = async ({ userId, jobName }) => {
    let query = {
        $and: [
            jobName ? { 'name': jobName } : {},
            userId ? { 'data.userId': userId } : {}
        ]
    };
    return await AGENDA.jobs(query);
};

export const defineAgendaTasks = () => {
    AGENDA.define('sendDM', async (job) => {
        const { userId, message } = job.attrs.data;
        let user = await DISCORD_CLIENT.users.fetch(userId);
        try {
            await user.send(message);
            await job.remove();
        } catch (error) {
            log.error(error);
        }
    });

    AGENDA.define('sendAnnouncement', async (job) => {
        const { message, channelId } = job.attrs.data;
        try {
            let announceChannel = await DISCORD_CLIENT.channels.cache.get(channelId);
            await announceChannel.send('@everyone');
            await announceChannel.send(
                {
                    embeds:
                        [
                            new MessageEmbed()
                                .setTitle('ANNOUNCEMENT')
                                .setColor('RANDOM')
                                .setDescription(message)
                        ]
                });
            await job.remove();

        } catch (e) {
            log.error(e);
        }
    });

    AGENDA.define('checkPoll', async (job) => {
        const { channelId, poll, pollObjs } = job.attrs.data;
        const channel = await DISCORD_CLIENT.channels.cache.get(channelId);
        const message = await channel.messages.cache.get(poll);


        // Gets poll with most votes
        const winner = pollObjs.reduce((acc, curr) => {
            const accCount = message.reactions.cache.get(acc.emoji.id).count;
            const currCount = message.reactions.cache.get(curr.emoji.id).count;

            // If acc and curr have same num of votes, pick a random one.
            if (currCount === accCount) return randomBetween(0, 1) ? curr : acc;
            if (currCount > accCount) return curr;
            return acc;
        }, pollObjs[0]);

        await channel.send(`THE WINNER IS... ***${winner.item}(${winner.emoji.content})***`);
        await job.remove();
    });
};
