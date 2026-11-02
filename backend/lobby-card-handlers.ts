import type { Socket } from 'socket.io';
import { LOBBY_EVENTS, type LobbyCommandReply } from '../shared/lobby-contract';
import { broadcastLobby, respond, type LobbyTransportContext } from './lobby-transport-context';

interface SelectCardRequest { categoryId: string; challengeId?: string }

export function attachCardSelectionHandlers(context: LobbyTransportContext, socket: Socket): void {
  socket.on(LOBBY_EVENTS.selectCard, (request: unknown, reply?: (result: LobbyCommandReply) => void) => {
    const actorId = context.playerBySocket.get(socket.id);
    if (!actorId) return respond(socket, reply, 'NOT_AUTHORIZED');
    const session = context.getSession();
    if (!session) return respond(socket, reply, 'SESSION_NOT_ACTIVE');
    if (!isSelectCardRequest(request)) return respond(socket, reply, 'INVALID_REQUEST');
    const error = session.selectCard(actorId, request.categoryId, request.challengeId);
    if (error) return respond(socket, reply, error);
    broadcastLobby(context, session);
    reply?.({ ok: true });
  });

  socket.on(LOBBY_EVENTS.removeCard, (request: unknown, reply?: (result: LobbyCommandReply) => void) => {
    const actorId = context.playerBySocket.get(socket.id);
    if (!actorId) return respond(socket, reply, 'NOT_AUTHORIZED');
    const session = context.getSession();
    if (!session) return respond(socket, reply, 'SESSION_NOT_ACTIVE');
    if (!isEmptyRequest(request)) return respond(socket, reply, 'INVALID_REQUEST');
    const error = session.removeCard(actorId);
    if (error) return respond(socket, reply, error);
    broadcastLobby(context, session);
    reply?.({ ok: true });
  });
}

function isSelectCardRequest(value: unknown): value is SelectCardRequest {
  if (!isRecord(value)) return false;
  const keys = Object.keys(value);
  return keys.every((key) => key === 'categoryId' || key === 'challengeId')
    && typeof value.categoryId === 'string' && value.categoryId.length > 0 && value.categoryId.length <= 64
    && (value.challengeId === undefined || (typeof value.challengeId === 'string' && value.challengeId.length > 0 && value.challengeId.length <= 128));
}

function isEmptyRequest(value: unknown): boolean {
  return value === undefined || (isRecord(value) && Object.keys(value).length === 0);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
