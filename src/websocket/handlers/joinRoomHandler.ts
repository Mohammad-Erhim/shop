import { Socket } from 'socket.io';

export function joinRoomHandler(socket: Socket): void {
  socket.on('join-room', (room) => {
    socket.join(room);
  });
}
