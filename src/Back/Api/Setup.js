/**
 * Populate the bot with event handlers.
 * @interface
 */
export default class Telegram_Bot_Back_Api_Setup {
    /**
     * Populate the given `bot` with commands.
     * @see https://grammy.dev/ref/core/api#setmycommands
     * @see https://core.telegram.org/bots/features#commands
     * @see https://core.telegram.org/bots/features#global-commands
     *
     * @param {Bot} bot - @see https://github.com/grammyjs/grammY/blob/v1.29.0/src/bot.ts#L151
     * @return {Promise<Bot>}
     */
    async commands(bot) {
        throw new Error('Please implement this method.');
    }

    /**
     * Populate the given `bot` with event handlers.
     * @param {Bot} bot - @see https://github.com/grammyjs/grammY/blob/v1.29.0/src/bot.ts#L151
     * @return {Bot}
     */
    handlers(bot) {
        throw new Error('Please implement this method.');
    }

}