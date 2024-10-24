import {GrammyError, HttpError} from 'grammy';

/**
 * Class for handling exceptions in a grammY bot.
 * This class sets up an error handler for bot updates,
 * logging errors and providing insights into the nature of the issue.
 *
 * ATTN: You can overwrite this implementation with your own in `teqfw.json`.
 */
export default class Telegram_Bot_Back_Mod_Bot_Catch {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger - Logger instance for logging errors.
     */
    constructor({TeqFw_Core_Shared_Api_Logger$$: logger}) {
        /**
         * Sets up the error handler for the given bot.
         * @param {Bot} bot - The grammY bot instance.
         */
        this.setup = (bot) => {
            bot.catch((err) => {
                const ctx = err.ctx;
                const e = err.error;

                // Log the update ID
                logger.error(`Error while handling update ${ctx.update?.update_id}:`);

                // Handle specific GrammyError for user blocking
                if (e instanceof GrammyError && e.error_code === 403) {
                    logger.error(`User blocked the bot while sending a message to chat_id ${e.parameters?.chat_id}.`);
                    return; // Skip further logging for this specific error
                }

                // Log other types of errors
                if (e instanceof GrammyError) {
                    logger.error(`Error in request: ${e.description}`);
                } else if (e instanceof HttpError) {
                    logger.error('Could not contact Telegram:');
                } else {
                    logger.error('Unknown error:');
                }

                // Log the complete error exception
                logger.exception(e);
            });
        };
    }
}
