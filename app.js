const express = require('express');
const app = express();

app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const server = require('http').createServer(app);
const peer = require('peer').ExpressPeerServer(server);

server.listen(process.env.PORT || 3000, () => {
    console.log(`listening on *:${server.address().port}`);
});

app.use('/peerjs', peer);

const io = require('socket.io')(server);
let rooms = [
    {
        label: 'channel 1',
        members: [],
    },
    {
        label: 'channel 2',
        members: [],
    },
];

io.on('connection', (socket) => {
    console.log(`socket.io client connected: '${socket.id}'`);

    // socket.io
    io.emit('info', rooms);

    socket.on('room change', (object) => {
        const { member, label } = object;
        rooms = rooms.map((room) =>
            room.label == label
                ? {
                      label: room.label,
                      members: !room.members.includes(member)
                          ? room.members.concat([member])
                          : room.members,
                  }
                : room.members.includes(member)
                ? {
                      label: room.label,
                      members: room.members.filter((id) => id != member),
                  }
                : room
        );

        io.emit('info', rooms);
    });

    // **

    socket.on('disconnect', () => {
        console.log(`socket.io client disconnected: '${socket.id}'`);
    });
});

peer.on('disconnect', (client) => {
    rooms = rooms.map((room) => {
        return {
            label: room.label,
            members: room.members.filter((member) => member != client.id),
        };
    });

    io.emit('info', rooms);
});
