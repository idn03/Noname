import type { Server, Socket } from 'socket.io';
import { LOBBY_EVENTS, type LobbyErrorView } from '../shared/lobby-contract';
import type { LobbySession } from './lobby-session';

interface LobbyRequest { name?: unknown; credential?: unknown }
interface LobbyReply { ok: boolean; error?: LobbyErrorView }

export function attachLobbyTransport(io: Server, getSession: () => LobbySession | undefined): void {
  const playerBySocket = new Map<string, string>();
  const socketByPlayer = new Map<string, string>();
  io.on('connection', (socket) => {
    const session = getSession();
    const credential = socket.handshake.auth.credential;
    if (session && typeof credential === 'string') {
      const resumed = session.resume(credential);
      if (resumed) {
        playerBySocket.set(socket.id, resumed.playerId);
        socketByPlayer.set(resumed.playerId, socket.id);
        socket.emit(LOBBY_EVENTS.state, resumed.lobby);
        io.emit(LOBBY_EVENTS.state, resumed.lobby);
      }
    }

    socket.on(LOBBY_EVENTS.join, (request: LobbyRequest, reply?: (result: LobbyReply) => void) => {
      const activeSession = getSession();
      if (!activeSession) return respond(socket, reply, 'NO_ACTIVE_SESSION', 'Chưa có phòng đang hoạt động.');
      const result = activeSession.join(request?.name);
      if (typeof result === 'string') return respond(socket, reply, result, messageFor(result));
      playerBySocket.set(socket.id, result.playerId);
      socketByPlayer.set(result.playerId, socket.id);
      socket.emit(LOBBY_EVENTS.state, result.lobby);
      io.emit(LOBBY_EVENTS.state, result.lobby);
      reply?.({ ok: true });
      socket.emit('player:credential', result.credential);
    });

    socket.on(LOBBY_EVENTS.resume, (request: LobbyRequest) => {
      const activeSession = getSession();
      const result = activeSession?.resume(request?.credential);
      if (!result) return respond(socket, undefined, activeSession ? 'INVALID_CREDENTIAL' : 'NO_ACTIVE_SESSION', 'Không thể khôi phục phiên chơi. Hãy nhập tên để tham gia.');
      playerBySocket.set(socket.id, result.playerId);
      socketByPlayer.set(result.playerId, socket.id);
      io.emit(LOBBY_EVENTS.state, result.lobby);
    });

    socket.on('disconnect', () => {
      const playerId = playerBySocket.get(socket.id);
      playerBySocket.delete(socket.id);
      const activeSession = getSession();
      if (playerId && socketByPlayer.get(playerId) === socket.id) {
        socketByPlayer.delete(playerId);
        if (activeSession) io.emit(LOBBY_EVENTS.state, activeSession.disconnect(playerId));
      }
    });
  });
}

function messageFor(code: string): string {
  if (code === 'INVALID_NAME') return 'Tên cần từ 1 đến 24 ký tự và không chứa ký tự điều khiển.';
  if (code === 'LOBBY_FULL') return 'Phòng đã đủ 10 người chơi.';
  return 'Trận đã bắt đầu, không thể nhận thêm người chơi.';
}

function respond(
  socket: Socket,
  reply: ((result: LobbyReply) => void) | undefined,
  code: LobbyErrorView['code'],
  message: string,
): void {
  const error = { code, message };
  socket.emit(LOBBY_EVENTS.error, error);
  reply?.({ ok: false, error });
}
