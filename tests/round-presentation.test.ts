import { expect, it } from 'vitest';
import type { CompletedRoundView, LobbyGameView } from '../shared/card-selection-contract';
import { pendingRound } from '../web-game/features/game/hooks/use-round-presentation';

it('presents confirmed rounds in order, including several rounds delivered with final scores', () => {
  const completed = (round: number, sheep: number, wolf: number): CompletedRoundView => ({
    round, attackerId: 'wolf-' + round, attackCategoryId: 'music', attackChallengeId: 'song',
    scoreChange: { sheep, wolf },
  });
  const rounds = [completed(1, 2, 0), completed(2, 0, 2), completed(3, 1, 0)];
  const final: LobbyGameView = {
    phase: 'results', role: 'player', winner: 'sheep', rounds: 3, scores: { sheep: 3, wolf: 2 },
    members: { sheep: [], wolf: [] }, roundHistory: rounds,
  };
  expect(pendingRound(final, 2)).toEqual({ entry: rounds[1], before: { sheep: 2, wolf: 0 } });
  expect(pendingRound(final, 3)).toEqual({ entry: rounds[2], before: { sheep: 2, wolf: 2 } });
  expect(pendingRound(final, 4)).toBeUndefined();
  expect(pendingRound({ ...final, roundHistory: undefined }, 3)).toBeUndefined();
});
