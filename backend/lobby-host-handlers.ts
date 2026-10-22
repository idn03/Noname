import type { Server, Socket } from 'socket.io';
import { LOBBY_EVENTS, type LobbyCommandReply } from '../shared/lobby-contract';
import { LobbySession } from './lobby-session';
import { bindIdentity, broadcastLobby, endSession, isLoopbackAddress, respond, type LobbyTransportContext } from './lobby-transport-context';

interface StartRequest { confirmLowPopulation?: unknown }

export function attachHostHandlers(context: LobbyTransportContext, socket: Socket): void {
  socket.on(LOBBY_EVENTS.hostCreate, (_request: unknown, reply?: (result: LobbyCommandReply) => void) => {
    if (context.playerBySocket.has(socket.id)) return respond(socket, reply, 'INVALID_REQUEST');
    if (!isLoopbackAddress(socket.handshake.address)) return respond(socket, reply, 'HOST_CREATION_LOCAL_ONLY');
    if (context.getSession()) return respond(socket, reply, 'SESSION_ALREADY_ACTIVE');

    const session = LobbySession.createForHost();
    const host = session.connectHost();
    context.setSession(session);
    bindIdentity(context, socket, host.playerId);
    socket.emit(LOBBY_EVENTS.identity, host.playerId);
    socket.emit(LOBBY_EVENTS.credential, host.credential);
    broadcastLobby(context, session);
    reply?.({ ok: true, playerId: host.playerId });
  });

  socket.on(LOBBY_EVENTS.hostStart, (request?: StartRequest, reply?: (result: LobbyCommandReply) => void) => {
    const session = context.getSession();
    const actorId = context.playerBySocket.get(socket.id);
    if (!actorId) return respond(socket, reply, 'NOT_AUTHORIZED');
    if (!session) return respond(socket, reply, 'SESSION_NOT_ACTIVE');
    const result = session.start(actorId, request?.confirmLowPopulation === true);
    if (typeof result === 'string') return respond(socket, reply, result);
    broadcastLobby(context, session);
    reply?.({ ok: true });
  });

  socket.on(LOBBY_EVENTS.hostCancel, (_request?: unknown, reply?: (result: LobbyCommandReply) => void) => {
    finishSession(context, socket, reply, 'cancelled');
  });
  socket.on(LOBBY_EVENTS.hostDeleteRoom, (_request?: unknown, reply?: (result: LobbyCommandReply) => void) => {
    finishSession(context, socket, reply, 'deleted');
  });
}

function finishSession(
  context: LobbyTransportContext,
  socket: Socket,
  reply: ((result: LobbyCommandReply) => void) | undefined,
  reason: 'cancelled' | 'deleted',
): void {
  const session = context.getSession();
  const actorId = context.playerBySocket.get(socket.id);
  if (!actorId) return respond(socket, reply, 'NOT_AUTHORIZED');
  if (!session) return respond(socket, reply, 'SESSION_NOT_ACTIVE');
  const error = session.end(actorId);
  if (error) return respond(socket, reply, error);
  endSession(context, reason);
  reply?.({ ok: true });
}
