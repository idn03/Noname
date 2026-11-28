import { createServer } from 'node:http';
import { playerJoinUrl, printPlayerInvitation } from './player-invitation';
import next from 'next';
import { Server } from 'socket.io';
import { openContentDatabase } from './db/database';
import { attachLobbyTransport } from './lobby-transport';
import type { LobbySession } from './lobby-session';

const port = Number(process.env.PORT ?? 3000);
const contentStore = await openContentDatabase();
const hostname = process.env.HOST ?? '0.0.0.0';
const development = process.env.NODE_ENV !== 'production';
const application = next({ dev: development, hostname, port, dir: 'web-game' });
const handle = application.getRequestHandler();

await application.prepare();
const httpServer = createServer((request, response) => {
  void handle(request, response).catch((error: unknown) => {
    console.error('web request failed', error);
    response.statusCode = 500;
    response.end('Internal Server Error');
  });
});
const io = new Server(httpServer);
httpServer.on('close', () => contentStore.client.close());
let activeLobby: LobbySession | undefined;
attachLobbyTransport(io, () => activeLobby, (session) => { activeLobby = session; }, contentStore.content);

export function setActiveLobby(session: LobbySession | undefined): void {
  activeLobby = session;
}

httpServer.listen(port, hostname, () => {
  const listener = httpServer.address();
  if (!listener || typeof listener === 'string') return;
  console.info(`Host control: http://127.0.0.1:${listener.port}`);
  void printPlayerInvitation(playerJoinUrl(listener.address, listener.port), Boolean(process.stdout.isTTY));
});
