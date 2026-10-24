import type { Server, Socket } from 'socket.io';
import { LOBBY_EVENTS, type LobbyCommandReply, type LobbyErrorCode, type LobbyErrorView, type SessionEndReason } from '../shared/lobby-contract';
import type { LobbySession } from './lobby-session';
import type { CategoryContent } from './db/content-validation';

export interface LobbyTransportContext {
  io: Server;
  getSession: () => LobbySession | undefined;
  setSession: (session: LobbySession | undefined) => void;
  playerBySocket: Map<string, string>;
  socketByPlayer: Map<string, string>;
  sockets: Map<string, Socket>;
  categories: readonly CategoryContent[];
}

export function bindIdentity(context: LobbyTransportContext, socket: Socket, playerId: string): void {
  const previousSocketId = context.socketByPlayer.get(playerId);
  if (previousSocketId && previousSocketId !== socket.id) {
    context.playerBySocket.delete(previousSocketId);
    context.sockets.get(previousSocketId)?.disconnect(true);
  }
  context.playerBySocket.set(socket.id, playerId);
  context.socketByPlayer.set(playerId, socket.id);
}

export function respond(
  socket: Socket,
  reply: ((result: LobbyCommandReply) => void) | undefined,
  code: LobbyErrorCode,
  message = messageFor(code),
): void {
  const error: LobbyErrorView = { code, message };
  socket.emit(LOBBY_EVENTS.error, error);
  reply?.({ ok: false, error });
}

export function endSession(context: LobbyTransportContext, reason: SessionEndReason): void {
  context.io.emit(LOBBY_EVENTS.ended, reason);
  context.playerBySocket.clear();
  context.socketByPlayer.clear();
  context.setSession(undefined);
}

export function broadcastLobby(context: LobbyTransportContext, session: LobbySession): void {
  for (const [socketId, socket] of context.sockets) {
    socket.emit(LOBBY_EVENTS.state, session.view(context.playerBySocket.get(socketId)));
  }
}

export function isLoopbackAddress(address: string | undefined): boolean {
  return address === '::1' || address === '127.0.0.1' || Boolean(address?.startsWith('::ffff:127.'));
}

function messageFor(code: LobbyErrorCode): string {
  const messages: Record<LobbyErrorCode, string> = {
    INVALID_NAME: 'Tên cần từ 1 đến 24 ký tự và không chứa ký tự điều khiển.',
    NO_ACTIVE_SESSION: 'Chưa có phòng đang hoạt động.',
    LOBBY_CLOSED: 'Trận đã bắt đầu, phòng không nhận thêm người chơi.',
    LOBBY_FULL: 'Phòng đã đủ 10 người chơi.',
    INVALID_CREDENTIAL: 'Không thể khôi phục phiên chơi. Hãy nhập tên để tham gia.',
    INVALID_REQUEST: 'Yêu cầu không hợp lệ.',
    SESSION_ALREADY_ACTIVE: 'Đã có một phòng đang hoạt động.',
    HOST_CREATION_LOCAL_ONLY: 'Chỉ có thể tạo phòng từ máy chủ trò chơi.',
    NOT_AUTHORIZED: 'Chỉ Chủ phòng được thực hiện thao tác này.',
    NOT_ENOUGH_PLAYERS: 'Cần ít nhất 6 người chơi đang kết nối để bắt đầu.',
    START_REQUIRES_CONFIRMATION: 'Hãy xác nhận bắt đầu với ít hơn 10 người chơi.',
    SESSION_NOT_ACTIVE: 'Phòng không còn hoạt động.',
  };
  return messages[code];
}
