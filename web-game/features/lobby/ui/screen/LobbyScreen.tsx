'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HostHomeActions } from '@/features/lobby/ui/components/HostHomeActions';
import { HostLobbyLayout } from '@/features/lobby/ui/components/HostLobbyLayout';
import { PlayerLobbyLayout } from '@/features/lobby/ui/components/PlayerLobbyLayout';
import { PlayerJoinPanel } from '../components/player-join-panel';
import { PlayerBottomNav } from '@/features/lobby/ui/components/PlayerBottomNav';
import { PlayerCardSelection } from '@/features/game/ui/components/PlayerCardSelection';
import { HostCardSelection } from '@/features/game/ui/components/HostCardSelection';
import { HostSelectionActions } from '@/features/game/ui/components/HostSelectionActions';
import { PlayerGameScreen } from '@/features/game/ui/screen/PlayerGameScreen';
import { ManageGameScreen } from '@/features/game/ui/screen/ManageGameScreen';
import { EndGameScreen } from '@/features/results/ui/screen/EndGameScreen';
import { TeamAssignmentScreen } from './TeamAssignmentScreen';
import { PageTransitionFrame } from '@/features/lobby/ui/components/PageTransitionFrame';
import { useLobbyScreen } from '@/features/lobby/hooks/use-lobby-screen';
import { getHomeContentClassName, getHomeTitleClassName, getLobbyShellClassName } from './lobby-screen-classes';
import { getLobbyScreenKey } from './lobby-screen-key';
import { LoadingScreen } from './LoadingScreen';
import { usePageTransition, withPageTransition } from '@/features/lobby/hooks/use-page-transition';

