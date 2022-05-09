import { updateUser } from '../db/index.js';
import { DISCORD_CLIENT } from '../../app.js';

export * from './responses.js';

export const messageHandler = async (msg) => {
    if (msg.mentions.has(DISCORD_CLIENT.user)) await msg.reply('WHAT??');
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