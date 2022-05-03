const TelegramApi = require('node-telegram-bot-api');
const { gameOptions,againOptions } = require('./options');

const token = "5352506878:AAFatobLzoKYwiO_CuCsYSJNOtOEocydObo";

const bot = new TelegramApi(token, {polling:true});

const chats = {}

const startGame = async(chatId) =>{
   await bot.sendMessage(
     chatId,
     "Сейчас я загадаю цифру от 0 до 9. Твоя задача отгадать его"
   );
   const randomNumber = Math.floor(Math.random() * 10);
   chats[chatId] = randomNumber;
   await bot.sendMessage(chatId, "Пришло время отгадывать!", gameOptions);
}

const start = () =>{
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Информация" },
    { command: "/game", description: "Сыграем в угадайку!" },
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      return bot.sendSticker(
        chatId,
        "https://tlgrm.ru/_/stickers/ccd/a8d/ccda8d5d-d492-4393-8bb7-e33f77c24907/1.webp"
      ); 
    }

    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`
      );
    }
    if(text === '/game'){
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй ещё раз')
  });

  bot.on('callback_query',msg=>{
    const data = msg.data;
    const chatId = msg.message.chat.id
    if(data === '/again'){
      return startGame(chatId);
    }
    if(data === chats[chatId]){
      return bot.sendMessage(chatId, `Да! Ты угадал! Цифра - ${chats[chatId]}`, againOptions);
    }else{
      return bot.sendMessage(
        chatId,
        `К сожалению, ты не угадал. Бот загадал - ${chats[chatId]}`, againOptions
      );
    }
    
  })
}

start();