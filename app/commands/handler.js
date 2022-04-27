import { log } from '../../index.js';

// Note: no validation being done because Discord does that for us

/**
 * Takes an interaction and a set of handlers, and then calls the handler that matches the interaction's command name
 * @param interaction - The interaction object that was sent to the bot.
 * @param {Object} handlers - An object containing all the command handlers.
 */
export const commandHandler = async (interaction, handlers) => {
    let cmdName = interaction.options.data[0].name;
    let cmdOptions = interaction.options.data[0].options.map(option => option.value);
    handlers[cmdName](...cmdOptions);
};