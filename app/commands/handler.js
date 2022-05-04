// Note: no validation being done because Discord does that for us

import { log } from '../../app.js';

/**
 * Takes an interaction and a set of handlers, and then calls the handler that matches the interaction's command name
 * @param interaction - The interaction object that was sent to the bot.
 * @param {Object} handlers - An object containing all the command handlers.
 */
export const commandHandler = async (interaction, handlers) => {
    let cmdName = interaction.commandName;
    let cmdOptions = interaction.options.data;

    let subCommandName = interaction.options.data[0].name;
    let subCommandOptions = interaction.options.data[0].options;

    // If there are subcommand options, use them, if not, use main command options
    let options = subCommandOptions
        ? subCommandOptions.map(option => option.value)
        : cmdOptions.map(option => option.value);

    log.info(`${interaction.user.username} used the ${cmdName} command`);
    handlers[subCommandName](...options);
};