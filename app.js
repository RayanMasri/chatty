const express = require('express');
const app = express();

app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const server = require('http').createServer(app);

server.listen(process.env.PORT || 3000, () => {
    console.log(`listening on *:${server.address().port}`);
});

// socket.io
const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log(`socket.io client connected: '${socket.id}'`);

    socket.on('test event', (data) => {
        console.log(data);
        socket.emit('test event', 'message from server');
    });
    // console.log('a socket.io client connected');
    socket.on('disconnect', () => {
        console.log(`socket.io client disconnected: '${socket.id}'`);
    });
    // io.on('test event', (data) => {
    // console.log(data);
    // });
    // socket.on()
});

// peer.js
const peer = require('peer').ExpressPeerServer(server);

peer.on('connection', (client) => {
    console.log(`peer.js client connected: '${client.id}'`);
});

peer.on('disconnect', (client) => {
    console.log(`peer.js client disconnected: '${client.id}'`);
});

app.use('/peerjs', peer);
