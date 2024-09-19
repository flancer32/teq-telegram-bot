/**
 * Stop the bot has been started in the long polling mode.
 * @namespace Telegram_Bot_Back_Cli_Stop
 */

// FUNCS
/**
 * Factory to create CLI command.
 *
 * @param {Telegram_Bot_Back_Defaults} DEF
 * @param {TeqFw_Core_Back_App} app
 * @param {TeqFw_Core_Back_Api_Dto_Command.Factory} fCommand
 * @param {TeqFw_Core_Back_Mod_App_Pid} modPid
 * @returns {TeqFw_Core_Back_Api_Dto_Command}
 * @memberOf Telegram_Bot_Back_Cli_Stop
 */
export default function Factory(
    {
        Telegram_Bot_Back_Defaults$: DEF,
        TeqFw_Core_Back_App$: app,
        ['TeqFw_Core_Back_Api_Dto_Command.Factory$']: fCommand,
        TeqFw_Core_Back_Mod_App_Pid$: modPid,
    }
) {
    // FUNCS
    /**
     * Stop previously started NodeJS application (using PID file).
     * @returns {Promise<void>}
     * @memberOf Telegram_Bot_Back_Cli_Stop
     */
    const action = async function () {
        // get PID and stop previously started process
        const pid = await modPid.readPid(DEF.DATA_FILE_PID);
        if (pid) modPid.stop(pid);
        // stop the current process
        await app.stop();
    };

    // COMPOSE RESULT
    const res = fCommand.create();
    res.realm = DEF.CLI_PREFIX;
    res.name = 'stop';
    res.desc = 'stop the bot has been started in the long polling mode';
    res.action = action;
    return res;
}