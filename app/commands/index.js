import { REMINDERS } from './reminders.js';
import { log } from '../../index.js';
import { ANNOUNCEMENTS } from './announcements.js';
import { STATS } from './stats.js';
import { CLIENT_COMMANDS } from './admin/client.js';
import { ADMIN_COMMANDS } from './admin/index.js';


export const COMMANDS = {
    ...ANNOUNCEMENTS,
    ...REMINDERS,
    ...STATS,
    ...ADMIN_COMMANDS
};











