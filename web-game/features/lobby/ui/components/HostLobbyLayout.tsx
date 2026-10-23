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

  return <section className="host-lobby-layout" aria-label="Phòng chơi của Chủ phòng">
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

    <aside className="host-lobby-teams" aria-label="Hai đội trong trận đấu">
      <div className="host-lobby-team host-lobby-team--wolf"><img src="/assets/teams/wolf-icon.svg" alt="" /><h2>Đội Sói:</h2></div>
      <div className="host-lobby-team host-lobby-team--sheep"><img src="/assets/teams/sheep-icon.svg" alt="" /><h2>Đội Cừu:</h2></div>
    </aside>
  </section>;
}
