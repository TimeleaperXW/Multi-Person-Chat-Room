# Multi Person Chat Room
- This MPCR runs on top of TCP, and listens on port 3000.
- Implemented in server-client pattern. The front end of this application is on a browser, while the back end is built on top of Express on Node.js. The "socket.io" library is used to create a persistent connection between client and server.
- When a user runs the client program, it sends a connection request to the server. The server receives the request and sends back an affirmative response after building up a connection with the client. Every chat message sent by the client afterwards will be received by the server first and then transferred to all other clients connected to the server.
- A user may also send other requests to the server to require for a name list of all users currently in the chat room, or to ask for the disconnection with the server.
