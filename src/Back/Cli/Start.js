/**
 * Start the bot in the long pooling mode.
 * @namespace Telegram_Bot_Back_Cli_Start
 */

// FUNCS
/**
 * Factory to create CLI command.
 *
 * @param {Telegram_Bot_Back_Defaults} DEF
 * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
 * @param {TeqFw_Core_Back_Api_Dto_Command.Factory} fCommand
 * @param {TeqFw_Core_Back_Mod_App_Pid} modPid
 * @param {Telegram_Bot_Back_Mod_Bot} modBot
 *
 * @returns {TeqFw_Core_Back_Api_Dto_Command}
 *
 * @memberOf Telegram_Bot_Back_Cli_Start
 */
export default function Factory(
    {
        Telegram_Bot_Back_Defaults$: DEF,
        TeqFw_Core_Shared_Api_Logger$$: logger,
        'TeqFw_Core_Back_Api_Dto_Command.Factory$': fCommand,
        TeqFw_Core_Back_Mod_App_Pid$: modPid,
        Telegram_Bot_Back_Mod_Bot$: modBot,
    }
) {

    // FUNCS
    /**
     * Parse command line options and start server in requested mode.
     *
     * @param {Object} opts command options
     * @returns {Promise<void>}
     * @memberOf Telegram_Bot_Back_Cli_Start
     */
    const action = async function (opts = null) {
        logger.info('Starting the bot in the long pooling mode.');
        try {
            await modPid.writePid(DEF.DATA_FILE_PID);
            const bot = await modBot.initBot();
            bot.start().catch(logger.exception);
            logger.info(`The bot is started in the long pooling mode.`);
        } catch (e) {
            logger.exception(e);
        }
    };

    // COMPOSE RESULT
    const res = fCommand.create();
    res.realm = DEF.CLI_PREFIX;
    res.name = 'start';
    res.desc = 'start the bot in the long pooling mode';
    res.action = action;
    return res;
}