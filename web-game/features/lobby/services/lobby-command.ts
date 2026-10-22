import type { Socket } from 'socket.io-client';
import { LOBBY_EVENTS, type LobbyCommandReply, type LobbyErrorCode } from '../../../../shared/lobby-contract';

export type LobbyCommand = typeof LOBBY_EVENTS.hostCreate
  | typeof LOBBY_EVENTS.hostStart
  | typeof LOBBY_EVENTS.hostCancel
  | typeof LOBBY_EVENTS.hostDeleteRoom
  | typeof LOBBY_EVENTS.join;

export function emitLobbyCommand(
  socket: Socket | null,
  event: LobbyCommand,
  payload: unknown,
  onReply: (reply: LobbyCommandReply | undefined, timedOut: boolean) => void,
): void {
  if (!socket) return onReply(undefined, true);
  socket.timeout(8000).emit(event, payload, (error: Error | null, reply: LobbyCommandReply) => {
    onReply(error ? undefined : reply, Boolean(error));
  });
}

export function errorText(code: LobbyErrorCode): string {
  const messages: Record<LobbyErrorCode, string> = {
    INVALID_NAME: 'Tên cần từ 1 đến 24 ký tự và không chứa ký tự điều khiển.',
    NO_ACTIVE_SESSION: 'Chưa có phòng đang hoạt động. Hãy thử lại sau.',
    LOBBY_CLOSED: 'Trận đã bắt đầu, phòng không nhận thêm người chơi.',
    LOBBY_FULL: 'Phòng đã đủ 10 người chơi.',
    INVALID_CREDENTIAL: 'Phiên chơi đã hết hạn. Hãy nhập tên để tham gia lại.',
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
