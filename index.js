var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


var people = {};

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/clientSide.js', function(req,res){
	res.sendFile(__dirname + '/clientSide.js');
})

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', '(' + people[socket.id] + ') > ' + msg);
  });

  socket.on('join', function(name){
  	people[socket.id] = name;
  	console.log("Logged in, user: " + name);
  	socket.emit('update', 'You have connected to the server!'); // send to sender
  	socket.broadcast.emit('update', '[INFO] ' + name + ' has connected to the server!'); // send to all people except sender
  	io.emit('update-people', people); // send to all
  });

  socket.on('disconnect', function(){
  	socket.broadcast.emit('update', '[DISCONNECT] ' + people[socket.id] + ' has left the server!');
  	delete people[socket.id];
  	io.emit('update-people', people); // send to all
  });

});

//process.env.PORT
http.listen(process.env.PORT, function(){
  console.log('listening on *:3000');
});