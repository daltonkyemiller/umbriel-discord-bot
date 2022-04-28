import { REMINDERS } from './reminders.js';
import { log } from '../../index.js';
import { ANNOUNCEMENTS } from './announcements.js';
import { STATS } from './stats.js';


export const COMMANDS = {
    ...ANNOUNCEMENTS,
    ...REMINDERS,
    ...STATS
};











