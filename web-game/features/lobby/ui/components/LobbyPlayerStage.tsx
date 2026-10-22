import type { LobbyPlayerView } from '../../../../../shared/lobby-contract';
import { useLobbyPlayerStage } from '../../hooks/use-lobby-player-stage';

interface LobbyPlayerStageProps {
  players: readonly LobbyPlayerView[];
  started: boolean;
  canSeeAllTeams: boolean;
}

export function LobbyPlayerStage({ players, started, canSeeAllTeams }: LobbyPlayerStageProps) {
  const { wolfTeam, sheepTeam, tokens } = useLobbyPlayerStage(players, started, canSeeAllTeams);

  return <div className={`lobby-stage ${started ? 'lobby-stage--assigned' : ''}`} role="group" aria-label={started ? 'Người chơi sau khi chia đội' : 'Người chơi đang chờ chia đội'}>
    {started && <div className="lobby-team-zones" aria-hidden="true">
      <section className="lobby-team-zone lobby-team-zone--wolf"><h3><img src="/assets/teams/wolf-icon.svg" alt="" />Đội Sói {canSeeAllTeams && <span>{wolfTeam.length}</span>}</h3></section>
      <section className="lobby-team-zone lobby-team-zone--sheep"><h3><img src="/assets/teams/sheep-icon.svg" alt="" />Đội Cừu {canSeeAllTeams && <span>{sheepTeam.length}</span>}</h3></section>
    </div>}
    <ul className="lobby-player-tokens">
      {tokens.map(({ player, style }) => <li className={`lobby-player-token ${player.connected ? '' : 'is-disconnected'}`} key={player.id} style={style}>
        <span className="sr-only">{player.team ? `Đội ${player.team === 'wolf' ? 'Sói' : 'Cừu'}: ` : ''}</span>
        <span className={`presence ${player.connected ? 'online' : ''}`} aria-hidden="true" />
        <span>{player.name}</span>
      </li>)}
    </ul>
  </div>;
}
