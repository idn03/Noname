import type { Socket } from 'socket.io';
import { LOBBY_EVENTS, type LobbyCommandReply } from '../shared/lobby-contract';
import { bindIdentity, broadcastLobby, respond, type LobbyTransportContext } from './lobby-transport-context';

interface LobbyRequest { name?: unknown; credential?: unknown }

export function attachClientHandlers(context: LobbyTransportContext, socket: Socket): void {
  restoreHandshake(context, socket);
  const initialSession = context.getSession();
  if (initialSession) socket.emit(LOBBY_EVENTS.state, initialSession.view(context.playerBySocket.get(socket.id)));

  socket.on(LOBBY_EVENTS.join, (request: LobbyRequest, reply?: (result: LobbyCommandReply) => void) => {
    if (context.playerBySocket.has(socket.id)) return respond(socket, reply, 'INVALID_REQUEST');
    const session = context.getSession();
    if (!session) return respond(socket, reply, 'NO_ACTIVE_SESSION');
    const result = session.join(request?.name);
    if (typeof result === 'string') return respond(socket, reply, result);
    bindIdentity(context, socket, result.playerId);
    broadcastLobby(context, session);
    reply?.({ ok: true, playerId: result.playerId });
    socket.emit(LOBBY_EVENTS.credential, result.credential);
  });

  socket.on(LOBBY_EVENTS.resume, (request: LobbyRequest) => {
    if (context.playerBySocket.has(socket.id)) return respond(socket, undefined, 'INVALID_REQUEST');
    const session = context.getSession();
    if (!session) return respond(socket, undefined, 'NO_ACTIVE_SESSION');
    const result = session.resume(request?.credential);
    if (!result) return respond(socket, undefined, 'INVALID_CREDENTIAL');
    bindIdentity(context, socket, result.playerId);
    socket.emit(LOBBY_EVENTS.identity, result.playerId);
    if (result.credential) socket.emit(LOBBY_EVENTS.credential, result.credential);
    broadcastLobby(context, session);
  });

  socket.on('disconnect', () => {
    context.sockets.delete(socket.id);
    const playerId = context.playerBySocket.get(socket.id);
    context.playerBySocket.delete(socket.id);
    if (!playerId || context.socketByPlayer.get(playerId) !== socket.id) return;
    context.socketByPlayer.delete(playerId);
    const session = context.getSession();
    if (session) {
      session.disconnect(playerId);
      broadcastLobby(context, session);
    }
  });
}

function restoreHandshake(context: LobbyTransportContext, socket: Socket): void {
  const session = context.getSession();
  const credential = socket.handshake.auth.credential;
  if (!session || typeof credential !== 'string') return;
  const result = session.resume(credential);
  if (!result) {
    respond(socket, undefined, 'INVALID_CREDENTIAL');
    return;
  }
  bindIdentity(context, socket, result.playerId);
  socket.emit(LOBBY_EVENTS.identity, result.playerId);
  socket.emit(LOBBY_EVENTS.credential, result.credential);
  broadcastLobby(context, session);
}
