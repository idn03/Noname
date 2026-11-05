import { describe, expect, it } from 'vitest';
import { LobbySession } from '../backend/lobby-session';

describe('Host lobby lifecycle', () => {
  it('starts only with six connected players and requires confirmation below ten', () => {
    const session = LobbySession.createForHost();
    const host = session.connectHost();
    const guests = Array.from({ length: 6 }, (_, index) => session.join(`P${index}`));
    const first = guests[0];
    if (typeof first === 'string') throw new Error('Expected player admission');

    expect(session.start(first.playerId)).toBe('NOT_AUTHORIZED');
    expect(session.start(host.playerId)).toBe('START_REQUIRES_CONFIRMATION');
    const started = session.start(host.playerId, true);
    expect(started).toMatchObject({ lobby: { phase: 'started' } });
    if (typeof started === 'string') return;
    expect(started.gameState.players).toHaveLength(6);
    expect(started.gameState.players.every((player) => !player.isHost)).toBe(true);
    expect(session.currentGameState()).toEqual(started.gameState);
    expect(session.join('Late')).toBe('LOBBY_CLOSED');
  });

  it('counts connected joining players, not the Host or disconnected places', () => {
    const session = LobbySession.createForHost();
    const host = session.connectHost();
    const guests = Array.from({ length: 6 }, (_, index) => session.join(`P${index}`));
    const first = guests[0];
    if (typeof first === 'string') throw new Error('Expected player admission');
    session.disconnect(first.playerId);

    expect(session.start(host.playerId, true)).toBe('NOT_ENOUGH_PLAYERS');
    expect(session.view().phase).toBe('lobby');
  });

  it('starts with ten connected joining players without a low-population confirmation', () => {
    const session = LobbySession.createForHost();
    const host = session.connectHost();
    Array.from({ length: 10 }, (_, index) => session.join(`P${index}`));

    const started = session.start(host.playerId);
    expect(started).toMatchObject({ lobby: { phase: 'started' } });
    if (typeof started !== 'string') expect(started.gameState.players).toHaveLength(10);
  });

  it('submits Sandbox defaults through the engine for every card slot', () => {
    const random = { nextInt: (upperBound: number) => upperBound === 5 ? 4 : 0 };
    const session = LobbySession.createSandboxForHost(undefined, random);
    const host = session.connectHost();
    const started = session.start(host.playerId);
    expect(typeof started).not.toBe('string');
    if (typeof started === 'string') return;

    const state = started.gameState;
    expect(state.phase).toBe('turns');
    const wolves = state.players.filter((player) => player.team === 'wolf' && player.hasCardSlot);
    const sheep = state.players.filter((player) => player.team === 'sheep' && player.hasCardSlot);
    expect(wolves).toHaveLength(5);
    expect(wolves.every((player) => player.cardCategory === 'music' && Boolean(player.cardChallengeId))).toBe(true);
    expect(new Set(wolves.map((player) => player.cardChallengeId)).size).toBe(wolves.length);
    expect(sheep.map((player) => player.cardCategory)).toEqual(['music', 'music', 'travel', 'music', 'music']);
    expect(state.players.every((player) => player.cardSubmitted === true)).toBe(true);
    expect(state.activeTurn?.defenderId).toBeDefined();
    expect(wolves.filter((player) => player.cardUsed)).toHaveLength(1);
    expect(sheep.filter((player) => player.cardUsed)).toHaveLength(1);

    expect(session.recordChallengeOutcome(host.playerId, state.round, false)).toBeUndefined();
    expect(session.currentGameState()).toMatchObject({ round: 2, activeTurn: { round: 2, defenderId: expect.any(String) } });
  });

  it('invalidates credentials and engine state when the Host ends the session', () => {
    const session = LobbySession.createForHost();
    const host = session.connectHost();
    const guest = session.join('Guest');
    if (typeof guest === 'string') throw new Error('Expected player admission');

    expect(session.end(guest.playerId)).toBe('NOT_AUTHORIZED');
    expect(session.end(host.playerId)).toBeUndefined();
    expect(session.resume(guest.credential)).toBeUndefined();
    expect(session.currentGameState()).toBeUndefined();
    expect(session.join('Later')).toBe('LOBBY_CLOSED');
  });
});
