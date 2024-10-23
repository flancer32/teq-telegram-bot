/**
 * An interface for a middleware factory for grammY-based bots.
 * This interface defines a blueprint for creating middleware functions
 * that can be used in bots built with the grammY framework.
 *
 * @interface
 */
export default class Telegram_Bot_Back_Api_Factory_Middleware {
    /**
     * Creates a middleware function compatible with the grammY framework.
     *
     * @param {Object} [opts] - An optional object to configure the middleware.
     *                          Configuration options are specific to the type
     *                          of middleware being created.
     * @return {function(ctx: Object, next: Function): Promise<void>}
     *         A grammY middleware function. The function receives the context
     *         (`ctx`), which contains information about the update or message
     *         the bot is handling, and the `next` function, which passes control
     *         to the next middleware in the stack.
     */
    create(opts = {}) {
        throw new Error('Please implement this method.');
    }
}
