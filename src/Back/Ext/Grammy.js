/**
 * The DI wrapper for an external dependency.
 */
// IMPORTS
import Grammy from 'grammy';

// CLASSES
export default class Telegram_Bot_Back_Ext_Grammy {
    /**
     * @param {Telegram_Bot_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger -  instance
     * @param {TeqFw_Core_Back_Config} config
     * @param {Telegram_Bot_Back_Mod_Weather} modWeather
     */
    constructor(
        {
            Telegram_Bot_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$: logger,
            TeqFw_Core_Back_Config$: config,
            Telegram_Bot_Back_Mod_Weather$: modWeather,
        }
    ) {
        // VARS
        const {Bot, Keyboard, webhookCallback} = Grammy;
        /** @type {Telegram_Bot_Back_Plugin_Dto_Config_Local.Dto} */
        const CFG = config.getLocal(DEF.SHARED.NAME);
        const _bot = new Bot(CFG.apiKeyTelegram);

        _bot.api.setMyCommands([
            {command: 'help', description: 'Show help text'},
            {command: 'settings', description: 'Open settings'},
            {command: 'start', description: 'Start the bot'},
            {command: 'weather', description: 'Get the weather for the current location.'},
        ]).catch(logger.exception);

        _bot.command('start', (ctx) => {
            ctx.reply('Privet, Tanja!');
        });

        _bot.command('weather', (ctx) => {
            const keyboard = new Keyboard()
                .text('Cancel') // Add another button to balance the size
                .row() // Move to the next row for the location button
                .requestLocation('📍 Share your location') // Location request button
                .resized()
                .build();

            ctx.reply('I need to know your location to provide a weather in your region.', {
                reply_markup: {
                    keyboard: keyboard,
                    one_time_keyboard: true,
                },
            }).catch(logger.exception);
        });

        _bot.on('message', async (ctx) => {
            console.log(`MSG: ` + JSON.stringify(ctx.message));
            if (ctx?.message?.location) {
                const location = ctx.message.location;
                const lat = location.latitude;
                const lng = location.longitude;
                const dto = await modWeather.current(lat, lng);
                if (dto?.location) {
                    const air = dto.air;
                    const cond = dto.condition;
                    const loc = dto.location;
                    //
                    const EPA = ((x) => {
                        switch (x) {
                            case 1:
                                return 'Хорошо'; //Good
                            case 2:
                                return 'Средне'; //Moderate
                            case 3:
                                return 'Нездорово для чувствительных'; //Unhealthy for sensitive group
                            case 4:
                                return 'Нездорово'; //Unhealthy
                            case 5:
                                return 'Плохо'; // Very Unhealthy
                            case 6:
                                return 'Опасно'; //Hazardous
                            default:
                                return 'Хрен поймёшь';
                        }
                    })(air['us-epa-index']);
                    //
                    let msg = `Вы туточки: ${loc.name}.`;
                    msg += `\nВоздух (CO2/Ozone/NO2/SO2/EPA): ${air.co}/${air.o3}/${air.no2}/${air.so2}/${EPA}.`;
                    msg += `\nТемпература: ${cond.temp_c}C; ощущается: ${cond.feelslike_c}C; жары: ${cond.heatindex_c}C.`;
                    msg += `\nВетер: ${cond.wind_kph} км/ч.`;
                    msg += `\nВлажность: ${cond.humidity}%; УФ: ${cond.uv}.`;
                    msg += `\nОблачность: ${cond.cloud} (${cond.text}).`;
                    msg += `\nДанный обновлены: ${cond.last_updated}.`;
                    ctx.reply(msg).catch(logger.exception);
                } else {
                    ctx.reply(`I cannot get the current weather for (lat,lng): ${lat}, ${lng}`).catch(logger.exception);
                }
                debugger
            } else {
                ctx.reply('This message is unknown for me :(').catch(logger.exception);
            }
        });


        // Handle the location sent by the user
        _bot.on('message:location', (ctx) => {
            const location = ctx.message.location;
            const latitude = location.latitude;
            const longitude = location.longitude;
            console.log(`Here we are!!` + JSON.stringify(ctx.message));
            ctx.reply(`Thank you! I received your location.\nLatitude: ${latitude}\nLongitude: ${longitude}`)
                .catch(logger.exception);
        });

        // INSTANCE METHODS
        this.getBot = function () {
            return _bot;
        };

        this.createKeyboard = function (opts = null) {
            return new Keyboard(opts);
        };

        this.getWebhook = function () {
            const adapter = (req, res) => {
                const SECRET_HEADER = 'X-Telegram-Bot-Api-Secret-Token';
                const SECRET_HEADER_LOWERCASE = SECRET_HEADER.toLowerCase();
                const WRONG_TOKEN_ERROR = 'secret token is wrong';
                const secretHeaderFromRequest = req.headers[SECRET_HEADER_LOWERCASE];
                return {
                    update: new Promise((resolve, reject) => {
                        const shared = req[DEF.MOD_WEB.HNDL_SHARE];
                        const jsonObj = shared[DEF.MOD_WEB.SHARE_REQ_BODY_JSON];
                        resolve(jsonObj);
                    }),
                    header: Array.isArray(secretHeaderFromRequest)
                        ? secretHeaderFromRequest[0]
                        : CFG.apiKeyTelegram,
                    end: () => res.end(),
                    respond: (json) => res
                        .writeHead(200, { "Content-Type": "application/json" })
                        .end(json),
                    unauthorized: () => res.writeHead(401).end(WRONG_TOKEN_ERROR),
                };
            };

            function onTimeout(a, b, c) {
                debugger
            }

            return webhookCallback(_bot, adapter, 'return', 1000, CFG.apiKeyTelegram);
        };
    }
}
