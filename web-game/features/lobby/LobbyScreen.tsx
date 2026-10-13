'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { io, type Socket } from 'socket.io-client';
import { LOBBY_EVENTS, type LobbyErrorView, type LobbyView } from '../../../shared/lobby-contract';

const CREDENTIAL_KEY = 'noname.player-credential';
const ERROR_TEXT: Record<string, string> = {
  NO_ACTIVE_SESSION: 'Chưa có phòng đang hoạt động. Hãy thử lại sau.',
  INVALID_CREDENTIAL: 'Phiên chơi đã hết hạn. Hãy nhập tên để tham gia lại.',
  INVALID_NAME: 'Tên cần từ 1 đến 24 ký tự, không chứa ký tự điều khiển.',
  LOBBY_FULL: 'Phòng đã đủ 10 người chơi.',
  LOBBY_CLOSED: 'Trận đã bắt đầu, phòng không nhận thêm người chơi.',
};

export default function LobbyScreen() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [name, setName] = useState('');
  const [lobby, setLobby] = useState<LobbyView | null>(null);
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const credential = window.localStorage.getItem(CREDENTIAL_KEY);
    const connection = io({ auth: { credential } });
    setSocket(connection);
    connection.on('connect', () => setConnected(true));
    connection.on('disconnect', () => setConnected(false));
    connection.on(LOBBY_EVENTS.state, (state: LobbyView) => {
      setLobby(state);
      setPending(false);
      setError('');
    });
    connection.on(LOBBY_EVENTS.error, (issue: LobbyErrorView) => {
      setError(ERROR_TEXT[issue.code] ?? 'Đã xảy ra lỗi. Vui lòng thử lại.');
      setPending(false);
    });
    connection.on(LOBBY_EVENTS.credential, (value: string) => {
      window.localStorage.setItem(CREDENTIAL_KEY, value);
    });
    return () => { connection.disconnect(); };
  }, []);

  function join(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!socket || pending) return;
    setPending(true);
    setError('');
    socket.emit(LOBBY_EVENTS.join, { name }, (reply: { ok: boolean; error?: LobbyErrorView }) => {
      if (!reply.ok && reply.error) {
        setError(ERROR_TEXT[reply.error.code] ?? 'Đã xảy ra lỗi. Vui lòng thử lại.');
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
        {!lobby && <form className="join-form" onSubmit={join}>
          <label htmlFor="player-name">Tên của bạn</label>
          <div className="join-row">
            <input id="player-name" autoComplete="nickname" maxLength={48} value={name} onChange={(event) => setName(event.target.value)} aria-describedby={error ? 'join-error' : 'name-help'} />
            <button type="submit" disabled={!connected || pending}>{pending ? 'Đang tham gia…' : 'Tham gia phòng'}</button>
          </div>
          <p id="name-help" className="helper">Từ 1 đến 24 ký tự. Tên có thể trùng với người khác.</p>
          {error && <p id="join-error" className="error-message" role="alert">{error}</p>}
        </form>}
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
          {lobby.phase === 'lobby' && <p className="waiting-note">Đang chờ mọi người tham gia.</p>}
        </section>}
        <div className="connection-footer" role="status"><span className={`presence ${connected ? 'online' : ''}`} />{connected ? 'Kết nối với máy chủ phòng chơi' : 'Đang kết nối với máy chủ…'}</div>
      </section>
    </main>
  );
}
