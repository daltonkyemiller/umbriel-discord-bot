import { updateUser } from '../db/index.js';

export * from './responses.js';

export const messageHandler = async (msg) => {
    await updateUserChatStats(msg);
};

const updateUserChatStats = async (msg) => {
    let msgAttachementsLength = Array.from(msg.attachments).filter(msg => msg[1].contentType.includes('image')).length;
    await updateUser(msg.author, {
        $inc: {
            'chatStats.charsTyped': msg.content.length,
            'chatStats.wordsTyped': msg.content.split(' ').length,
            'chatStats.imagesSent': msgAttachementsLength
        }
    });
};