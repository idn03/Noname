import type { Server, Socket } from 'socket.io';
import type { LobbySession } from './lobby-session';
import { attachClientHandlers } from './lobby-client-handlers';
import { attachHostHandlers } from './lobby-host-handlers';
import type { LobbyTransportContext } from './lobby-transport-context';
import type { CategoryContent } from './db/content-validation';
import { bundledContent } from './db/bundled-content';

export function attachLobbyTransport(
  io: Server,
  getSession: () => LobbySession | undefined,
  setSession: (session: LobbySession | undefined) => void,
  categories: readonly CategoryContent[] = bundledContent,
): void {
  const context: LobbyTransportContext = {
    io,
    getSession,
    setSession,
    playerBySocket: new Map(),
    socketByPlayer: new Map(),
    sockets: new Map(),
    categories,
  };
  io.on('connection', (socket) => attachConnection(context, socket));
}

function attachConnection(context: LobbyTransportContext, socket: Socket): void {
  context.sockets.set(socket.id, socket);
  attachClientHandlers(context, socket);
  attachHostHandlers(context, socket);
}
