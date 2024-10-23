/**
 * The internal model for a Telegram bot based on the `grammy` lib.
 * @see https://grammy.dev/
 */
// IMPORTS
import Grammy from 'grammy';
import {randomUUID} from 'crypto';

// VARS
const SECRET_HEADER = 'X-Telegram-Bot-Api-Secret-Token';
const SECRET_HEADER_LOWERCASE = SECRET_HEADER.toLowerCase();
const WRONG_TOKEN_ERROR = 'Secret token is incorrect';

// CLASSES
export default class Telegram_Bot_Back_Mod_Bot {
    /**
     * @param {Telegram_Bot_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {TeqFw_Core_Back_Config} config
     * @param {Telegram_Bot_Back_Api_Setup} apiSetup
     */
    constructor({
                    Telegram_Bot_Back_Defaults$: DEF,
                    TeqFw_Core_Shared_Api_Logger$$: logger,
                    TeqFw_Core_Back_Config$: config,
                    Telegram_Bot_Back_Api_Setup$: apiSetup
                }) {
        // VARS
        const {Bot, webhookCallback, InputFile} = Grammy;
        const _CFG = config.getLocal(DEF.SHARED.NAME);
        const _WEB = config.getLocal(DEF.MOD_WEB.SHARED.NAME);
        let _bot;
        let _webhookToken = randomUUID();

        // FUNCS
        /**
         * The adapter for the Grammy Bot to interconnect with HTTP request/response.
         * @param {IncomingMessage|Http2ServerRequest} req
         * @param {ServerResponse|Http2ServerResponse} res
         * @return {WebhookAdapter}
         */
        const webhookAdapter = (req, res) => {
            const secretHeaderFromRequest = req.headers[SECRET_HEADER_LOWERCASE];
            return {
                update: new Promise((resolve) => {
                    const shared = req[DEF.MOD_WEB.HNDL_SHARE];
                    const jsonObj = shared[DEF.MOD_WEB.SHARE_REQ_BODY_JSON];
                    resolve(jsonObj);
                }),
                header: Array.isArray(secretHeaderFromRequest) ? secretHeaderFromRequest[0] : secretHeaderFromRequest,
                end: () => res.end(),
                respond: (json) => res.writeHead(200, {'Content-Type': 'application/json'}).end(json),
                unauthorized: () => res.writeHead(401).end(WRONG_TOKEN_ERROR),
            };
        };

        // MAIN
        /**
         * Initialize the bot with API key from local config.
         * @param {Object} opts - @see https://github.com/grammyjs/grammY/blob/v1.29.0/src/bot.ts#L104
         * @return {Promise<Bot>}
         */
        this.initBot = async (opts = null) => {
            if (!_bot) {
                if (!_CFG?.apiKeyTelegram) {
                    throw new Error(`Telegram API key not found. Please add it to './cfg/local.json'.`);
                }
                _bot = new Bot(_CFG.apiKeyTelegram, opts);
                await apiSetup.middleware(_bot);
                await apiSetup.commands(_bot);
                await apiSetup.handlers(_bot);
                logger.info('All command handlers are set for the bot.');
                logger.info('The Telegram bot is initialized.');
            }
            return _bot;
        };

        /**
         * Set up the endpoint for receiving HTTP requests from Telegram and return the handler for NodeJS HTTP/2(S) servers.
         * @return {Promise<ReqResHandler>}
         */
        this.initWebhookAdapter = async () => {
            // FUNCS
            const composeEndpoint = () => {
                const cfg = config.getLocal(DEF.MOD_WEB.SHARED.NAME);
                const base = cfg.urlBase;
                return `https://${base}/` + DEF.SHARED.SPACE_BOT;
            };

            //MAIN
            const bot = await this.initBot();
            const res = webhookCallback(bot, webhookAdapter, 'throw', 1000, _webhookToken);

            const endpoint = composeEndpoint();
            const opts = {secret_token: _webhookToken};

            if (_WEB?.server?.secure?.cert && _WEB?.server?.secure?.key) {
                opts.certificate = new InputFile(_WEB.server.secure.cert);
                logger.info(`Certificate '${_WEB.server.secure.cert}' is used with webhook.`);
            }

            const isSet = await bot.api.setWebhook(endpoint, opts);
            if (isSet) {
                logger.info(`Webhook endpoint '${endpoint}' set successfully on Telegram server.`);
            } else {
                throw new Error(`Failed to set webhook endpoint on Telegram server.`);
            }

            return res;
        };
    }
}
