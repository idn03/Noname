'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RuneField } from '@/components/shared/RuneField';
import { HostHomeActions } from '@/features/lobby/ui/components/HostHomeActions';
import { HostLobbyLayout } from '@/features/lobby/ui/components/HostLobbyLayout';
import { LobbyHostActions } from '@/features/lobby/ui/components/LobbyHostActions';
import LobbyNameForm from '@/features/lobby/ui/components/LobbyNameForm';
import { LobbyPlayerStage } from '@/features/lobby/ui/components/LobbyPlayerStage';
import { PlayerBottomNav } from '@/features/lobby/ui/components/PlayerBottomNav';
import { PlayerCardSelection } from '@/features/game/ui/components/PlayerCardSelection';
import { HostCardSelection } from '@/features/game/ui/components/HostCardSelection';
import { HostSelectionActions } from '@/features/game/ui/components/HostSelectionActions';
import { PlayerGameScreen } from '@/features/game/ui/screen/PlayerGameScreen';
import { ManageGameScreen } from '@/features/game/ui/screen/ManageGameScreen';
import { TeamAssignmentScreen } from './TeamAssignmentScreen';
import { useLobbyScreen } from '@/features/lobby/hooks/use-lobby-screen';
import { getHomeContentClassName, getHomeTitleClassName, getLobbyShellClassName } from './lobby-screen-classes';

