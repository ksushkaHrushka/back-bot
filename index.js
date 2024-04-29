const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const cors = require("cors");
const firestoreRepo  = require('./firestoreRepo')

const token = "7083895133:AAGW8SRQxx_LWL9Np_mqP5LW0N6WZl3uJnE";
const webAppUrl = "https://glistening-eclair-7b6777.netlify.app";

const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.json());
app.use(cors());

bot.setMyCommands([
    {command: '/start', description: 'Приветствие и информация о боте'},
])

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (msg.text === 'Информация о компании') {
    await bot.sendMessage (chatId, 'Компания SoftTeco, основанная в 2008 году со штатом всего 10 человек, сегодня является широко признанной международной компанией со штатом более 500 экспертов. Мы с гордостью можем сказать, что наши сотрудники являются основной силой, способствующей росту компании. SoftTeco привлекает лучших специалистов отрасли, от инженеров-программистов до дизайнеров и маркетологов, и всегда стремится создать комфортную рабочую среду для поддержания долгосрочных отношений с сотрудниками. Для этого мы следуем ряду лучших практик, включая корпоративную социальную ответственность, программу для сотрудников ParentSmart и подход «Зеленый офис». Таким образом, мы всегда уделяем приоритетное внимание потребностям наших сотрудников, поскольку считаем, что ваша самая большая ценность — это люди, с которыми вы работаете.',
    {
      reply_markup: {
        keyboard: [
          [
            {
              text: "Заполнить форму",
              web_app: { url: webAppUrl + "/form" },
            },
          ],
          [
            'Информация о компании'
          ]
        ],
      },
    });
  }

  if (text === "/start") {
    await bot.sendSticker(chatId, 'https://chpic.su/_data/archived/stickers/p/pr/ProgerRobots_byAlexzhdanov.webp');
    await bot.sendMessage(
      chatId,
      'Здравствуйте, вас привествует бот компании "СофтТеко", мы предоставляем услуги по разработке ПО, если вам интересно, заполните форму, по кнопке в самом низу экрана!',
      {
        reply_markup: {
          keyboard: [
            [
              {
                text: "Заполнить форму",
                web_app: { url: webAppUrl + "/form" },
              },
            ],
            [
              'Информация о компании'
            ]
          ],
        },
      }
    );
    await bot.sendMessage(chatId, "По кнопке слева от экрана, у тебя есть возможность заказать услугу, воcпользуйся!");
  }

  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);
      console.log(data);
      await bot.sendMessage(chatId, "Спасибо за обратную связь!");
      await bot.sendMessage(chatId, "Ваша Фамлия Имя Отчество: " + data?.fio);
      await bot.sendMessage(chatId, "Ваша компания: " + data?.company);
      await bot.sendMessage(chatId, "Ваша страна: " + data?.country);
      await firestoreRepo.addClient(data);

      setTimeout(async () => {
        await bot.sendMessage(
          chatId,
          "Вы удачно заполнили форму! В ближайшее время наш админимистратор свяжется с вами. Всю информацию, вы можете получить в этом чате."
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
        firestoreRepo.addOrder(req.body);
        console.log(`${queryId}/n${services}/n${totalPrice}`);
        return res.status(200).json({});
    } catch (e) {
        console.log(e);
    }
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Не удалось заказать услугу',
            input_message_content: {message_text: 'Не удалось заказать услугу'}
        })
    } catch (e) {
        console.log(e);
    }

    return res.status(500).json({})
})

const PORT = 8000; 

app.listen(PORT, () => console.log('server started on PORT ' + PORT))