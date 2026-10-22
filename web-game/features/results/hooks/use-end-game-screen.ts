import type { Team } from '../../../game/game-types';

export interface EndGameResult {
  scores: Readonly<Record<Team, number>>;
  winner: Team | 'draw';
  rounds: number;
}

const TEAM_LABEL: Record<Team, string> = { wolf: 'Đội Sói', sheep: 'Đội Cừu' };

export function useEndGameScreen(result: EndGameResult) {
  const headline = result.winner === 'draw' ? 'Hòa' : `${TEAM_LABEL[result.winner]} chiến thắng`;
  const teamLabel = (team: Team) => TEAM_LABEL[team];
  return { headline, teamLabel };
}