export default function LobbyScreen() {
  const [comingSoon, setComingSoon] = useState('');
  const router = useRouter();
  const screen = useLobbyScreen();
  const {
    name, setName, lobby, error, connected, pending, isLocalHost, host, players,
    connectedPlayers, currentPlayer, roleClass, createHost, createSandbox, join, start, cancel, deleteRoom, selectCard, removeCard, attack, defend, recordOutcome,
  } = screen;
  const isPlayerView = roleClass === 'lobby-shell--player';
  const isStartedGuest = lobby?.phase === 'started' && !currentPlayer && isLocalHost !== true;
  const shellClassName = getLobbyShellClassName(isPlayerView, Boolean(lobby));
  const hostCardShellClassName = `${shellClassName} relative isolate overflow-hidden bg-scroll px-[clamp(1rem,4.2vw,5rem)] !bg-[linear-gradient(180deg,#722f37_0%,#57272d_54%,#080607_100%)]`;

  if (lobby?.game?.phase === 'team-assignment') {
    if (lobby.game.role === 'host') return <main className={shellClassName}>
      <RuneField />
      <HostLobbyLayout players={players} connectedPlayers={connectedPlayers} connected={connected} pending={pending} error={error}
        started assignmentRemainingMs={lobby.game.remainingMs} onStart={start} onCancel={cancel} onDelete={deleteRoom} />
    </main>;
    return <main className={`${shellClassName} flex items-center justify-center`}>
      <RuneField density="player" />
      <TeamAssignmentScreen team={lobby.game.team} remainingMs={lobby.game.remainingMs} />
    </main>;
  }

  if (lobby?.game?.phase === 'selection') {
    return <main className={lobby.game.role === 'host' ? hostCardShellClassName : `${shellClassName} flex !min-h-svh justify-center overflow-x-hidden !overflow-y-auto !bg-[linear-gradient(180deg,#722f37_0%,#57272d_54%,#080607_100%)]`}>
      <RuneField density={isPlayerView ? 'player' : 'default'} />
      {lobby.game.role === 'host'
        ? <><HostCardSelection selection={lobby.game.selection} />
          <HostSelectionActions playerCount={connectedPlayers} pending={pending} onStart={start} onCancel={cancel} onDelete={deleteRoom} />
          {error && <p className="relative z-[1] my-[14px] text-[#ffb6bd] text-content" role="alert">{error}</p>}
        </>
        : <PlayerCardSelection selection={lobby.game.selection} connected={connected} pending={pending} error={error} onSubmit={selectCard} onRemove={removeCard} />}
    </main>;
  }
  if (lobby?.game?.phase === 'turns') {
    if (lobby.game.role === 'host') return <main className={hostCardShellClassName}>
      <RuneField /><ManageGameScreen game={lobby.game} players={players} pending={pending} error={error} onOutcome={recordOutcome} onCancel={cancel} />
    </main>;
    return <main className={`${shellClassName} !min-h-svh !bg-[linear-gradient(180deg,#722f37_0%,#57272d_54%,#080607_100%)]`}>
      <RuneField density="player" /><PlayerGameScreen game={lobby.game} selfId={screen.selfId} players={players} pending={pending} error={error} onAttack={attack} onDefend={defend} />
    </main>;
  }

  return <main className={`${shellClassName} ${!lobby ? 'flex items-stretch' : ''}`}>
    <RuneField density={isPlayerView ? 'player' : 'default'} />
    {!lobby && isLocalHost === null && <p className="relative z-[1] grid min-h-dvh place-items-center m-0 text-white font-type-body text-subtitle" role="status">Đang xác định chế độ kết nối…</p>}
    {(!lobby || isStartedGuest) && isLocalHost !== null && <section className={getHomeContentClassName(isLocalHost)} aria-labelledby="page-title">
      <h1 id="page-title" className={getHomeTitleClassName(isLocalHost)}><span>SÓI</span><span>VÀ</span><span>CỪU</span></h1>
      {isLocalHost ? <HostHomeActions connected={connected} pending={pending} error={error} onCreate={createHost} onCreateSandbox={createSandbox} /> : <div className="min-w-0 self-auto my-0 mt-[clamp(40px,11vh,112px)] max-[700px]:mt-2">
        <p className="m-0 mb-7 text-white font-type-body text-subtitle font-normal leading-[1.4]">Hãy để màn đêm định đoạt tất cả</p>
        <LobbyNameForm label="Tên hiển thị" action="Tham gia phòng" pendingAction="Đang tham gia…" name={name} error={error} disabled={!connected || pending || !lobby || isStartedGuest} onNameChange={setName} onSubmit={join} />
        {isStartedGuest
          ? <p className="m-0 mt-1 ml-2 text-[#aaa] font-type-body text-content" role="status">Ván chơi đã bắt đầu và không nhận thêm người chơi mới.</p>
          : !lobby && <p className="m-0 mt-1 ml-2 text-[#aaa] font-type-body text-content" role="status">Đang chờ Chủ phòng tạo phòng trên máy chủ.</p>}
      </div>}
      {!isLocalHost && <>
        {comingSoon && <p className="fixed z-[11] right-4 bottom-[max(84px,calc(env(safe-area-inset-bottom)+56px))] left-4 m-0 text-white font-type-body text-content leading-[1.4] text-center" role="status">{comingSoon} · Sắp ra mắt</p>}
        <PlayerBottomNav
          onOpenWolf={() => { setComingSoon(''); router.push('/wolf-team'); }}
          onOpenSheep={() => { setComingSoon(''); router.push('/sheep-team'); }}
          onComingSoon={(item) => setComingSoon(item)}
        />
      </>}
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
    {lobby && !host && !isStartedGuest && <section className="relative mx-auto w-[calc(100%_-_40px)] max-w-[680px] pt-[clamp(52px,11vh,112px)] pb-12" aria-labelledby="page-title">
      <p className="m-0 mb-[14px] text-[#bd858a] text-content font-bold tracking-[.16em]">PHÒNG CHƠI</p>
      <h1 id="page-title" className="m-0 font-type-page-title text-[length:clamp(var(--text-heading6),6vw,var(--text-heading3))] leading-[1.08] tracking-[-.04em]">Cùng vào phòng</h1>
      <p className="mt-4 mb-[38px] max-w-[48ch] font-type-body text-[#b5b5b5] leading-[1.65]">{lobby.phase === 'started' ? 'Các đội đã được Game Engine phân chia.' : isLocalHost ? 'Phòng đã sẵn sàng. Chờ mọi người tham gia trước khi bắt đầu.' : 'Nhập tên hiển thị để tham gia ván chơi cùng mọi người trong mạng nội bộ.'}</p>
      <section className="mt-[42px]" aria-label="Danh sách người chơi">
        <div className="flex items-center justify-between gap-4 border-b border-[#414141] pb-4 max-[520px]:flex-col max-[520px]:items-start">
          <div><h2 className="m-0 font-type-section-title text-title2">Người chơi</h2><p className="mt-[7px] mb-0 text-[#b5b5b5] text-content font-type-supporting">{connectedPlayers} đang kết nối · {players.filter((player) => !player.isHost).length}/10 chỗ</p></div>
          {!connected && <span className="text-[#c9a1a4] text-content" role="status">Đang kết nối lại</span>}
        </div>
        <p className="my-[18px] flex w-fit items-center gap-[10px] text-white font-type-body text-subtitle">Chủ phòng <span className={`inline-block size-[9px] flex-[0_0_9px] rounded-full border border-[#888] ${players.find((player) => player.isHost)?.connected ? 'border-[#b85c66] bg-[#b85c66]' : ''}`} aria-hidden="true" /></p>
        <LobbyPlayerStage players={players} started={lobby.phase === 'started'} canSeeAllTeams={host} />
        {error && <p className="my-[14px] text-[#ffb6bd] text-content" role="alert">{error}</p>}
        {lobby.phase === 'lobby' && <>
          {!currentPlayer && <LobbyNameForm label="Tên hiển thị" action="Tham gia phòng" pendingAction="Đang tham gia…" helper="Từ 1 đến 24 ký tự." name={name} error="" disabled={!connected || pending} onNameChange={setName} onSubmit={join} />}
          {host ? <LobbyHostActions started={false} playerCount={connectedPlayers} pending={pending} onStart={start} onCancel={cancel} onDelete={deleteRoom} /> : <p className="text-[#aaa] text-content font-type-body">Đang chờ Chủ phòng bắt đầu trò chơi.</p>}
        </>}
        {lobby.phase === 'started' && host && <LobbyHostActions started playerCount={connectedPlayers} pending={pending} onStart={start} onCancel={cancel} onDelete={deleteRoom} />}
        {lobby.phase === 'started' && !host && <p className="text-[#aaa] text-content font-type-body">Phòng đã bắt đầu. Đang chờ thông tin ván chơi.</p>}
      </section>
      <div className="mt-12 flex items-center gap-[9px] text-[#999] text-content font-type-body" role="status"><span className={`inline-block size-[9px] flex-[0_0_9px] rounded-full border border-[#888] ${connected ? 'border-[#b85c66] bg-[#b85c66]' : ''}`} />{connected ? 'Kết nối với máy chủ phòng chơi' : 'Đang kết nối với máy chủ…'}</div>
    </section>}
  </main>;
}
