import { gameError } from './game-error';
import type { GamePlayer } from './game-types';
import { shuffled, type RandomSource } from './randomness';
import type { PreparedGame, TeamPreparation } from './game-engine';

export const prepareBalancedTeams: TeamPreparation = (players, random) => {
  const participants = players.filter((player) => !player.isHost);
  if (participants.length < 6 || participants.length > 10) {
    return gameError<PreparedGame>('INVALID_INPUT', 'A game requires 6–10 connected players.');
  }

  const randomized = shuffled(participants, random);
  const extraTeam = participants.length % 2 === 0
    ? undefined
    : random.nextInt(2) === 0 ? 'wolf' : 'sheep';
  const wolfCount = Math.floor(participants.length / 2) + (extraTeam === 'wolf' ? 1 : 0);
  const teamById = new Map(randomized.map((player, index) => [
    player.id,
    index < wolfCount ? 'wolf' as const : 'sheep' as const,
  ]));

  return {
    ok: true,
    value: {
      players: players.map((player) => player.isHost
        ? withoutTeam(player)
        : { ...player, team: teamById.get(player.id) }),
      rounds: Math.floor(participants.length / 2),
    },
  };
};

function withoutTeam(player: GamePlayer): GamePlayer {
  const { team: _team, ...observer } = player;
  return observer;
}
