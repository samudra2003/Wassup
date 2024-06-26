const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

const usernames = {}; // Object to store usernames

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  //  console.log('A user connected');

    // When a user joins, store their username and broadcast it
    socket.on('join', (name) => {
        usernames[socket.id] = name;
       // console.log(`${name} joined the chat`);
        io.emit('message', { user: 'Admin', message: `${name} has joined the chat`, timestamp: new Date().toLocaleTimeString() });
    });

    // Handle incoming messages
    socket.on('message', (msg) => {
        msg.timestamp = new Date().toLocaleTimeString();
        socket.broadcast.emit('message', msg);
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        const name = usernames[socket.id];
        if (name) {
            //console.log(`${name} left the chat`);
            socket.broadcast.emit('message', { user: 'Admin', message: `${name} has left the chat`, timestamp: new Date().toLocaleTimeString() });
            delete usernames[socket.id];
        }
    });
});
