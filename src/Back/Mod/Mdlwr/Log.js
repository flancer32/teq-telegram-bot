/**
 * Middleware for logging user messages and intercepting errors in a grammY bot.
 * Logs incoming message details such as username, user ID, message ID, and chat ID,
 * and captures any errors during execution for better error handling.
 *
 * @implements {Telegram_Bot_Back_Api_Factory_Middleware}
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
                try {
                    // Log the incoming message if it exists
                    const {message} = ctx;
                    if (message && message.from && message.chat) {
                        const {username: user, id: userId} = message.from;
                        const {message_id: msgId, chat: {id: chatId}} = message;
                        logger.info(`[${chatId}][${msgId}][${user}][${userId}] ${message.text}`);
                    }
                    // Proceed to the next middleware
                    await next();
                } catch (err) {
                    logger.error(`An error occurred during middleware execution: ${err}`);
                    // Optionally, rethrow the error to allow further handling
                    // throw err;
                }
            };
        };
    }
}
