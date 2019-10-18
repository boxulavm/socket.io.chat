const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('Server running...')


app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

io.sockets.on('connect', (socket) => {
    connections.push(socket);
    console.log('Connects: %s sockets connected', connections.length);


    // Disconnect
    socket.on('disconnect', (data) => {
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', connections.length)
    });

    // Send Message
    socket.on('send message', (data) => {
        console.log(data)
        io.sockets.emit('new message', {msg: data, username: socket.username });
    })

    // New User
    socket.on('new user', (data, callback) => {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    })

    const updateUsernames = () => {
        io.sockets.emit('get users', users);
    }

})