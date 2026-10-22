'use client';

import { useState, type FormEvent } from 'react';
import { LOBBY_EVENTS, type LobbyCommandReply } from '../../../shared/lobby-contract';
import LobbyNameForm from './LobbyNameForm';
import { emitLobbyCommand, errorText, type LobbyCommand } from './emit-lobby-command';
import { LobbyHostActions } from './LobbyHostActions';
import { HostHomeActions } from './HostHomeActions';
import { LobbyPlayerStage } from './LobbyPlayerStage';
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

  const roleClass = isLocalHost === null ? 'lobby-shell--resolving' : isLocalHost ? 'lobby-shell--host' : 'lobby-shell--player';

  return <main className={`lobby-shell ${roleClass} ${lobby ? 'lobby-shell--active' : 'lobby-shell--home'}`}>
    <div className="rune-field" aria-hidden="true">
      <span>tytiincaafty</span><span>abjiitewabjio</span><span>hunzaykovbuji</span>
      <span>vyt aikcaafty</span><span>ydbnaikovbuji</span><span>xuykoonfty</span><span>tytiincaafty</span>
    </div>
    {!lobby && isLocalHost === null && <p className="role-resolution" role="status">Đang xác định chế độ kết nối…</p>}
    {!lobby && isLocalHost !== null && <section className="home-content" aria-labelledby="page-title">
      <h1 id="page-title" className="game-title"><span>SÓI</span><span>VÀ</span><span>CỪU</span></h1>
      {isLocalHost ? <HostHomeActions connected={connected} pending={pending} error={error} onCreate={createHost} /> : <div className="home-action player-home-action">
        <p className="home-tagline">Hãy để màn đêm định đoạt tất cả</p>
        <LobbyNameForm label="Tên hiển thị" action="Tham gia phòng" pendingAction="Đang tham gia…" helper="Từ 1 đến 24 ký tự." name={name} error={error} disabled={!connected || pending || !lobby} onNameChange={setName} onSubmit={join} />
        {!lobby && <p className="waiting-note" role="status">Đang chờ Chủ phòng tạo phòng trên máy chủ.</p>}
      </div>}
      {!isLocalHost && <div className="connection-footer" role="status"><span className={`presence ${connected ? 'online' : ''}`} />{connected ? 'Đã kết nối với máy chủ' : 'Đang kết nối với máy chủ…'}</div>}
    </section>}
    {lobby && <section className="lobby-content" aria-labelledby="page-title">
      <p className="phase-label">PHÒNG CHƠI</p>
      <h1 id="page-title">Cùng vào phòng</h1>
      <p className="intro">{lobby.phase === 'started' ? 'Các đội đã được Game Engine phân chia.' : isLocalHost ? 'Phòng đã sẵn sàng. Chờ mọi người tham gia trước khi bắt đầu.' : 'Nhập tên hiển thị để tham gia ván chơi cùng mọi người trong mạng nội bộ.'}</p>
      <section className="roster" aria-label="Danh sách người chơi">
        <div className="roster-heading">
          <div><h2>Người chơi</h2><p>{connectedPlayers} đang kết nối · {players.filter((player) => !player.isHost).length}/10 chỗ</p></div>
          <span className={`connection-state ${connected ? '' : 'is-offline'}`} role="status">{connected ? 'Đã kết nối' : 'Đang kết nối lại'}</span>
        </div>
        <p className="lobby-host-presence">Chủ phòng <span className={`presence ${players.find((player) => player.isHost)?.connected ? 'online' : ''}`} aria-hidden="true" /></p>
        <LobbyPlayerStage players={players} started={lobby.phase === 'started'} canSeeAllTeams={host} />
        {error && <p className="error-message" role="alert">{error}</p>}
        {lobby.phase === 'lobby' && <>
          {!currentPlayer && <LobbyNameForm label="Tên hiển thị" action="Tham gia phòng" pendingAction="Đang tham gia…" helper="Từ 1 đến 24 ký tự." name={name} error="" disabled={!connected || pending} onNameChange={setName} onSubmit={join} />}
          {host ? <LobbyHostActions started={false} playerCount={connectedPlayers} pending={pending} onStart={start} onCancel={cancel} onDelete={deleteRoom} /> : <p className="waiting-note">Đang chờ Chủ phòng bắt đầu trò chơi.</p>}
        </>}
        {lobby.phase === 'started' && host && <LobbyHostActions started playerCount={connectedPlayers} pending={pending} onStart={start} onCancel={cancel} onDelete={deleteRoom} />}
        {lobby.phase === 'started' && !host && <p className="waiting-note">Phòng đã bắt đầu. Đang chờ thông tin ván chơi.</p>}
      </section>
      <div className="connection-footer" role="status"><span className={`presence ${connected ? 'online' : ''}`} />{connected ? 'Kết nối với máy chủ phòng chơi' : 'Đang kết nối với máy chủ…'}</div>
    </section>}
  </main>;
}
