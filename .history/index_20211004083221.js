const socket = io();


let timeoutId; 
const textArea = document.getElementById("message"); 
const chatForm = document.getElementById("chatForm");
const incomingContainer = document.getElementById("incoming-messages"); //To display "typing" indicator
const displayName = document.getElementById("profileName");
const messageContainer = document.getElementById("messageDetails");
const roomDisplay = document.getElementById("room");
const userLang = window.navigator.userLanguage || window.navigator.language; //get user language
const username = localStorage.getItem("username");
const chosenRoom = localStorage.getItem("room");
const userDetails = { username, chosenRoom, userLang };
const incomingDivs = {};
let recipientId = "";

socket.emit("userJoin", userDetails); //sending user information to the server

//personalisation
let selectedRoom = document.createElement("p");
let profileName = document.createElement("p");

selectedRoom.textContent = userDetails.chosenRoom;
profileName.textContent = `${userDetails.username}'s`;
profileName.classList.add("profileName");

roomDisplay.appendChild(selectedRoom);
displayName.appendChild(profileName);

/**  function list */
const showIncomingAlert = (username) => {
  //show typing alert
  if (username !== "chabot") {
    if (!incomingDivs[username]) {
      incomingDivs[username] = document.createElement("p");
      incomingContainer.appendChild(incomingDivs[username]);
    }
    incomingDivs[username].textContent = `${username} is typing a message...`;
    incomingDivs[username].classList.remove("hidden-incoming");
    incomingDivs[username].classList.add("visible-incoming");
  }
};
const hideIncomingAlert = (username) => { //hide typing alert
  
  if (username !== "chabot") {
    incomingDivs[username].textContent = "";
    incomingDivs[username].classList.remove("visible-incoming");
    incomingDivs[username].classList.add("hidden-incoming");
  }
};
const displayOnlineUsers = (user) => {   // create list of online users
  
const usernameDisplay = document.getElementById("onlineUsersDisplay");
  let onlineUser = document.createElement("a");
  let linkText = document.createTextNode(user.username);
  onlineUser.appendChild(linkText);
  onlineUser.setAttribute("id", user.id);
  onlineUser.setAttribute("href", "#");
  onlineUser.setAttribute("data-kind", "person");
  onlineUser.setAttribute("name", user.username);
  usernameDisplay.appendChild(onlineUser);
};
const displayAvailableRooms = (roomData) => { // display list of available rooms
  const roomlist = document.getElementById("availableRooms");
  let room = document.createElement("a");
  let linkText = document.createTextNode(roomData);
  room.appendChild(linkText);
  room.setAttribute("href", "#");
  room.setAttribute("id",roomData);
  room.setAttribute("data-kind", "room");
  roomlist.appendChild(room);
};
const removeDisconnectedUsers = (userId) => {//remove disconnected users from userList.
  let offlineUser = document.getElementById(userId);
  offlineUser.parentNode.removeChild(offlineUser);
};
const createMessage = (msg) => {  //Create and style messages and append to body
  if (messageContainer) {
    let messageBubble = document.createElement("p");
    let chatMessageAuthor = document.createElement("p");
    let messageTime = document.createElement("p");

    //add the retrieved content to the created html elements
    messageBubble.textContent = msg.message;
    messageTime.textContent = msg.time;
    chatMessageAuthor.textContent = msg.username;

    //Append a style class
    chatMessageAuthor.classList.add("author");
    messageTime.classList.add("messageTime");
    messageBubble.classList.add("messageText");
    messageBubble.style.padding = "2px 10px 5px 0px";

    //Append to dom
    messageContainer.appendChild(chatMessageAuthor);
    messageContainer.appendChild(messageTime);
    messageContainer.appendChild(messageBubble);
    messageContainer.style.padding = "5px 10px 20px 0px";

    document.getElementById("chatForm").reset();
  }
};

/**  Sending and recieving messages from the server */

if (chatForm) { // submits message and its sttributes to server
   chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let newMessage = e.target.elements.message.value.trim();
      let dataType = messageContainer.getAttribute('data-kind');
      console.log(dataType);
      if(dataType === "person"){
        console.log(recipientId);
          socket.emit("privateMessage", {newMessage,username,chosenRoom,recipientId});
      }
      else {
        socket.emit("chatMessage", {newMessage, username, chosenRoom});
      }

    
  });
}

if (textArea) {  // sends notification for a "typing" event

  textArea.addEventListener("input", (event) => {
    socket.emit("typing", username);
  });
}

socket.once("onlineUsers", (userData) => {// Recieve list of online users and display(First Connection)
  userData.forEach(displayOnlineUsers);
  const data = document.querySelectorAll("[data-kind = 'person']");
  if (data !== null) {
    data.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        messageContainer.setAttribute("data-kind",'person');
        recipientId = event.target.id;
      });
    });
  }
});

socket.on("newUser", (user) => { // Recieves list of online users and display(subsequent connections)
  if (user.username != username) {
    displayOnlineUsers(user);
    let newData  = document.getElementById(user.id);
      if (newData !== null) {
            newData.addEventListener("click", (e) => {
              e.preventDefault();
              messageContainer.setAttribute("data-kind",'person');
              recipientId = this.id;
            });
        }
  }
});

socket.once("AvailableRooms",(roomData) => {// Recieve list of available rooms and display
  roomData.forEach(displayAvailableRooms);
  const data = document.querySelectorAll("[data-kind = 'room']");
  if (data !== null) {
    data.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        messageContainer.setAttribute("data-kind", room);
        recipientId = event.target.id;
      });
    });
  }
});

socket.on("removeUser", (userId) => {// Remove disconnected users
  removeDisconnectedUsers(userId);
});

socket.on("incoming", (username) => { //recieve usernmames of connected clients currently typing a message
  showIncomingAlert(username);
  if (timeoutId) clearTimeout(timeoutId); // reset timeout if this handler is executed again. this is necessary to reset the timeout function
  timeoutId = setTimeout(() => hideIncomingAlert(username), 1000); // execute only the final timeout function after 1second of inactivity
});

socket.on("newMessage", (msg) => { //recieve new messages on the and output to DOM
  hideIncomingAlert(msg.username);
  createMessage(msg);
});

socket.on("incomingPrivateMessage",(msg) => {
  createMessage(msg);
});

socket.on("broadcastMessage", (msg) => createMessage(msg));
