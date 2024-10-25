# @teq-telegram-bot: Releases

## 0.2.2 - TODO

- Bot description is added to `Telegram_Bot_Back_Api_Setup`.
- Added `Telegram_Bot_Back_Mod_Handler_Callback_Query_Data` for managing inline keyboard callback data with unique
  handler registration and execution.

## 0.2.1

* Added `Telegram_Bot_Back_Mod_Bot_Catch` class for error handling in the bot.
* Updated dependencies in `package.json` for `@grammyjs/conversations`, `grammy`, and added version ranges for
  `@teqfw/core`, `@teqfw/di`, `@teqfw/web`, and `@teqfw/test`.
* Enhanced constructor logic in `Telegram_Bot_Back_Mod_Bot` to include error handling.
* Improved logging logic for incoming messages and error handling in middleware.

## 0.2.0

* Introduced `Telegram_Bot_Back_Api_Factory_Middleware`.
* Added `Telegram_Bot_Back_Mod_Mdlwr_Log`.
* Middleware initialization has been added to the `initBot` method to ensure proper setup before commands and handlers.

## 0.1.1

* Added `@grammyjs/conversations` as a dependency.
* Added `@teqfw/di` as a development dependency.

## 0.1.0

* Initial release.
