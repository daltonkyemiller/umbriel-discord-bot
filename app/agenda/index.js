import { DISCORD_CLIENT, log } from '../../index.js';
import { agenda } from '../../index.js';

export const getJobs = async ({ userId, jobName }) => {
    let query = {
        $and: [
            jobName ? { 'name': jobName } : {},
            userId ? { 'data.userId': userId } : {}
        ]
    };
    return await agenda.jobs(query);
};

export const defineAgendaTasks = () => {
    agenda.define('sendDM', async (job) => {
        const { userId, message } = job.attrs.data;
        let user = await DISCORD_CLIENT.users.fetch(userId);
        try {
            await user.send(message);
            await job.remove();
        } catch (error) {
            log.error(error);
        }
    });

    agenda.define('sendAnnouncement', async (job) => {
        const { message, channel } = job.attrs.data;
        try {
            let announceChannel = await DISCORD_CLIENT.channels.fetch(channel);
            await announceChannel.send(`@everyone ${message}`);
            await job.remove();

        } catch (e) {
            log.error(e);
        }
    });
};
