const TelegramBot = require('node-telegram-bot-api');
const { addMessage, getUsers } = require('./db');
// const data = require('../settings');
// const { BOT_TOKEN } = data;
const BOT_TOKEN = '6097783040:AAFQdeTbb0zfZsg5_L4UnjbyqotY94NLbSU';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

bot.onText(/\/users/, (msg, match) => {
  
  const chatId = msg.chat.id;

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, getUsers(true));
});

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  addMessage(msg);
  
  // send a message to the chat acknowledging receipt of their message
  bot.sendMessage(chatId, 'Received your message');
});