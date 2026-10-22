import type { CSSProperties } from 'react';
import type { LobbyPlayerView } from '../../../../shared/lobby-contract';

export function useLobbyPlayerStage(
  players: readonly LobbyPlayerView[],
  started: boolean,
  canSeeAllTeams: boolean,
) {
  const participants = players.filter((player) => !player.isHost);
  const visibleParticipants = started && !canSeeAllTeams
    ? participants.filter((player) => player.team)
    : participants;
  const wolfTeam = participants.filter((player) => player.team === 'wolf');
  const sheepTeam = participants.filter((player) => player.team === 'sheep');
  const tokens = visibleParticipants.map((player) => {
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
    return { player, style };
  });

  return { wolfTeam, sheepTeam, tokens };
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
