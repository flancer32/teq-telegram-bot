/**
 * Manages callback data handling for inline keyboards in a Telegram bot.
 * This class registers callback handlers with unique identifiers, processes
 * incoming callback queries, and appends identifiers to inline keyboard data.
 */

/**
 * Map entry for storing a handler and its associated timeout cleanup.
 */
class MapEntry {
    /**
     * @param {function(callbackCtx: Object): Promise<void>} handler - The callback handler function.
     * @param {number} timeoutCleanup - The timeout ID for auto-removal.
     */
    constructor(handler, timeoutCleanup) {
        this.handler = handler;
        this.timeoutCleanup = timeoutCleanup;
    }
}

export default class Telegram_Bot_Back_Mod_Handler_Callback_Query_Data {
    /**
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     */
    constructor({TeqFw_Core_Shared_Api_Logger$$: logger}) {
        // VARS
        /** @type {Map<string, MapEntry>} */
        const handlers = new Map();
        const SEP = ':';  // Separator for uniqueId and original callback data
        const TIMEOUT = 30000;  // Default timeout duration in milliseconds

        // FUNCS
        /**
         * Generates a unique identifier based on the chat and message ID.
         * @param {Object} message - The Telegram message object.
         * @returns {string} - A unique ID string.
         */
        const createUniqueId = (message) => {
            const chatId = message.chat.id;
            const messageId = message.message_id;
            return `cb_${chatId}_${messageId}`;
        };

        // MAIN
        /**
         * Registers a new callback handler with an auto-removal timeout.
         * @param {function(callbackCtx: Object): Promise<void>} handler - The callback handler function.
         * @param {Object} ctx - The grammY `ctx` object, containing message context.
         * @param {Object} [opts={}] - Optional parameters for future extension.
         * @param {string} [opts.customId] - Custom unique identifier to override the default generated one.
         * @param {number} [opts.timeout] - Custom timeout duration in milliseconds for auto-removal.
         * @param {CommonMessage} [opts.sentMsg]
         */
        this.addHandler = (handler, ctx, {sentMsg, customId, timeout}) => {
            // Use custom ID if provided, otherwise generate a unique ID
            const uniqueId = customId || createUniqueId(ctx.message);

            // Clear existing timeout if handler with uniqueId already exists
            if (handlers.has(uniqueId)) {
                const existingEntry = handlers.get(uniqueId);
                clearTimeout(existingEntry.timeoutCleanup);
                logger.error(`Duplicate handler registration for ${uniqueId}`);
            }

            // Set up cleanup function to remove handler after timeout
            const timeoutDuration = timeout || TIMEOUT;
            const timeoutCleanup = setTimeout(() => {
                if (sentMsg) {
                    ctx.api
                        .editMessageText(sentMsg.chat.id, sentMsg.message_id, `This keyboard is expired.`)
                        .catch(logger.exception);
                }
                if (handlers.delete(uniqueId)) {
                    logger.info(`Handler for ${uniqueId} removed due to timeout`);
                }
            }, timeoutDuration);

            // Register handler with its timeout in MapEntry
            handlers.set(uniqueId, new MapEntry(handler, timeoutCleanup));
            logger.info(`Registered handler for ${uniqueId}`);
        };

        /**
         * Extracts the original callback data from the provided query data by removing the unique identifier.
         * @param {string} queryData - The full `callback_data` string containing the unique identifier and the original data.
         * @returns {string} - The original callback data without the unique identifier.
         */
        this.extractData = (queryData) => {
            // Split the queryData to separate unique ID and original callback data
            const [, originalData] = queryData.split(SEP, 2);
            return originalData || ''; // Return original data or an empty string if not present
        };

        /**
         * Handles incoming `callback_query:data` events and invokes the registered handler based on `uniqueId`.
         * If no handler is found, it sends a notification to the user and logs the event.
         * @param {Object} ctx - The callback context from grammY, containing information about the event.
         */
        this.handle = async (ctx) => {
            const data = ctx?.callbackQuery?.data || '';
            const [uniqueId, ...args] = data.split(SEP);

            const entry = handlers.get(uniqueId);
            if (entry?.handler) {
                await entry.handler(ctx);  // Execute handler with additional arguments
                clearTimeout(entry.timeoutCleanup);
                handlers.delete(uniqueId);  // Remove handler after execution
                logger.info(`Handler for ${uniqueId} executed and removed with timeout cleanup`);
            } else {
                logger.error(`No handler found for ${uniqueId}, callback data: ${data}`);
                await ctx.answerCallbackQuery({
                    text: 'This action is no longer valid.',
                    show_alert: true,
                });
            }
        };

        /**
         * Updates each button's `callback_data` in the inline keyboard by attaching a unique identifier.
         * @param {InlineKeyboard} keyboard - The original inline keyboard to update.
         * @param {Object} message - The Telegram message object to generate a unique identifier.
         */
        this.updateInlineKeyboard = (keyboard, message) => {
            const uniqueId = createUniqueId(message);

            if (Array.isArray(keyboard?.inline_keyboard)) {
                for (const row of keyboard.inline_keyboard) {
                    for (const btn of row) {
                        if (btn?.callback_data) {
                            btn.callback_data = `${uniqueId}${SEP}${btn.callback_data}`;
                        }
                    }
                }
            }
        };
    }
}
