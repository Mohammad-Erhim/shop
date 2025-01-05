import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { joinRoomEventHandlers, sendMessageEventHandlers } from './events';
import { instrument } from '@socket.io/admin-ui';

const SOCKET_ADMIN_USER_NAME = process.env.SOCKET_ADMIN_USER_NAME;
const SOCKET_ADMIN_PASSWORD = process.env.SOCKET_ADMIN_PASSWORD;
const SOCKET_ADMIN_UI_URL = process.env.SOCKET_ADMIN_UI_URL;
const CLIENT_URL = process.env.CLIENT_URL;

let io: SocketIOServer;

export function initializeWebSocket(server: HttpServer): void {
  let orgins = [CLIENT_URL || '*'];
  if (SOCKET_ADMIN_UI_URL) orgins.push(SOCKET_ADMIN_UI_URL);

  io = new SocketIOServer(server, {
    cors: {
      origin: orgins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    sendMessageEventHandlers(socket);
    joinRoomEventHandlers(socket);
  });

  if (SOCKET_ADMIN_USER_NAME && SOCKET_ADMIN_PASSWORD)
    instrument(io, {
      auth: {
        type: 'basic',
        username: SOCKET_ADMIN_USER_NAME,
        password: SOCKET_ADMIN_PASSWORD,
      },
    });
}
