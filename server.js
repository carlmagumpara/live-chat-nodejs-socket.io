var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];

server.listen(process.env.PORT || 3000);

console.log('Server running...');

// Routes
app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});
app.get('/style.css', function(req, res){
	res.sendFile(__dirname + '/style.css');
});
app.get('/bootstrap.min.css', function(req, res){
	res.sendFile(__dirname + '/bower_components/bootstrap/dist/css/bootstrap.min.css');
});
app.get('/bootstrap.min.js', function(req, res){
	res.sendFile(__dirname + '/bower_components/bootstrap/dist/js/bootstrap.min.js');
});
app.get('/jquery.min.js', function(req, res){
	res.sendFile(__dirname + '/bower_components/jquery/dist/jquery.min.js');
});
app.get('/vue.min.js', function(req, res){
	res.sendFile(__dirname + '/bower_components/vue/dist/vue.min.js');
});

// Socket Connection
io.sockets.on('connection',function(socket){
	connections.push(socket);
	console.log('Connected %s sockets connected', connections.length);

	// Disconnect
	socket.on('disconnect', function(){

		users.splice(users.indexOf(socket.username), 1);
		connections.splice(connections.indexOf(socket), 1);
		updateUsernames();
		console.log('Disconnected %s sockets connected', connections.length)
	});

	// Send Message
	socket.on('send message', function(data){
		io.sockets.emit('new message', { msg: data, user: socket.username });
	});

	// New User
	socket.on('new user',function(data){
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	});

	function updateUsernames(){
		io.sockets.emit('get users', users);
	}

});