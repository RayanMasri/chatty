import { Voice } from './audio.js';

const voice = new Voice();
const socket = io();
const peer = new Peer({
    path: '/peerjs',
    host: location.hostname,
    port: location.port || (location.protocol === 'https:' ? 443 : 80),
});

const info = (rooms) => {
    voice.clear();
    if (rooms.some((room) => room.members.includes(peer.id))) {
        voice.stream((stream) => {
            rooms
                .find((room) => room.members.includes(peer.id))
                .members.map((id) => {
                    if (id != peer.id) {
                        console.log(`calling peer: '${id}'`);
                        peer.call(id, stream).on('stream', (stream) => {
                            voice.attach(stream);
                        });
                    }
                });
        });
    }
};

peer.on('call', (call) => {
    voice.stream((stream) => {
        call.answer(stream);
    });

    call.on('stream', (stream) => {
        voice.attach(stream);
        console.log(`answered call from: '${call.peer}'`);
    });
});

socket.on('info', (rooms) => {
    info(rooms);

    $('#channels').empty();
    rooms.map((room) => {
        $('#channels').append(
            $(`<div class="channel">
                <div class="channel-label">${room.label}</div>
                <div class="channel-members">${room.members
                    .map(
                        (member) =>
                            `<div class="channel-member">${member}</div>`
                    )
                    .join('')}</div>
            </div>`).click(() => {
                socket.emit('room change', {
                    label: room.label,
                    member: peer.id,
                });
            })
        );
    });
});
