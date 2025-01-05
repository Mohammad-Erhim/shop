import { Socket } from 'socket.io';
import { sendMessageHandler } from './handlers/sendMessageHandler';
import { joinRoomHandler } from './handlers/joinRoomHandler';

export function sendMessageEventHandlers(socket: Socket): void {
  sendMessageHandler(socket);
}

export function joinRoomEventHandlers(socket: Socket): void {
  joinRoomHandler(socket);
}
