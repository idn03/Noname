import { createServer } from 'node:http';
import { networkInterfaces } from 'node:os';
import next from 'next';
import { Server } from 'socket.io';
import { openContentDatabase } from './db/database';
import { attachLobbyTransport } from './lobby-transport';
import type { LobbySession } from './lobby-session';

function isPrivateIpv4(address: string): boolean {
  const [first, second] = address.split('.').map(Number);
  return first === 10 ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168);
}

function findPrivateIpv4(): string | undefined {
  return Object.values(networkInterfaces())
    .flatMap((interfaces) => interfaces ?? [])
    .filter((entry) => entry.family === 'IPv4' && !entry.internal && isPrivateIpv4(entry.address))
    .map((entry) => entry.address)
    .sort()[0];
}

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
attachLobbyTransport(io, () => activeLobby, (session) => { activeLobby = session; });

export function setActiveLobby(session: LobbySession | undefined): void {
  activeLobby = session;
}

httpServer.listen(port, hostname, () => {
  const localAddress = findPrivateIpv4();
  console.info(`Host control: http://127.0.0.1:${port}`);
  if (localAddress) console.info(`LAN players: http://${localAddress}:${port}`);
});
