/**
 * Plugin constants (hardcoded configuration) for backend code.
 */
export default class Telegram_Bot_Back_Defaults {

    CLI_PREFIX = 'app';

    DATA_FILE_PID = './var/telegram-bot.pid'; // PID file to stop running the bot.

    /** @type {TeqFw_Web_Back_Defaults} */
    MOD_WEB;

    /** @type {Telegram_Bot_Shared_Defaults} */
    SHARED;

    /**
     *
     * @param {TeqFw_Web_Back_Defaults} MOD_WEB
     * @param {Telegram_Bot_Shared_Defaults} SHARED
     */
    constructor(
        {
            TeqFw_Web_Back_Defaults$: MOD_WEB,
            Telegram_Bot_Shared_Defaults$: SHARED,
        }
    ) {
        this.MOD_WEB = MOD_WEB;
        this.SHARED = SHARED;
        Object.freeze(this);
    }
}
