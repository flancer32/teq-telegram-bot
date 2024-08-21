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
const WRONG_TOKEN_ERROR = 'secret token is wrong';

// CLASSES
export default class Telegram_Bot_Back_Mod_Bot {
    /**
     * @param {Telegram_Bot_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Core_Back_Config} config
     * @param {Telegram_Bot_Back_Api_Setup} apiSetup
     */
    constructor(
        {
            Telegram_Bot_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Core_Back_Config$: config,
            Telegram_Bot_Back_Api_Setup$: apiSetup,
        }
    ) {
        // VARS
        const {Bot, webhookCallback} = Grammy;
        /** @type {Telegram_Bot_Back_Plugin_Dto_Config_Local.Dto} */
        const _CFG = config.getLocal(DEF.SHARED.NAME);
        /** @type {Bot} */
        let _bot;
        /**
         * A `secret_token` for `X-Telegram-Bot-Api-Secret-Token` header.
         * @type {string}
         */
        let _webhookToken = randomUUID();

        // FUNCS
        /**
         * @typedef {Object} WebhookAdapter
         * @property {function(): *} unauthorized
         * @property {Promise<unknown>} update
         * @property {string} header
         * @property {function(): *} end
         * @property {function(*): *} respond
         */

        /**
         * The adapter for the Grammy Bot to interconnect with HTTP request/response.
         * @param {IncomingMessage|Http2ServerRequest} req
         * @param {ServerResponse|Http2ServerResponse} res
         * @return {WebhookAdapter}
         */
        function webhookAdapter(req, res) {
            const secretHeaderFromRequest = req.headers[SECRET_HEADER_LOWERCASE];
            return {
                update: new Promise((resolve) => {
                    const shared = req[DEF.MOD_WEB.HNDL_SHARE];
                    const jsonObj = shared[DEF.MOD_WEB.SHARE_REQ_BODY_JSON];
                    resolve(jsonObj);
                }),
                header: Array.isArray(secretHeaderFromRequest)
                    ? secretHeaderFromRequest[0]
                    : secretHeaderFromRequest,
                end: () => res.end(),
                respond: (json) => res
                    .writeHead(200, {'Content-Type': 'application/json'})
                    .end(json),
                unauthorized: () => res.writeHead(401).end(WRONG_TOKEN_ERROR),
            };
        }

        // MAIN

        /**
         * Get the imported Grammy ES module.
         * @return {Object}
         */
        this.getGrammy = () => Grammy;

        /**
         * Initialize the bot with API key from local config.
         * @param {Object} opts - @see https://github.com/grammyjs/grammY/blob/v1.29.0/src/bot.ts#L104
         * @return {Promise<Bot>}
         */
        this.initBot = async function (opts = null) {
            if (!_bot) {
                if (!_CFG?.apiKeyTelegram) {
                    throw `Cannot find API key to connect to Telegram. Please, add the key to './cfg/local.json'.`;
                } else {
                    _bot = new Bot(_CFG.apiKeyTelegram, opts);
                    await apiSetup.commands(_bot);
                    apiSetup.handlers(_bot);
                    logger.info(`All command handlers are set for the bot.`);
                    logger.info(`The Telegram bot is initialized.`);
                }
            }
            return _bot;
        };

        /**
         * Set up the endpoint to get HTTP requests from Telegram server and return the handler for NodeJS HTTP/2(S) servers.
         * @return {Promise<ReqResHandler>}
         * @see https://github.com/grammyjs/grammY/blob/v1.29.0/src/convenience/frameworks.ts#L23
         */
        this.initWebhookAdapter = async function () {
            // FUNCS
            function composeEndpoint() {
                /** @type {TeqFw_Web_Back_Plugin_Dto_Config_Local.Dto} */
                const cfg = config.getLocal(DEF.MOD_WEB.SHARED.NAME);
                const base = cfg.urlBase;
                return `https://${base}/` + DEF.SHARED.SPACE_BOT;
            }

            // MAIN
            const bot = await this.initBot();
            const res = webhookCallback(bot, webhookAdapter, 'throw', 1000, _webhookToken);

            const endpoint = composeEndpoint();
            const opts = {secret_token: _webhookToken};
            const isSet = await bot.api.setWebhook(endpoint, opts);
            if (isSet) {
                logger.info(`The endpoint '${endpoint}' for the webhook is set on Telegram server.`);
            } else {
                throw new Error(`Cannot set the endpoint for the webhook on Telegram server.`);
            }
            return res;
        };
    }
}
