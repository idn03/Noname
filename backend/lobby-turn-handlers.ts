import type { Socket } from 'socket.io';
import { LOBBY_EVENTS, type LobbyCommandReply, type LobbyErrorCode } from '../shared/lobby-contract';
import { broadcastLobby, respond, type LobbyTransportContext } from './lobby-transport-context';

export function attachTurnHandlers(context: LobbyTransportContext, socket: Socket): void {
  socket.on(LOBBY_EVENTS.attack, (request: unknown, reply?: (result: LobbyCommandReply) => void) => {
    const result = apply(context, socket.id, request, 'attack');
    if ('error' in result) return respond(socket, reply, result.error);
    broadcastLobby(context, result.session);
    reply?.({ ok: true });
  });
  socket.on(LOBBY_EVENTS.defend, (request: unknown, reply?: (result: LobbyCommandReply) => void) => {
    const result = apply(context, socket.id, request, 'defend');
    if ('error' in result) return respond(socket, reply, result.error);
    broadcastLobby(context, result.session);
    reply?.({ ok: true });
  });
  socket.on(LOBBY_EVENTS.recordChallengeOutcome, (request: unknown, reply?: (result: LobbyCommandReply) => void) => {
    const actorId = context.playerBySocket.get(socket.id);
    const session = context.getSession();
    if (!actorId) return respond(socket, reply, 'NOT_AUTHORIZED');
    if (!session) return respond(socket, reply, 'SESSION_NOT_ACTIVE');
    if (!isOutcomeRequest(request)) return respond(socket, reply, 'INVALID_REQUEST');
    const error = session.recordChallengeOutcome(actorId, request.round, request.succeeded);
    if (error) return respond(socket, reply, error);
    broadcastLobby(context, session);
    reply?.({ ok: true });
  });
}

function apply(context: LobbyTransportContext, socketId: string, request: unknown, action: 'attack' | 'defend'):
  | { error: LobbyErrorCode }
  | { session: NonNullable<ReturnType<LobbyTransportContext['getSession']>> } {
  const actorId = context.playerBySocket.get(socketId);
  const session = context.getSession();
  if (!actorId) return { error: 'NOT_AUTHORIZED' };
  if (!session) return { error: 'SESSION_NOT_ACTIVE' };
  if (!isRoundRequest(request)) return { error: 'INVALID_REQUEST' };
  const error = session[action](actorId, request.round);
  return error ? { error } : { session };
}

function isOutcomeRequest(value: unknown): value is { round: number; succeeded: boolean } {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    && Object.keys(value).length === 2 && Number.isInteger((value as { round?: unknown }).round)
    && (value as { round: number }).round > 0
    && typeof (value as { succeeded?: unknown }).succeeded === 'boolean';
}

function isRoundRequest(value: unknown): value is { round: number } {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
    && Object.keys(value).length === 1 && Number.isInteger((value as { round?: unknown }).round)
    && (value as { round: number }).round > 0;
}
