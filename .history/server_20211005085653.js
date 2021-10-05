const express = require('express');
const app = express();
const server = require("http").createServer(app);
const io = require ("socket.io")(server);

//get local modules for formating messages and processing users
const autoRespond = require ("./formatMessage");
const users = require("./users.js");

//set port and chatbot variables
const PORT = 8080;
const chatbotName = "Chabot";


//app.use(static(join(__dirname + "/FE/")));
app.use(express.static('chatApp'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
let userData =[];
let roomData = ["travel & tourism","shopping","expat","fishing"];


io.on("connection", (socket) => {
  
  const userId = socket.id; 
  //recieves the first message from the client
  socket.on("userJoin", (userDetails) => {

    
      socket.join(userDetails.chosenRoom);
      //add create a complete user object
      let user = users.userList(userId, userDetails.username, userDetails.chosenRoom);
      userData.push(user);
      //send to client 
      io.emit("onlineUsers", userData);
      io.emit("newUser", user);
      
      //welcome user to room
      io.to(user.room).emit(
        'broadcastMessage',autoRespond.botMessage(chatbotName,`Welcome to the ${user.room} club ${user.username}!`));
    
  });

  socket.on("chatMessage", (msg) => {
    io.in(msg.chosenRoom).emit("newMessage", users.formatUsers(msg, userId));
  });

  socket.on("privateMessage", (msg) => {
   socket.join(msg.recipientId);
   io.in(msg.recipientId).emit("incomingPrivateMessage",users.formatUsers(msg));
  });

  io.emit("AvailableRooms",(roomData));

  socket.on("typing", (username) => {
    io.emit("incoming", username);
  });
 
  socket.on("disconnect", () => {
    //removes disconnected users from the array 
      let location = users.searchArrayObj(userId,userData);
      let leftUser = userData.indexOf(location);
        if (leftUser >= 0){userData.splice(leftUser, 1);}
          io.emit("removeUser", userId);
            socket.emit(
              "BroadcastMessage",
              autoRespond.botMessage(chatbotName, "A user has left the chat")
            );
    });
});

server.listen(PORT, () => console.log(`listening on port ${PORT}`));
