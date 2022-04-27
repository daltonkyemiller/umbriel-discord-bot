import { agenda, CLIENT, log } from '../../index.js';

export const getUserJobs = async (userId, jobName) => {
    let query = {
        $and: [
            jobName ? { 'name': jobName } : {},
            { 'data.userId': userId }
        ]
    };
    return await agenda.jobs(query);
};

export const defineAgendaTasks = () => {
    agenda.define('sendDM', async (job) => {
        const { userId, message } = job.attrs.data;
        let user = await CLIENT.users.fetch(userId);
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
            let announceChannel = await CLIENT.channels.fetch(channel);
            await announceChannel.send(`@everyone ${message}`);
            await job.remove();

        } catch (e) {

        }
    });

};
