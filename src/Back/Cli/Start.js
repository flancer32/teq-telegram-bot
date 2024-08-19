/**
 * Start the bot in pooling mode.
 * @namespace Telegram_Bot_Back_Cli_Start
 */
// DEFINE WORKING VARS
const NS = 'Telegram_Bot_Back_Cli_Start';

// DEFINE MODULE'S FUNCTIONS
/**
 * Factory to create CLI command.
 *
 * @param {Telegram_Bot_Back_Defaults} DEF
 * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
 * @param {TeqFw_Core_Back_Config} config
 * @param {TeqFw_Core_Back_Api_Dto_Command.Factory} fCommand
 * @param {TeqFw_Core_Back_Mod_App_Pid} modPid
 * @param {Telegram_Bot_Back_Ext_Grammy} extGrammy
 *
 * @returns {TeqFw_Core_Back_Api_Dto_Command}
 *
 * @memberOf Telegram_Bot_Back_Cli_Start
 */
export default function Factory(
    {
        Telegram_Bot_Back_Defaults$: DEF,
        TeqFw_Core_Shared_Api_Logger$$: logger,
        TeqFw_Core_Back_Config$: config,
        'TeqFw_Core_Back_Api_Dto_Command.Factory$': fCommand,
        TeqFw_Core_Back_Mod_App_Pid$: modPid,
        Telegram_Bot_Back_Ext_Grammy$: extGrammy,
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
    const action = async function (opts) {
        logger.info('Starting web server.');
        try {
            await modPid.writePid(DEF.DATA_FILE_PID);
            const bot = extGrammy.getBot();
            bot.start().catch(logger.exception);
        } catch (e) {
            logger.exception(e);
        }
    };
    Object.defineProperty(action, 'namespace', {value: NS});

    // COMPOSE RESULT
    const res = fCommand.create();
    res.realm = DEF.CLI_PREFIX;
    res.name = 'start';
    res.desc = 'start the bot';
    res.action = action;
    return res;
}

// finalize code components for this es6-module
Object.defineProperty(Factory, 'namespace', {value: NS});
