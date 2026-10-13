import type { Server, Socket } from 'socket.io';
import { LOBBY_EVENTS, parsePlayerName, type LobbyErrorView } from '../shared/lobby-contract';
import { LobbySession } from './lobby-session';

interface LobbyRequest { name?: unknown; credential?: unknown }
interface LobbyReply { ok: boolean; playerId?: string; error?: LobbyErrorView }

export function attachLobbyTransport(
  io: Server,
  getSession: () => LobbySession | undefined,
  setSession: (session: LobbySession | undefined) => void,
): void {
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
        socket.emit(LOBBY_EVENTS.identity, resumed.playerId);
        io.emit(LOBBY_EVENTS.state, resumed.lobby);
      } else respond(socket, undefined, 'INVALID_CREDENTIAL', 'Không thể khôi phục phiên chơi. Hãy nhập tên để tham gia.');
    }
    if (session) socket.emit(LOBBY_EVENTS.state, session.view());

    socket.on(LOBBY_EVENTS.hostCreate, (request: LobbyRequest, reply?: (result: LobbyReply) => void) => {
      if (playerBySocket.has(socket.id)) {
        return respond(socket, reply, 'INVALID_REQUEST', 'Kết nối này đã có danh tính người chơi.');
      }
      if (!isLoopbackAddress(socket.handshake.address)) {
        return respond(socket, reply, 'HOST_CREATION_LOCAL_ONLY', 'Chỉ có thể tạo phòng từ máy chủ trò chơi.');
      }
      if (getSession()) {
        return respond(socket, reply, 'SESSION_ALREADY_ACTIVE', 'Đã có một phòng đang hoạt động.');
      }
      const name = parsePlayerName(request?.name);
      if (!name) return respond(socket, reply, 'INVALID_NAME', messageFor('INVALID_NAME'));
      const session = LobbySession.createForHost(name);
      const host = session.connectHost();
      setSession(session);
      playerBySocket.set(socket.id, host.playerId);
      socketByPlayer.set(host.playerId, socket.id);
      socket.emit(LOBBY_EVENTS.identity, host.playerId);
      socket.emit(LOBBY_EVENTS.credential, host.credential);
      io.emit(LOBBY_EVENTS.state, host.lobby);
      reply?.({ ok: true, playerId: host.playerId });
    });

    socket.on(LOBBY_EVENTS.join, (request: LobbyRequest, reply?: (result: LobbyReply) => void) => {
      if (playerBySocket.has(socket.id)) {
        return respond(socket, reply, 'INVALID_REQUEST', 'Kết nối này đã có danh tính người chơi.');
      }
      const activeSession = getSession();
      if (!activeSession) return respond(socket, reply, 'NO_ACTIVE_SESSION', 'Chưa có phòng đang hoạt động.');
      const result = activeSession.join(request?.name);
      if (typeof result === 'string') return respond(socket, reply, result, messageFor(result));
      playerBySocket.set(socket.id, result.playerId);
      socketByPlayer.set(result.playerId, socket.id);
      socket.emit(LOBBY_EVENTS.state, result.lobby);
      io.emit(LOBBY_EVENTS.state, result.lobby);
      reply?.({ ok: true, playerId: result.playerId });
      socket.emit(LOBBY_EVENTS.credential, result.credential);
    });

    socket.on(LOBBY_EVENTS.resume, (request: LobbyRequest) => {
      if (playerBySocket.has(socket.id)) {
        return respond(socket, undefined, 'INVALID_REQUEST', 'Kết nối này đã có danh tính người chơi.');
      }
      const activeSession = getSession();
      const result = activeSession?.resume(request?.credential);
      if (!result) return respond(socket, undefined, activeSession ? 'INVALID_CREDENTIAL' : 'NO_ACTIVE_SESSION', 'Không thể khôi phục phiên chơi. Hãy nhập tên để tham gia.');
      playerBySocket.set(socket.id, result.playerId);
      socketByPlayer.set(result.playerId, socket.id);
      socket.emit(LOBBY_EVENTS.identity, result.playerId);
      if (result.credential) socket.emit(LOBBY_EVENTS.credential, result.credential);
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

function isLoopbackAddress(address: string | undefined): boolean {
  return address === '::1' || address === '127.0.0.1' || Boolean(address?.startsWith('::ffff:127.'));
}

function messageFor(code: string): string {
  if (code === 'INVALID_NAME') return 'Tên cần từ 1 đến 24 ký tự và không chứa ký tự điều khiển.';
  if (code === 'LOBBY_FULL') return 'Phòng đã đủ 10 người chơi.';
  if (code === 'SESSION_ALREADY_ACTIVE') return 'Đã có một phòng đang hoạt động.';
  if (code === 'HOST_CREATION_LOCAL_ONLY') return 'Chỉ có thể tạo phòng từ máy chủ trò chơi.';
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
