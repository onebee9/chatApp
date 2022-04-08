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


app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


let userData =[];
let roomData = ["travel & tourism","shopping","expat","fishing"];


io.on("connection", (socket) => {
  
  const userId = socket.id;

  //recieves the first message from the client
  socket.on("userJoin", (userDetails) => {

    //adds a user to a room
      socket.join(userDetails.chosenRoom);

      //creates a complete user object
      let user = users.userList(userId, userDetails.username, userDetails.chosenRoom);
      userData.push(user);

      //send to client 
      io.emit("onlineUsers", userData);
      io.emit("newUser", user);
      
      //emits broadcast message to welcome user to room
      io.to(user.room).emit(
        'broadcastMessage',autoRespond.botMessage(chatbotName,`Welcome to the ${user.room} club ${user.username}!`));
    
  });

  //broadcasts the sent message to the right room
  socket.on("chatMessage", (msg) => {
    io.in(msg.chosenRoom).emit("newMessage", users.formatUsers(msg, userId));
  });

  //sends a private message to a specific person 
  socket.on("privateMessage", (msg) => {
   socket.join(msg.recipientId);
   io.in(msg.recipientId).emit("incomingPrivateMessage",users.formatUsers(msg));
  });

  // sends the available rooms
  io.emit("AvailableRooms",(roomData));

  //sends the userdetails for the person currently typing
  socket.on("typing", (username) => {
    io.emit("incoming", username);
  });
 
  socket.on("disconnect", () => {

    //removes disconnected users from the the userlist, so we can remove them from the frontend as they exit 
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
