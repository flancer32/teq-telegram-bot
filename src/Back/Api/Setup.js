/**
 * Interface for setting up a bot with event handlers, commands, and middleware.
 * @interface
 */
export default class Telegram_Bot_Back_Api_Setup {
    /**
     * Set up commands for the given `bot`.
     * @see https://grammy.dev/ref/core/api#setmycommands
     * @see https://core.telegram.org/bots/features#commands
     *
     * @param {Bot} bot - A grammY bot instance.
     * @return {Promise<void>}
     */
    async commands(bot) {
        throw new Error('Please implement this method.');
    }

    /**
     * Set up description for the given `bot`.
     *
     * @param {Bot} bot - A grammY bot instance.
     * @return {Promise<void>}
     * @see https://core.telegram.org/bots/api#setmydescription
     */
    async description(bot) {
        throw new Error('Please implement this method.');
    }

    /**
     * Set up event handlers for the given `bot`.
     *
     * @param {Bot} bot - A grammY bot instance.
     * @return {Promise<void>}
     */
    async handlers(bot) {
        throw new Error('Please implement this method.');
    }

    /**
     * Set up middleware for the given `bot`.
     *
     * @param {Bot} bot - A grammY bot instance.
     * @return {Promise<void>}
     */
    async middleware(bot) {
        throw new Error('Please implement this method.');
    }
}
