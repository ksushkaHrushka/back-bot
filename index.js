const TelegramBot = require('node-telegram-bot-api');

const token = '7083895133:AAGW8SRQxx_LWL9Np_mqP5LW0N6WZl3uJnE';
const webAppUrl = 'https://glistening-eclair-7b6777.netlify.app';

const bot = new TelegramBot(token, {polling: true});


bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

    if (text === '/start') {
        await bot.sendMessage (chatId,'Ниже появится кнопка, заполни форму', {
            reply_markup: {
                keyboard: [
                    [{text: 'Заполнить форму', web_app:{url: webAppUrl + '/form'}}]
                ]
            }
        })
            await bot.sendMessage(chatId, 'Заходи на наш сайт, по кнопке ниже', {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: 'Посмотреть услуги', web_app:{url: webAppUrl} }]
                    ]
                }
            })
    }

});

