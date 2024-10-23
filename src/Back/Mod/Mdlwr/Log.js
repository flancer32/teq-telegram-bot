/**
 * Creates middleware for logging user messages, including metadata such as
 * username, user ID, message ID, and chat ID.
 *
 * @implements Telegram_Bot_Back_Api_Factory_Middleware
 */
export default class Telegram_Bot_Back_Mod_Mdlwr_Log {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger - instance
     */
    constructor(
        {
            TeqFw_Core_Shared_Api_Logger$$: logger
        }
    ) {
        this.create = (opts) => {
            return async (ctx, next) => {
                const {message} = ctx;
                if (message) {
                    const {username: user, id: userId} = message.from;
                    const {message_id: msgId, chat: {id: chatId}} = message;
                    logger.info(`[${chatId}][${msgId}][${user}][${userId}] ${message?.text}`);
                }
                await next();
            };
        };
    }
}
