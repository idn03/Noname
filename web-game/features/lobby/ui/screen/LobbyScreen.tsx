'use client';

import { RuneField } from '@/components/shared/RuneField';
import { HostHomeActions } from '@/features/lobby/ui/components/HostHomeActions';
import { HostLobbyLayout } from '@/features/lobby/ui/components/HostLobbyLayout';
import { LobbyHostActions } from '@/features/lobby/ui/components/LobbyHostActions';
import LobbyNameForm from '@/features/lobby/ui/components/LobbyNameForm';
import { LobbyPlayerStage } from '@/features/lobby/ui/components/LobbyPlayerStage';
import { useLobbyScreen } from '@/features/lobby/hooks/use-lobby-screen';

export default function LobbyScreen() {
  const screen = useLobbyScreen();
  const {
    name, setName, lobby, error, connected, pending, isLocalHost, host, players,
    connectedPlayers, currentPlayer, roleClass, createHost, createSandbox, join, start, cancel, deleteRoom,
  } = screen;

  return <main className={`lobby-shell ${roleClass} ${lobby ? 'lobby-shell--active' : 'lobby-shell--home'}`}>
    <RuneField />
    {!lobby && isLocalHost === null && <p className="role-resolution" role="status">Đang xác định chế độ kết nối…</p>}
    {!lobby && isLocalHost !== null && <section className="home-content" aria-labelledby="page-title">
      <h1 id="page-title" className="game-title"><span>SÓI</span><span>VÀ</span><span>CỪU</span></h1>
      {isLocalHost ? <HostHomeActions connected={connected} pending={pending} error={error} onCreate={createHost} onCreateSandbox={createSandbox} /> : <div className="home-action player-home-action">
        <p className="home-tagline">Hãy để màn đêm định đoạt tất cả</p>
        <LobbyNameForm label="Tên hiển thị" action="Tham gia phòng" pendingAction="Đang tham gia…" helper="Từ 1 đến 24 ký tự." name={name} error={error} disabled={!connected || pending || !lobby} onNameChange={setName} onSubmit={join} />
        {!lobby && <p className="waiting-note" role="status">Đang chờ Chủ phòng tạo phòng trên máy chủ.</p>}
      </div>}
      {!isLocalHost && <div className="connection-footer" role="status"><span className={`presence ${connected ? 'online' : ''}`} />{connected ? 'Đã kết nối với máy chủ' : 'Đang kết nối với máy chủ…'}</div>}
    </section>}
    {lobby && host && <HostLobbyLayout
      players={players}
      connectedPlayers={connectedPlayers}
      connected={connected}
      pending={pending}
      error={error}
      started={lobby.phase === 'started'}
      onStart={start}
      onCancel={cancel}
      onDelete={deleteRoom}
    />}
    {lobby && !host && <section className="lobby-content" aria-labelledby="page-title">
      <p className="phase-label">PHÒNG CHƠI</p>
      <h1 id="page-title">Cùng vào phòng</h1>
      <p className="intro">{lobby.phase === 'started' ? 'Các đội đã được Game Engine phân chia.' : isLocalHost ? 'Phòng đã sẵn sàng. Chờ mọi người tham gia trước khi bắt đầu.' : 'Nhập tên hiển thị để tham gia ván chơi cùng mọi người trong mạng nội bộ.'}</p>
      <section className="roster" aria-label="Danh sách người chơi">
        <div className="roster-heading">
          <div><h2>Người chơi</h2><p>{connectedPlayers} đang kết nối · {players.filter((player) => !player.isHost).length}/10 chỗ</p></div>
          {!connected && <span className="connection-state is-offline" role="status">Đang kết nối lại</span>}
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
