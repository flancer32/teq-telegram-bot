/**
 * Populate the bot with event handlers.
 * @interface
 */
export default class Telegram_Bot_Back_Api_Setup {
    /**
     * Get the list of available commands.
     * @see https://grammy.dev/ref/core/api#setmycommands
     * @see https://core.telegram.org/bots/features#commands
     *
     * @return {[{command: string, description: string}]}
     */
    getCommands() {
        throw new Error('Please implement this method.');
    }

    /**
     * @param {Bot} bot - @see https://github.com/grammyjs/grammY/blob/v1.29.0/src/bot.ts#L151
     * @return {Bot}
     */
    handlers(bot) {
        throw new Error('Please implement this method.');
    }

}