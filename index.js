const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const cors = require("cors");

const token = "7083895133:AAGW8SRQxx_LWL9Np_mqP5LW0N6WZl3uJnE";
const webAppUrl = "https://glistening-eclair-7b6777.netlify.app";

const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.json());
app.use(cors());

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    await bot.sendMessage(
      chatId,
      'Здравствуйте, вас привествует бот компании "СофтТеко", мы предоставляем услуги по разработке ПО, если тебе интересно, заполни форму, по кнопке в самом низу экрана!',
      {
        reply_markup: {
          keyboard: [
            [
              {
                text: "Заполнить форму",
                web_app: { url: webAppUrl + "/form" },
              },
            ],
          ],
        },
      }
    );
    await bot.sendMessage(chatId, "Заходи на наш сайт, по кнопке ниже", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Посмотреть услуги", web_app: { url: webAppUrl } }],
        ],
      },
    });
  }

  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);
      console.log(data);
      await bot.sendMessage(chatId, "Спасибо за обратную связь!");
      await bot.sendMessage(chatId, "Ваша Фамлия Имя Отчество: " + data?.fio);
      await bot.sendMessage(chatId, "Ваша компания: " + data?.company);
      await bot.sendMessage(chatId, "Ваша страна: " + data?.country);

      setTimeout(async () => {
        await bot.sendMessage(
          chatId,
          "Вы удачно заполнили форму! Всю информацию, вы можете получить в этом чате."
        );
      }, 3000);
    } catch (e) {
      console.log(e);
    }
  }

});

app.post('/web-data', async (req, res) => {
    const {queryId, services, totalPrice} = req.body;
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешный заказ',
            input_message_content: {message_text: 'Поздравляю, вы успешно заказали услугу на приблизительную стоимость ' + totalPrice}
        })

        return res.status(200).json({});
    } catch (e) {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Не удалось заказать услугу',
            input_message_content: {message_text: 'Не удалось заказать услугу'}
        })
        
        return res.status(500).json({})
    }

})

const PORT = 8000; 

app.listen(PORT, () => console.log('server started on PORT ' + PORT))