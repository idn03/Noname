import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import type { CompletedRoundView, LobbyGameView } from '@shared/card-selection-contract';

type Turns = Extract<LobbyGameView, { phase: 'turns' }>;
type Match = Extract<LobbyGameView, { phase: 'turns' | 'results' }>;

export function pendingRound(game: Match, nextRound: number) {
  const entries = game.roundHistory?.filter((entry) => entry.round >= nextRound) ?? [];
  const entry = entries[0];
  if (!entry) return;
  const before = { ...game.scores };
  for (const { scoreChange } of entries) {
    before.sheep -= scoreChange.sheep;
    before.wolf -= scoreChange.wolf;
  }
  return { entry, before };
}

export interface RoundAward {
  entry: CompletedRoundView;
  credited: boolean;
  credit: () => void;
}

export function useRoundPresentation(live: LobbyGameView | undefined, enabled: boolean) {
  const [previous, setPrevious] = useState<Turns>();
  const [nextRound, setNextRound] = useState(1);
  const [creditedRound, setCreditedRound] = useState(0);
  const match = live?.phase === 'turns' || live?.phase === 'results' ? live : undefined;
  const award = enabled && previous && match && match.role === previous.role
    ? pendingRound(match, nextRound) : undefined;
  const round = award?.entry.round;
  const credit = useCallback(() => {
    if (round !== undefined) setCreditedRound(round);
  }, [round]);
  const credited = round !== undefined && creditedRound === round;

  useLayoutEffect(() => {
    if (round !== undefined) return;
    const turns = live?.phase === 'turns' ? live : undefined;
    setPrevious(turns);
    setNextRound(turns?.round ?? 1);
    setCreditedRound(0);
  }, [live, round]);

  useEffect(() => {
    if (!credited || round === undefined) return;
    const timer = setTimeout(() => setNextRound(round + 1), 350);
    return () => clearTimeout(timer);
  }, [credited, round]);

  if (!previous || !award) return { game: live };
  const { entry, before } = award;
  const scores = credited
    ? { wolf: before.wolf + entry.scoreChange.wolf, sheep: before.sheep + entry.scoreChange.sheep }
    : before;
  const game = { ...previous, scores, round: entry.round, activeTurn: undefined };
  return { game, award: { entry, credited, credit } };
}
