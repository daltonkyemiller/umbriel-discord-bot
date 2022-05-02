import { umbriel, log } from '../../index.js';
import { AGENDA } from '../../index.js';

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
        let user = await umbriel.discordClient.users.fetch(userId);
        try {
            await user.send(message);
            await job.remove();
        } catch (error) {
            log.error(error);
        }
    });

    AGENDA.define('sendAnnouncement', async (job) => {
        const { message, channel } = job.attrs.data;
        try {
            let announceChannel = await umbriel.discordClient.channels.fetch(channel);
            await announceChannel.send(`@everyone ${message}`);
            await job.remove();

        } catch (e) {
            log.error(e);
        }
    });
};
