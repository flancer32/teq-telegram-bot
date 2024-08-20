/**
 * The web server handler to process all requests from Telegram server.
 */
// IMPORT
import {constants as H2} from 'node:http2';

// VARS
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
     * @param {Telegram_Bot_Back_Mod_Bot} modBot
     */
    constructor(
        {
            Telegram_Bot_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            Telegram_Bot_Back_Mod_Bot$: modBot,
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
            try {
                logger.info(`Request URL: ${req.url}`);
                const shared = req[DEF.MOD_WEB.HNDL_SHARE];
                const jsonObj = shared[DEF.MOD_WEB.SHARE_REQ_BODY_JSON];
                logger.info(JSON.stringify(jsonObj));
                await _hook(req, res);
            } catch (e) {
                logger.exception(e);
            }
        }

        // INSTANCE METHODS

        this.getProcessor = () => process;

        this.init = async function () {
            logger.info(`== Initialize web requests handler for Telegram bot:`);
            _hook = await modBot.initWebhookAdapter();
            debugger
        };

        this.canProcess = function ({method, address} = {}) {
            return (
                (method === HTTP2_METHOD_POST)
                && (address?.space === DEF.SHARED.SPACE_BOT)
            );
        };
    }
}
