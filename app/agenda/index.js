import { log, DISCORD_CLIENT } from '../../app.js';
import { AGENDA } from '../../app.js';
import { MessageEmbed } from 'discord.js';

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
};
