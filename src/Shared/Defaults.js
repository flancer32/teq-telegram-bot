/**
 * Plugin constants (hardcoded configuration) for shared code.
 */
export default class Telegram_Bot_Shared_Defaults {
    // The unique name (usually the NPM package name) for this plugin's resources in the platform area (configuration, etc.).
    NAME = '@flancer32/teq-telegram-bot';

    // The URL segment to flag the HTTP requests to the Telegram bot.
    SPACE_BOT = 'telegram-bot';

    constructor() {
        Object.freeze(this);
    }
}
