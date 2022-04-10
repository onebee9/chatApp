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

const formatUsers = (msg) => {
  let sentMessageObj = {
    username:msg.username,
    message: msg.newMessage,
    room:msg.chosenRoom,
    time: date_recieved,
  };
  return sentMessageObj;
};

const userList = (id,username,room) => {
  let connectedUser = {id,username,room};
  return connectedUser;
};

const searchArrayObj = (nameKey, myArray) => {
  for (let i=0; i < myArray.length; i++) {
      if (myArray[i].id === nameKey) {
          return myArray[i];
      }
  }
}

//export functions
exports.formatUsers = formatUsers;
exports.userList = userList;
exports.searchArrayObj= searchArrayObj;