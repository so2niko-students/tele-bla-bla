import data from '../settings.js';

const URL = `https://api.telegram.org/bot${data.BOT_TOKEN}/`;

const CHAT_BODY = document.querySelector('.chat-body');

const renderMessages = arr => {
    console.log(arr);
    CHAT_BODY.innerHTML = arr.reverse().map(({ message, edited_message }) => {
        if (!message) {
            message = edited_message;
        }
        return `<tr>
        <th scope="row">${getDate(message.date)}</th>
        <td>${getName(message.from)}</td>
        <td>${getText(message)}</td>
      </tr>`}).join('');
}

const getName = ({ first_name, last_name, username, id }) => {
    if (first_name || last_name) return `${first_name ?? ''} ${last_name ?? ''}`;

    if (username) return username;

    return id;
}

const getText = msg => {
    if (msg.text) return msg.text;

    if (msg.sticker) return msg.sticker.emoji;

    return '<small class="text-danger">Формат повідомлення поки що не підтримується. Сорян</small>';
}

const getDate = date => {
    const t = new Date(date * 1000);
    return `${ leadZero(t.getHours()) }:${ leadZero(t.getMinutes()) }`;
}

const leadZero = num => num > 9 ? num : `0${ num }`;

setInterval((upd) => {
    fetch(`${URL}getUpdates`)
        .then(r => r.json())
        .then((r) => {
            console.log('re-fetch');
            const curID = r.result.slice(-1)[0].update_id;
            if(curID != upd.update_id){
                renderMessages(r.result);
                upd.update_id = curID;
                console.log('re-render');
            }            
        });
}, 2000, { update_id : 0 });