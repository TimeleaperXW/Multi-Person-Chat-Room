//the libraries required
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
//the two variables below are used to store the current connections and the list of users
var connections = [];
var users = [];


//initiation of the path of html files
app.use("/html", express.static(__dirname + "/htmlFile"));
app.use("/css",express.static(__dirname+ "/cssFile"));
app.use("/json",express.static(__dirname+ "/jsonDataFile"));


app.get('/',function(req,res){
	res.sendFile(path.join(__dirname,"./htmlFile/console.html"));
});

// events when connection is built up
io.on('connection', function(socket){
    connections.push(socket);
    console.log(connections.length +' sockets connected.');
    socket.on('userLogin', function(usn){
		//when the user is the first one that comes into the chat room, add its username to the name list
		if (users.length == 0) {
			socket.username = usn;
			users.push(socket.username);
			var time = Date();
			io.emit('clientMsg', 'Server', time, '<b>' + usn + '</b> has logged into the chatroom.');
			console.log(usn + ' has connected.');
		} else {    //when there are already users in the chat room, check the availability of newly received username
			for (var i = 0;i < users.length;i++) {
				if (usn == users[i]) {
					//if the username is already in use, send an alert only to the user
					io.sockets.connected[socket.id].emit('repeatedName', 'This name already exists!');
				} else {    //if no repeated username is found, add the username to the name list and alert everyone in the chat room
					socket.username = usn;
					users.push(socket.username);
					var time = Date();
					io.emit('clientMsg', 'Server', time, '<b>' + usn + '</b> has logged into the chatroom.');
					console.log(usn + ' has connected.');
					break;
				}
			}
		}
	});
	
	socket.on('clientMsg', function(source, content) {
		var time = Date();
		io.emit('clientMsg', source, time, content);
	});
  
	socket.on('clientRqst', function(source, content) {
		if (content == '-CHECKSTAT') {
			io.sockets.connected[socket.id].emit('userlist', users);
		} else if (content == '-EXIT') {
			users.splice(users.indexOf(source), 1);
			connections.splice(connections.indexOf(socket), 1);
			var time = Date();
			io.emit('clientMsg', 'Server', time, '<b>' + source + '</b> has left the chatroom.');
			console.log(source +' has disconnected.');
		}
	});
});

http.listen(3000, function () {
	console.log('MPCR is listening on port 3000');
});