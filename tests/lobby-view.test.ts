import { describe, expect, it } from 'vitest';
import { createLobbyView } from '../backend/lobby-view';
import type { GameState } from '../web-game/game/game-types';
import type { LobbyPlayerView } from '../shared/lobby-contract';

const players: LobbyPlayerView[] = [
  { id: 'host', name: 'Host', isHost: true, connected: true },
  { id: 'wolf', name: 'Wolf', isHost: false, connected: true },
  { id: 'sheep', name: 'Sheep', isHost: false, connected: true },
];
const game: GameState = {
  phase: 'selection', players: [
    { id: 'wolf', name: 'Wolf', isHost: false, team: 'wolf' },
    { id: 'sheep', name: 'Sheep', isHost: false, team: 'sheep' },
  ], round: 0, rounds: 1, scores: { wolf: 0, sheep: 0 },
};

describe('authorized lobby views', () => {
  it.each(['wolf', 'sheep'] as const)('sends only the %s roster to an assigned player', (team) => {
    const teammate = { id: 'ally', name: 'An', isHost: false, team, cardChallengeId: 'private' };
    const state = { ...game, players: [...game.players, teammate] };
    const view = createLobbyView('started', players, state, team, [], 0, 10_000);
    expect(view.game).toEqual({
      phase: 'team-assignment', role: 'player', team, remainingMs: 10_000,
      teamMembers: [
        { id: team, name: team === 'wolf' ? 'Wolf' : 'Sheep' },
        { id: 'ally', name: 'An' },
      ],
    });
    expect(createLobbyView('started', players, state, undefined, [], 0, 10_000).game).toBeUndefined();
  });

  it('shows the full assignment to the Host and only the viewer team to a player', () => {
    expect(createLobbyView('started', players, game, 'host').players.map((player) => player.team))
      .toEqual([undefined, 'wolf', 'sheep']);
    expect(createLobbyView('started', players, game, 'wolf').players.map((player) => player.team))
      .toEqual([undefined, 'wolf', undefined]);
  });
});
