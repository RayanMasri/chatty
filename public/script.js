const socket = io(
    window.location.protocol + '//' + window.location.hostname + ':3000'
);
const peer = new Peer({
    path: '/peerjs',
    host: location.hostname,
    port: location.port || (location.protocol === 'https:' ? 443 : 80),
});

peer.on('open', (id) => {
    console.log(`peer.js is open with id: ${id}`);
});

socket.on('connect', () => {
    console.log(`socket.io is open with id: ${socket.id}`);
    socket.emit('test event', 'message from client');
    console.log(`sent message to server`);
});

socket.on('test event', (data) => {
    console.log(data);
});
