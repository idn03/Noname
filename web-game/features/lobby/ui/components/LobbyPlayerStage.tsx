import type { CSSProperties } from 'react';
import type { LobbyPlayerView } from '../../../../../shared/lobby-contract';

interface LobbyPlayerStageProps {
  players: readonly LobbyPlayerView[];
  started: boolean;
  canSeeAllTeams: boolean;
}

export function LobbyPlayerStage({ players, started, canSeeAllTeams }: LobbyPlayerStageProps) {
  const participants = players.filter((player) => !player.isHost);
  const visibleParticipants = started && !canSeeAllTeams
    ? participants.filter((player) => player.team)
    : participants;
  const wolfTeam = participants.filter((player) => player.team === 'wolf');
  const sheepTeam = participants.filter((player) => player.team === 'sheep');

  return <div className={`lobby-stage ${started ? 'lobby-stage--assigned' : ''}`} role="group" aria-label={started ? 'Người chơi sau khi chia đội' : 'Người chơi đang chờ chia đội'}>
    {started && <div className="lobby-team-zones" aria-hidden="true">
      <section className="lobby-team-zone lobby-team-zone--wolf"><h3><img src="/assets/teams/wolf-icon.svg" alt="" />Đội Sói {canSeeAllTeams && <span>{wolfTeam.length}</span>}</h3></section>
      <section className="lobby-team-zone lobby-team-zone--sheep"><h3><img src="/assets/teams/sheep-icon.svg" alt="" />Đội Cừu {canSeeAllTeams && <span>{sheepTeam.length}</span>}</h3></section>
    </div>}
    <ul className="lobby-player-tokens">
      {visibleParticipants.map((player) => {
        const teamPlayers = player.team === 'wolf' ? wolfTeam : sheepTeam;
        const teamIndex = teamPlayers.findIndex((member) => member.id === player.id);
        const hash = stableHash(player.id);
        const position = started && player.team && teamIndex >= 0
          ? teamPosition(player.team, teamIndex)
          : scatterPosition(hash);
        const style: CSSProperties = {
          left: `${position.left}%`,
          top: `${position.top}%`,
          transform: `translate(-50%, -50%) rotate(${started ? 0 : hash % 17 - 8}deg)`,
          transitionDelay: started ? `${hash % 420}ms` : '0ms',
        };

        return <li className={`lobby-player-token ${player.connected ? '' : 'is-disconnected'}`} key={player.id} style={style}>
          <span className="sr-only">{player.team ? `Đội ${player.team === 'wolf' ? 'Sói' : 'Cừu'}: ` : ''}</span>
          <span className={`presence ${player.connected ? 'online' : ''}`} aria-hidden="true" />
          <span>{player.name}</span>
        </li>;
      })}
    </ul>
  </div>;
}

function stableHash(value: string): number {
  let hash = 2166136261;
  for (const character of value) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  return hash >>> 0;
}

function scatterPosition(hash: number) {
  return { left: 8 + hash % 84, top: 18 + (hash >>> 8) % 68 };
}

function teamPosition(team: 'wolf' | 'sheep', index: number) {
  const teamLeft = team === 'wolf' ? 8 : 56;
  return { left: teamLeft + (index % 3) * 15, top: 43 + Math.floor(index / 3) * 27 };
}
