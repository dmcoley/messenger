var express = require('express'),
    http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var ent = require('ent');
var fs = require('fs');
var port = 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing for css and js files
app.use(express.static(__dirname + '/public'));

// Loading the page index.html
app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket, username) {
    // When the username is received it’s stored as a session variable and informs the other people
    socket.on('new_client', function(username) {
        username = ent.encode(username);
        socket.username = username;
        socket.broadcast.emit('new_client', username);
    });

    // Cleanup when clients disconnect
    socket.on('disconnect', function() {       
        socket.broadcast.emit('disc', socket.username);
        delete io.sockets[socket.id];
        delete io.sockets.sockets[socket.id];
    });

    // When a message is received, the client’s username is retrieved and sent to the other people
    socket.on('message', function(message) {
        message = ent.encode(message);
        socket.broadcast.emit('message', {
            username: socket.username,
            message: message
        });
    });
});