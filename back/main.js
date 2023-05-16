const TelegramBot = require('node-telegram-bot-api');
const { addMessage, getUsers, getMessages, repairDb } = require('./db');
const http = require('http');

const BOT_TOKEN = '6097783040:AAH8FNzdlD95LQaJ_gUmmmN5uKokem2jsQU';

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

http.createServer(function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const url = req.url;
  
  console.log('request', Date.now(), url);

  if(url === '/messages'){
    const msgs = getMessages();
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(msgs);
    res.end();
    return;
  } 
  
  // if(url === '/repair_db'){
  //   repairDb();
  //   res.writeHead(200, {'Content-Type': 'text/plain'});
  //   res.write('ok');
  //   res.end();
  //   return ;
  // }
  
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Hello World!');
  res.end();

  
  
}).listen(8080);

// const express = require('express');
// const app = express();
// const port = 3000;

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })