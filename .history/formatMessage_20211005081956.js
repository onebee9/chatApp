//create and store the time a message is recieved
let date_recieved = new Date().toLocaleTimeString();

//message object to add a username and time to bot messages.
 function botMessage(username, msg) {
    let sentMessageObj = {
        username,
        message: msg,
        time: date_recieved,
    };
    return sentMessageObj;
};




exports.botMessage = botMessage;

