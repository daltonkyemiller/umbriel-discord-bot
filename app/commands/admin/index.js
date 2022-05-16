import { CLIENT_COMMANDS } from './client.js';
import { HELPER_COMMANDS } from './helpers.js';
import { POLL_COMMANDS } from './poll.js';


export const ADMIN_COMMANDS = {
    ...CLIENT_COMMANDS,
    ...HELPER_COMMANDS,
    ...POLL_COMMANDS
};