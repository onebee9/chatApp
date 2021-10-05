let date_recieved = new Date().toLocaleTimeString();

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
  let ConnectedUser = {id,username,room};
  return ConnectedUser;
};

const searchArrayObj = (nameKey, myArray) => {
  for (let i=0; i < myArray.length; i++) {
      if (myArray[i].id === nameKey) {
          return myArray[i];
      }
  }
}

export default {
  formatUsers,
  userList,
  searchArrayObj
};
