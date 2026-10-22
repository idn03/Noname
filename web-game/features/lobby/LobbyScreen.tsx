'use client';

import { useState, type FormEvent } from 'react';
import { LOBBY_EVENTS, type LobbyCommandReply } from '../../../shared/lobby-contract';
import LobbyNameForm from './LobbyNameForm';
import { emitLobbyCommand, errorText, type LobbyCommand } from './emit-lobby-command';
import { LobbyHostActions } from './LobbyHostActions';
import { useLobbyConnection } from './use-lobby-connection';

export default function LobbyScreen() {
  const [name, setName] = useState('');
  const connection = useLobbyConnection();
  const { socket, lobby, error, setError, connected, pending, setPending, isLocalHost, selfId, setSelfId } = connection;
  const command = (event: LobbyCommand, payload: unknown, done?: (reply: LobbyCommandReply) => void) => {
    setPending(true);
    setError('');
    emitLobbyCommand(socket, event, payload, (reply, timedOut) => {
      setPending(false);
      if (timedOut) return setError('Máy chủ chưa phản hồi. Hãy kiểm tra kết nối rồi thử lại.');
      if (!reply?.ok) return setError(reply?.error ? errorText(reply.error.code) : 'Đã xảy ra lỗi. Vui lòng thử lại.');
      if (reply) done?.(reply);
    });
  };
  const createHost = () => command(LOBBY_EVENTS.hostCreate, {}, (reply) => setSelfId(reply.playerId ?? ''));
  const join = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    command(LOBBY_EVENTS.join, { name }, (reply) => setSelfId(reply.playerId ?? ''));
  };
  const start = (confirmed: boolean) => command(LOBBY_EVENTS.hostStart, { confirmLowPopulation: confirmed });
  const cancel = () => command(LOBBY_EVENTS.hostCancel, {});
  const deleteRoom = () => command(LOBBY_EVENTS.hostDeleteRoom, {});
  const players = lobby?.players ?? [];
  const connectedPlayers = players.filter((player) => player.connected && !player.isHost).length;
  const currentPlayer = players.find((player) => player.id === selfId);
  const host = Boolean(currentPlayer?.isHost);

  return <main className="lobby-shell">
    <header className="game-header"><img className="game-logo" src="/assets/logo.png" alt="Noname" /></header>
    <section className="lobby-content" aria-labelledby="page-title">
      <p className="phase-label">TRÒ CHƠI NHIỀU NGƯỜI</p>
      <h1 id="page-title">Cùng vào phòng</h1>
      <p className="intro">{isLocalHost ? 'Tạo phòng trên máy chủ này để bắt đầu ván chơi cùng mọi người.' : 'Nhập tên hiển thị để tham gia ván chơi cùng mọi người trong mạng nội bộ.'}</p>
      {!lobby && isLocalHost && <div className="host-create">
        <button type="button" disabled={!connected || pending} onClick={createHost}>{pending ? 'Đang tạo phòng…' : 'TẠO'}</button>
        <p className="helper">Bạn sẽ tham gia với tư cách Chủ phòng, không cần nhập tên.</p>
        {error && <p className="error-message" role="alert">{error}</p>}
      </div>}
      {!lobby && !isLocalHost && <p className="waiting-note" role="status">Đang chờ Chủ phòng tạo phòng trên máy chủ. Khi phòng mở, bạn có thể tham gia tại đây.</p>}
      {lobby && <section className="roster" aria-label="Danh sách người chơi">
        <div className="roster-heading">
          <div><h2>Người chơi</h2><p>{connectedPlayers} đang kết nối · {players.filter((player) => !player.isHost).length}/10 chỗ</p></div>
          <span className={`connection-state ${connected ? '' : 'is-offline'}`} role="status">{connected ? 'Đã kết nối' : 'Đang kết nối lại'}</span>
        </div>
        <ul>{players.map((player) => <li key={player.id}>
          <span className={`presence ${player.connected ? 'online' : ''}`} aria-hidden="true" />
          <span className={`player-name ${player.isHost ? 'host-label' : ''}`}>{player.isHost ? 'Chủ phòng' : player.name}</span>
          {!player.connected && <span className="offline-label">Đã ngắt kết nối</span>}
        </li>)}</ul>
        {error && <p className="error-message" role="alert">{error}</p>}
        {lobby.phase === 'lobby' && <>
          {!currentPlayer && <LobbyNameForm label="Tên của bạn" action="Tham gia phòng" pendingAction="Đang tham gia…" helper="Từ 1 đến 24 ký tự. Tên có thể trùng với người khác." name={name} error="" disabled={!connected || pending} onNameChange={setName} onSubmit={join} />}
          {host ? <LobbyHostActions started={false} playerCount={connectedPlayers} pending={pending} onStart={start} onCancel={cancel} onDelete={deleteRoom} /> : <p className="waiting-note">Đang chờ Chủ phòng bắt đầu trò chơi.</p>}
        </>}
        {lobby.phase === 'started' && host && <LobbyHostActions started playerCount={connectedPlayers} pending={pending} onStart={start} onCancel={cancel} onDelete={deleteRoom} />}
        {lobby.phase === 'started' && !host && <p className="waiting-note">Phòng đã bắt đầu. Đang chờ thông tin ván chơi.</p>}
      </section>}
      <div className="connection-footer" role="status"><span className={`presence ${connected ? 'online' : ''}`} />{connected ? 'Kết nối với máy chủ phòng chơi' : 'Đang kết nối với máy chủ…'}</div>
    </section>
  </main>;
}
