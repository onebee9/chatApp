# Realtime Chat WebApp

This repository contains a real-time web chat application implemented using Node.js, Express, Socket.IO, hadtml and CSS. It contains users, groups and channels.

## Repository layout
The root directory of the repository contains the README.md file and the files necessary for Node.js. The Node.js logic is contained in a single file called server.js, but leverages modules from other files (users.js, formatMessage.js,botMessage.js).

## Roadmap
* Enabling users switch between rooms
* Re-writing the FE in react
* UI updates like highlighting the room a user currently belongs to and the number of unread messages
* connecting to MongoDb storage so users can load previous messages.
* Enabling a "super Admin" role
* Implementing Translation services via the microsoft translate API 
