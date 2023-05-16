const { connect } = require('json-file-database');

const db = connect({
    file: './main_db.json',
    init: {
      users: [
        {
            id: 0,
            first_name: 'Test User',
            last_name: 'Test User',
            username: 'Test User',
        },
        {
            id: 1,
            first_name: 'Test User 1',
            last_name: 'Test User 1',
            username: 'Test User 1',
        },
      ],
      messages: [
        {
            id: 0,
            from: 1,
            chat: 1,
            date: 1681827328,
            text: '1'
        },
      ]
    },
  });

const users = db({
    name: 'users',
    primaryKey: 'id',
});

const messages = db({
    name: 'messages',
    primaryKey: 'id',
});

function getFormatedUser(msg){
    return {
        id: msg.from.id,
        first_name: msg.from.first_name ?? 'Unknown',
        last_name: msg.from.last_name ?? 'Unknown',
        username: msg.from.username ?? 'Unknown',
    }
}

function addUser(msg){
    const user = getFormatedUser(msg);
    if(!users.has({ id: user.id })){            
        users.insert(user);
    }
}

function addMessage(msg){
    addUser(msg);
    messages.insert({
        id: msg.message_id,
        from: msg.from.id,
        chat: msg.chat.id,
        date: msg.date,
        text: msg.text
    });
}

function getUsers(isFormated = false){
    const usersArr = [...users];
    return isFormated ? formatJSON(usersArr) : usersArr;
}

function getMessages(){
    return JSON.stringify(formatMessages(copy(messages.elements)));
}

function copy(d){
    return JSON.parse(JSON.stringify(d));
}

function formatMessages(msgs){
    const usersDict = formatUsersToDictionary(users);
    return msgs.map(el => {
        console.log('before', el.from);
        el.from = usersDict[el.from];
        console.log(el.from);
        return el;
    });
}

function formatUsersToDictionary(users){
    return users.elements.reduce((acc, { id, username, first_name, last_name }) => {
        acc[id] = `${ username } : ${ first_name } ${ last_name }`;
        return acc;
    }, {});
}

function formatJSON(arr){
    return arr.reduce((acc, el) => (`${ acc }
------
first_name: ${ el.first_name },
last_name: ${ el.last_name },
username: ${ el.username },
`), '');
}


function repairDb(){
    messages.elements.forEach(el => {
        if(typeof el.from !== 'number'){
            el.from  = el.chat;
        }
    });
}

module.exports = {
    addMessage,
    getUsers,
    getMessages,
    repairDb,
};
// {
//     message_id: 128,
//     from: {
//       id: 194287825,
//       is_bot: false,
//       first_name: 'Nick',
//       last_name: 'Sotula',
//       username: 'so2niko',
//       language_code: 'en'
//     },
//     chat: {
//       id: 194287825,
//       first_name: 'Nick',
//       last_name: 'Sotula',
//       username: 'so2niko',
//       type: 'private'
//     },
//     date: 1681827328,
//     text: '111'
//   }
