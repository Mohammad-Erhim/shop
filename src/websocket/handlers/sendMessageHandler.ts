import { Socket } from 'socket.io';

export function sendMessageHandler(socket: Socket): void {
  socket.on('send-message', (message, room) => {
    if (room === '') socket.broadcast.emit('receive-message', message);
    else socket.to(room).emit('receive-message', message);
  });
}
