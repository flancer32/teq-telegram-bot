/**
 * The web server handler to block API requests for unauthorized users.
 */
// MODULE'S IMPORT
import {constants as H2} from 'node:http2';
// MODULE'S VARS
const {
    HTTP2_METHOD_POST,
} = H2;


// MODULE'S CLASSES
// noinspection JSClosureCompilerSyntax
/**
 * @implements TeqFw_Web_Back_Api_Dispatcher_IHandler
 */
export default class Telegram_Bot_Back_Web_Handler_Bot {
    /**
     * @param {Telegram_Bot_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Web_Back_Mod_Address} modAddress
     * @param {Telegram_Bot_Back_Ext_Grammy} extGrammy
     */
    constructor(
        {
            Telegram_Bot_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Back_Mod_Address$: modAddress,
            Telegram_Bot_Back_Ext_Grammy$: extGrammy,
        }
    ) {
        /** @type {function} */
        let _hook;

        // FUNCS
        /**
         * Process HTTP request if not processed before.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         * @memberOf Telegram_Bot_Back_Web_Handler_Bot
         */
        async function process(req, res) {
            // FUNCS


            // MAIN
            const path = req.url;
            logger.info(path);
            try {
                await _hook(req, res);
            } catch (e) {
                logger.exception(e);
            }
        }

        // INSTANCE METHODS

        this.getProcessor = () => process;

        this.init = async function () {
            _hook = extGrammy.getWebhook();
            const endpoint = 'https://weather.dev.tg.wiredgeese.com/' + DEF.SHARED.SPACE_BOT;
            const isSet = await extGrammy.getBot().api.setWebhook(endpoint);
        };

        this.canProcess = function ({method, address} = {}) {
            return (
                (method === HTTP2_METHOD_POST)

            );
        };
    }
}
