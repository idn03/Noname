'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { io, type Socket } from 'socket.io-client';
import { LOBBY_EVENTS, type LobbyErrorView, type LobbyView } from '../../../shared/lobby-contract';
import LobbyNameForm from './LobbyNameForm';

const CREDENTIAL_KEY = 'noname.player-credential';
const ERROR_TEXT: Record<string, string> = {
  NO_ACTIVE_SESSION: 'Chưa có phòng đang hoạt động. Hãy thử lại sau.',
  INVALID_CREDENTIAL: 'Phiên chơi đã hết hạn. Hãy nhập tên để tham gia lại.',
  INVALID_NAME: 'Tên cần từ 1 đến 24 ký tự, không chứa ký tự điều khiển.',
  LOBBY_FULL: 'Phòng đã đủ 10 người chơi.',
  LOBBY_CLOSED: 'Trận đã bắt đầu, phòng không nhận thêm người chơi.',
  SESSION_ALREADY_ACTIVE: 'Đã có một phòng đang hoạt động.',
  HOST_CREATION_LOCAL_ONLY: 'Chỉ có thể tạo phòng từ máy chủ trò chơi.',
};

export default function LobbyScreen() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [name, setName] = useState('');
  const [lobby, setLobby] = useState<LobbyView | null>(null);
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);
  const [pending, setPending] = useState(false);
  const [isLocalHost, setIsLocalHost] = useState(false);
  const [selfId, setSelfId] = useState('');
  const credentialRejected = useRef(false);

  useEffect(() => {
    setIsLocalHost(['localhost', '127.0.0.1', '::1'].includes(window.location.hostname));
    const credential = window.localStorage.getItem(CREDENTIAL_KEY);
    const connection = io({ auth: { credential } });
    setSocket(connection);
    connection.on('connect', () => setConnected(true));
    connection.on('disconnect', () => {
      setConnected(false);
      setPending(false);
      setError('Đã mất kết nối. Khi máy chủ hoạt động lại, hãy thử lại.');
    });
    connection.on(LOBBY_EVENTS.identity, (playerId: string) => setSelfId(playerId));
    connection.on(LOBBY_EVENTS.state, (state: LobbyView) => {
      setLobby(state);
      setPending(false);
      if (credentialRejected.current) {
        credentialRejected.current = false;
        setError(state.phase === 'lobby'
          ? 'Không thể khôi phục phiên chơi. Hãy nhập tên để tham gia phòng.'
          : 'Phiên chơi đã hết hạn và trận đã bắt đầu. Không thể tham gia ván này.');
      } else {
        setError('');
      }
    });
    connection.on(LOBBY_EVENTS.error, (issue: LobbyErrorView) => {
      if (issue.code === 'INVALID_CREDENTIAL' || issue.code === 'NO_ACTIVE_SESSION') {
        window.localStorage.removeItem(CREDENTIAL_KEY);
        connection.auth = {};
      }
      credentialRejected.current = issue.code === 'INVALID_CREDENTIAL';
      setError(ERROR_TEXT[issue.code] ?? 'Đã xảy ra lỗi. Vui lòng thử lại.');
      setPending(false);
    });
    connection.on(LOBBY_EVENTS.credential, (value: string) => {
      window.localStorage.setItem(CREDENTIAL_KEY, value);
      connection.auth = { credential: value };
    });
    return () => { connection.disconnect(); };
  }, []);

  function createHost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!socket || pending) return;
    setPending(true);
    setError('');
    socket.timeout(8000).emit(LOBBY_EVENTS.hostCreate, { name }, (timeoutError: Error | null, reply: { ok: boolean; playerId?: string; error?: LobbyErrorView }) => {
      if (timeoutError) {
        setError('Máy chủ chưa phản hồi. Hãy kiểm tra kết nối rồi thử lại.');
        setPending(false);
      } else if (!reply.ok && reply.error) {
        setError(ERROR_TEXT[reply.error.code] ?? 'Đã xảy ra lỗi. Vui lòng thử lại.');
        setPending(false);
      } else if (reply.playerId) {
        setSelfId(reply.playerId);
        setPending(false);
      }
    });
  }

  function join(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!socket || pending) return;
    setPending(true);
    setError('');
    socket.timeout(8000).emit(LOBBY_EVENTS.join, { name }, (timeoutError: Error | null, reply: { ok: boolean; playerId?: string; error?: LobbyErrorView }) => {
      if (timeoutError) {
        setError('Máy chủ chưa phản hồi. Hãy kiểm tra kết nối rồi thử lại.');
        setPending(false);
      } else if (!reply.ok && reply.error) {
        setError(ERROR_TEXT[reply.error.code] ?? 'Đã xảy ra lỗi. Vui lòng thử lại.');
        setPending(false);
      } else if (reply.playerId) {
        setSelfId(reply.playerId);
        setPending(false);
      }
    });
  }

  const players = lobby?.players ?? [];
  const connectedPlayers = players.filter((player) => player.connected).length;

  return (
    <main className="lobby-shell">
      <header className="game-header"><span className="game-mark" aria-hidden="true">N</span><span>NONAME</span></header>
      <section className="lobby-content" aria-labelledby="page-title">
        <p className="phase-label">TRÒ CHƠI NHIỀU NGƯỜI</p>
        <h1 id="page-title">Cùng vào phòng</h1>
        <p className="intro">Nhập tên hiển thị để tham gia ván chơi cùng mọi người trong mạng nội bộ.</p>
        {!lobby && isLocalHost && <LobbyNameForm label="Tên của Host" action="PLAY" pendingAction="Đang tạo phòng…" helper="Tạo phòng trên máy chủ này và tham gia với tư cách Host." name={name} error={error} disabled={!connected || pending} onNameChange={setName} onSubmit={createHost} />}
        {!lobby && !isLocalHost && <p className="waiting-note" role="status">Đang chờ Host tạo phòng trên máy chủ. Khi phòng mở, bạn có thể tham gia tại đây.</p>}
        {lobby && <section className="roster" aria-label="Danh sách người chơi">
          <div className="roster-heading">
            <div><h2>Người chơi</h2><p>{connectedPlayers} đang kết nối · {players.length}/10 chỗ</p></div>
            <span className={`connection-state ${connected ? '' : 'is-offline'}`} role="status">{connected ? 'Đã kết nối' : 'Đang kết nối lại'}</span>
          </div>
          <ul>{players.map((player) => <li key={player.id}>
            <span className={`presence ${player.connected ? 'online' : ''}`} aria-hidden="true" />
            <span className="player-name">{player.name}</span>
            {player.isHost && <span className="host-label">Chủ phòng</span>}
            {!player.connected && <span className="offline-label">Đã ngắt kết nối</span>}
          </li>)}</ul>
          {lobby.phase === 'started' && error && <p className="error-message" role="status">{error}</p>}
          {lobby.phase === 'lobby' && <>
            {!lobby.players.some((player) => player.id === selfId) && <LobbyNameForm label="Tên của bạn" action="Tham gia phòng" pendingAction="Đang tham gia…" helper="Từ 1 đến 24 ký tự. Tên có thể trùng với người khác." name={name} error={error} disabled={!connected || pending} onNameChange={setName} onSubmit={join} />}
            <p className="waiting-note">{lobby.players.some((player) => player.id === selfId && player.isHost) ? 'Phòng đã tạo. Chia sẻ địa chỉ máy chủ trong mạng nội bộ để mọi người tham gia.' : 'Đang chờ Host bắt đầu trò chơi.'}</p>
          </>}
        </section>}
        <div className="connection-footer" role="status"><span className={`presence ${connected ? 'online' : ''}`} />{connected ? 'Kết nối với máy chủ phòng chơi' : 'Đang kết nối với máy chủ…'}</div>
      </section>
    </main>
  );
}