export default function LobbyScreen() {
  const [comingSoon, setComingSoon] = useState('');
  const router = useRouter();
  const screen = useLobbyScreen();
  const {
    name, setName, lobby, error, connected, pending, animatePageTransitions, isLocalHost, host, players, setError,
    connectedPlayers, currentPlayer, roleClass, createHost, createSandbox, join, start, cancel, deleteRoom, replay, selectCard, removeCard, attack, defend, recordOutcome,
  } = screen;
  const isPlayerView = roleClass === 'lobby-shell--player';
  const isStartedGuest = lobby?.phase === 'started' && !currentPlayer && isLocalHost !== true;
  const shellClassName = getLobbyShellClassName(isPlayerView, Boolean(lobby));
  const hostCardShellClassName = `${shellClassName} relative isolate overflow-hidden bg-scroll px-[clamp(1rem,4.2vw,5rem)] !bg-[linear-gradient(180deg,#722f37_0%,#57272d_54%,#080607_100%)]`;
  const screenKey = getLobbyScreenKey(lobby?.game?.phase, lobby?.game?.role, host, Boolean(currentPlayer));
  const pageTransition = usePageTransition(screenKey, animatePageTransitions, error, () => setError('Máy chủ chưa phản hồi trong 3 giây. Hãy kiểm tra trạng thái phòng rồi thử lại.'));
  if (pageTransition.isLoading) return <PageTransitionFrame screenKey="loading" animateTransitions={animatePageTransitions} className={shellClassName} density={isPlayerView ? 'player' : 'default'}><LoadingScreen audience={isLocalHost === true ? 'host' : 'player'} /></PageTransitionFrame>;

  if (lobby?.game?.phase === 'team-assignment') {
    if (lobby.game.role === 'host') return <PageTransitionFrame screenKey={screenKey} animateTransitions={animatePageTransitions} className={shellClassName}>
      <main className="relative z-[1] min-h-dvh">
      <HostLobbyLayout players={players} connectedPlayers={connectedPlayers} pending={pending} error={error}
        started assignmentRemainingMs={lobby.game.remainingMs} onStart={withPageTransition(pageTransition.beginTransition, start)} onCancel={withPageTransition(pageTransition.beginTransition, cancel)} onDelete={withPageTransition(pageTransition.beginTransition, deleteRoom)} />
      </main>
    </PageTransitionFrame>;
    return <PageTransitionFrame screenKey={screenKey} animateTransitions={animatePageTransitions} className={shellClassName} density="player">
      <main className="relative z-[1] flex min-h-dvh items-center justify-center">
      <TeamAssignmentScreen assignment={lobby.game} animateEntrance={animatePageTransitions} />
      </main>
    </PageTransitionFrame>;
  }
  if (lobby?.game?.phase === 'selection') {
    const selectionFrameClassName = lobby.game.role === 'host'
      ? hostCardShellClassName
      : `${shellClassName} flex !min-h-svh justify-center overflow-x-hidden !overflow-y-auto !bg-[linear-gradient(180deg,#722f37_0%,#57272d_54%,#080607_100%)]`;
    return <PageTransitionFrame screenKey={screenKey} animateTransitions={animatePageTransitions} className={selectionFrameClassName} density={isPlayerView ? 'player' : 'default'}>
      <main className="relative z-[1]">
      {lobby.game.role === 'host'
        ? <><HostCardSelection selection={lobby.game.selection} />
          <HostSelectionActions playerCount={connectedPlayers} pending={pending} onStart={withPageTransition(pageTransition.beginTransition, start)} onCancel={withPageTransition(pageTransition.beginTransition, cancel)} onDelete={withPageTransition(pageTransition.beginTransition, deleteRoom)} onReplay={withPageTransition(pageTransition.beginTransition, replay)} />
          {error && <p className="relative z-[1] my-[14px] text-[#ffb6bd] text-content" role="alert">{error}</p>}
        </>
        : <PlayerCardSelection selection={lobby.game.selection} connected={connected} pending={pending} error={error} onSubmit={selectCard} onRemove={removeCard} />}
      </main>
    </PageTransitionFrame>;
  }
  if (lobby?.game?.phase === 'turns') {
    if (lobby.game.role === 'host') return <PageTransitionFrame screenKey={screenKey} animateTransitions={animatePageTransitions} className={hostCardShellClassName}>
      <ManageGameScreen game={lobby.game} players={players} pending={pending} error={error} onOutcome={recordOutcome} onCancel={withPageTransition(pageTransition.beginTransition, cancel)} onReplay={withPageTransition(pageTransition.beginTransition, replay)} />
    </PageTransitionFrame>;
    return <PageTransitionFrame screenKey={screenKey} animateTransitions={animatePageTransitions} className={`${shellClassName} !min-h-svh !bg-[linear-gradient(180deg,#722f37_0%,#57272d_54%,#080607_100%)]`} density="player">
      <PlayerGameScreen game={lobby.game} selfId={screen.selfId} players={players} pending={pending} error={error} onAttack={attack} onDefend={defend} />
    </PageTransitionFrame>;
  }
  if (lobby?.game?.phase === 'results') {
    return <PageTransitionFrame screenKey={screenKey} animateTransitions={animatePageTransitions} className={`${shellClassName} !bg-[linear-gradient(180deg,#722f37_0%,#57272d_54%,#080607_100%)]`} density={lobby.game.role === 'player' ? 'player' : 'default'}>
      <EndGameScreen result={lobby.game} audience={lobby.game.role} onReturnHome={host ? withPageTransition(pageTransition.beginTransition, cancel) : undefined} onReplay={host ? withPageTransition(pageTransition.beginTransition, replay) : undefined} pending={pending} />
    </PageTransitionFrame>;
  }

  return <PageTransitionFrame screenKey={screenKey} animateTransitions={animatePageTransitions} className={shellClassName} density={isPlayerView ? 'player' : 'default'}>
    <main className={`relative z-[1] min-h-dvh ${!lobby ? 'flex items-stretch' : ''}`}>
    {!lobby && isLocalHost === null && <p className="relative z-[1] grid min-h-dvh place-items-center m-0 text-white font-type-body text-subtitle" role="status">Đang xác định chế độ kết nối…</p>}
    {isLocalHost === true && !lobby && <section className={getHomeContentClassName(true)} aria-labelledby="page-title">
      <h1 id="page-title" className={getHomeTitleClassName(isLocalHost)}><span>SÓI</span><span>VÀ</span><span>CỪU</span></h1>
      <HostHomeActions connected={connected} pending={pending} error={error} onCreate={withPageTransition(pageTransition.beginTransition, createHost)} onCreateSandbox={withPageTransition(pageTransition.beginTransition, createSandbox)} />
    </section>}
    {isLocalHost === false && !currentPlayer && <section className={getHomeContentClassName(false)} aria-labelledby="page-title">
      <h1 id="page-title" className={getHomeTitleClassName(false)}><span>SÓI</span><span>VÀ</span><span>CỪU</span></h1>
      <PlayerJoinPanel name={name} error={error} disabled={!connected || pending || !lobby || isStartedGuest}
        waitingForRoom={!lobby && !isStartedGuest} isStartedGuest={isStartedGuest} onNameChange={setName}
        onSubmit={withPageTransition(pageTransition.beginTransition, join)} />
    </section>}
    {lobby?.phase === 'lobby' && currentPlayer && !host && <PlayerLobbyLayout players={players} error={error} />}
    {lobby && host && <HostLobbyLayout
      players={players}
      connectedPlayers={connectedPlayers}
      pending={pending}
      error={error}
      started={lobby.phase === 'started'}
      onStart={withPageTransition(pageTransition.beginTransition, start)}
      onCancel={withPageTransition(pageTransition.beginTransition, cancel)}
      onDelete={withPageTransition(pageTransition.beginTransition, deleteRoom)}
    />}
    {isLocalHost === false && !lobby?.game && <>
      {comingSoon && <p className="fixed z-[11] right-4 bottom-[max(84px,calc(env(safe-area-inset-bottom)+56px))] left-4 m-0 text-white font-type-body text-content leading-[1.4] text-center" role="status">{comingSoon} · Sắp ra mắt</p>}
      <PlayerBottomNav enteringHome={!currentPlayer}
        onOpenWolf={() => { setComingSoon(''); router.push('/wolf-team'); }}
        onOpenSheep={() => { setComingSoon(''); router.push('/sheep-team'); }}
        onComingSoon={(item) => setComingSoon(item)}
      />
    </>}
    </main>
  </PageTransitionFrame>;
}
