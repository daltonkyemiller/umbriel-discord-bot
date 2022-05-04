import { CLIENT_COMMANDS } from './client.js';
import { HELPER_COMMANDS } from './helpers.js';


export const ADMIN_COMMANDS = {
    ...CLIENT_COMMANDS,
    ...HELPER_COMMANDS
};