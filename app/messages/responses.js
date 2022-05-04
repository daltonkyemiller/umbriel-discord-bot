import { fetchUser, updateUser } from '../db/index.js';
import { log } from '../../app.js';

export const ERROR_RESPONSES = [
    'Sorry, that can\'t be done right now',
    'Sorry, could\'t complete your request',
    'Oopsies, I can\'t do that one right now'
];