/**
 * Local configuration DTO for the plugin (the `@flancer32/teq-telegram-bot` node in the `./etc/local.json` file).
 * @see TeqFw_Core_Back_Config
 */
// MODULE'S VARS
const NS = 'Telegram_Bot_Back_Plugin_Dto_Config_Local';

// MODULE'S CLASSES
/**
 * @memberOf Telegram_Bot_Back_Plugin_Dto_Config_Local
 */
class Dto {
    static namespace = NS;
    /** @type {string} */
    apiKeyTelegram;
    /** @type {boolean} */
    webhookUseSecret;
}

/**
 * @implements TeqFw_Core_Shared_Api_Factory_Dto
 */
export default class Telegram_Bot_Back_Plugin_Dto_Config_Local {
    /**
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     */
    constructor(
        {
            TeqFw_Core_Shared_Util_Cast$: cast,
        }
    ) {
        /**
         * @param {Telegram_Bot_Back_Plugin_Dto_Config_Local.Dto} data
         * @return {Telegram_Bot_Back_Plugin_Dto_Config_Local.Dto}
         */
        this.createDto = function (data) {
            // create new DTO and populate it with initialization data
            const res = Object.assign(new Dto(), data);
            // cast known attributes
            res.apiKeyTelegram = cast.string(data?.apiKeyTelegram);
            res.webhookUseSecret = cast.boolean(data?.webhookUseSecret);
            return res;
        };
    }
}