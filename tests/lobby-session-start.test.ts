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
