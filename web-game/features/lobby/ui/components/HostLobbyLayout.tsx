import { useLayoutEffect, useRef } from 'react';
import type { LobbyPlayerView } from '@shared/lobby-contract';
import { LobbyHostActions } from '@/features/lobby/ui/components/LobbyHostActions';
import { LobbyPlayerStage } from '@/features/lobby/ui/components/LobbyPlayerStage';

interface HostLobbyLayoutProps {
  players: readonly LobbyPlayerView[];
  connectedPlayers: number;
  connected: boolean;
  pending: boolean;
  error: string;
  started: boolean;
  onStart: (confirmed: boolean) => void;
  onCancel: () => void;
  onDelete: () => void;
}

export function HostLobbyLayout(props: HostLobbyLayoutProps) {
  const { players, connectedPlayers, connected, pending, error, started, onStart, onCancel, onDelete } = props;
  const joinedPlayers = players.filter((player) => !player.isHost);
  const layoutRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!started || !layoutRef.current) return;
    const root = layoutRef.current;
    const rosterNames = new Map([...root.querySelectorAll<HTMLElement>('[data-roster-player-id]')]
      .map((element) => [element.dataset.rosterPlayerId, element]));
    const animations: Animation[] = [];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    root.querySelectorAll<HTMLElement>('[data-team-player-id]').forEach((target, index) => {
      const source = rosterNames.get(target.dataset.teamPlayerId);
      if (!source) { target.style.opacity = '1'; return; }
      const from = source.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const offsetX = from.left + from.width / 2 - to.left - to.width / 2;
      const offsetY = from.top + from.height / 2 - to.top - to.height / 2;
      const animation = target.animate([
        { transform: `translate(${offsetX}px, ${offsetY}px)`, opacity: 0 },
        { transform: 'translate(0, 0)', opacity: 1 },
      ], { duration: reducedMotion ? 180 : 1000, delay: reducedMotion ? 0 : index * 65, easing: 'cubic-bezier(.22,.7,.2,1)', fill: 'both' });
      animation.onfinish = () => { target.style.opacity = '1'; animation.cancel(); };
      animations.push(animation);
    });

    return () => animations.forEach((animation) => animation.cancel());
  }, [started]);

  const wolfPlayers = joinedPlayers.filter((player) => player.team === 'wolf');
  const sheepPlayers = joinedPlayers.filter((player) => player.team === 'sheep');

  return <section ref={layoutRef} className="host-lobby-layout" aria-label="Phòng chơi của Chủ phòng">
    <aside className="host-lobby-side">
      <h1 className="host-lobby-title" aria-label="Sói và Cừu"><span>SÓI</span><span>VÀ</span><span>CỪU</span></h1>
      <div className="host-lobby-controls">
        <LobbyHostActions started={started} playerCount={connectedPlayers} pending={pending} onStart={onStart} onCancel={onCancel} onDelete={onDelete} />
      </div>
    </aside>

    <section className="host-lobby-roster" aria-labelledby="host-lobby-roster-title">
      <header className="host-lobby-roster-heading">
        <div>
          <h2 id="host-lobby-roster-title">Danh sách người chơi</h2>
          <p>{joinedPlayers.length}/10 người chơi đã tham gia · {connectedPlayers} đang kết nối</p>
        </div>
        <span className={`connection-state ${connected ? '' : 'is-offline'}`} role="status">{connected ? 'Đã kết nối' : 'Đang kết nối lại'}</span>
      </header>
      <div className="host-lobby-roster-panel">
        <LobbyPlayerStage players={players} started={started} canSeeAllTeams />
      </div>
      {error && <p className="error-message" role="alert">{error}</p>}
    </section>

    <aside className={`host-lobby-teams ${started ? 'host-lobby-teams--assigned' : ''}`} aria-label="Hai đội trong trận đấu" aria-hidden={!started}>
      <div className="host-lobby-team host-lobby-team--wolf">
        <div className="host-lobby-team-heading"><img src="/assets/teams/wolf-icon.svg" alt="" /><h2>Đội Sói:</h2></div>
        {started && <ul className="host-lobby-team-player-list" aria-label="Người chơi đội Sói">
          {wolfPlayers.map((player) => <li key={player.id} data-team-player-id={player.id}>{player.name}</li>)}
        </ul>}
      </div>
      <div className="host-lobby-team host-lobby-team--sheep">
        <div className="host-lobby-team-heading"><img src="/assets/teams/sheep-icon.svg" alt="" /><h2>Đội Cừu:</h2></div>
        {started && <ul className="host-lobby-team-player-list" aria-label="Người chơi đội Cừu">
          {sheepPlayers.map((player) => <li key={player.id} data-team-player-id={player.id}>{player.name}</li>)}
        </ul>}
      </div>
    </aside>
  </section>;
}
