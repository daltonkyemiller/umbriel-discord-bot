import { TESTS } from './test.js';
import { log } from '../../index.js';


export const COMMANDS = {
    ...TESTS
};

export const onMessageCreate = (msg) => {
    let senderPerms = msg.member.permissionsIn(msg.channel).toArray();
    
};








