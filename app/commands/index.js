import { REMINDERS } from './reminder.js';
import { log } from '../../index.js';
import { ANNOUNCEMENTS } from './announcements.js';


export const COMMANDS = {
    ...ANNOUNCEMENTS,
    ...REMINDERS,
};

export const onMessageCreate = (msg) => {
    let senderPerms = msg.member.permissionsIn(msg.channel).toArray();
};









