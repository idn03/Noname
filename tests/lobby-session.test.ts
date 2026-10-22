import { describe, expect, it } from 'vitest';
import { LobbySession } from '../backend/lobby-session';
import { parsePlayerName } from '../shared/lobby-contract';

describe('player identity and lobby session', () => {
  it('trims names and accepts only 1–24 visible characters without controls', () => {
    expect(parsePlayerName('  Alice  ')).toBe('Alice');
    expect(parsePlayerName('  ')).toBeUndefined();
    expect(parsePlayerName('a'.repeat(25))).toBeUndefined();
    expect(parsePlayerName('A\nB')).toBeUndefined();
    expect(parsePlayerName(42)).toBeUndefined();
    expect(parsePlayerName('😀'.repeat(24))).toBe('😀'.repeat(24));
  });

  it('gives duplicate display names distinct identities and credentials', () => {
    const lobby = LobbySession.createForHost();
    const first = lobby.join('Sam');
    const second = lobby.join('Sam');

    expect(typeof first).not.toBe('string');
    expect(typeof second).not.toBe('string');
    if (typeof first === 'string' || typeof second === 'string') return;
    expect(first.playerId).not.toBe(second.playerId);
    expect(first.credential).not.toBe(second.credential);
    expect(lobby.view().players.filter((player) => player.name === 'Sam')).toHaveLength(2);
  });

  it('allows ten joining players excluding the Host, including disconnected identities', () => {
    const lobby = LobbySession.createForHost();
    lobby.connectHost();
    const joined = Array.from({ length: 10 }, (_, index) => lobby.join(`P${index}`));
    const first = joined[0];
    if (typeof first === 'string') throw new Error('Expected first player to join');
    lobby.disconnect(first.playerId);

    expect(lobby.view().players).toHaveLength(11);
    expect(lobby.view().players.find((player) => player.id === first.playerId)?.connected).toBe(false);
    expect(lobby.join('Extra')).toBe('LOBBY_FULL');
  });

  it('reconnects the same identity without adding a participant', () => {
    const lobby = LobbySession.createForHost();
    const joined = lobby.join('Guest');
    if (typeof joined === 'string') throw new Error('Expected player to join');
    lobby.disconnect(joined.playerId);

    const resumed = lobby.resume(joined.credential);
    expect(resumed?.playerId).toBe(joined.playerId);
    expect(resumed?.lobby.players).toHaveLength(2);
    expect(resumed?.lobby.players.find((player) => player.id === joined.playerId)?.connected).toBe(true);
    expect(resumed?.credential).toBeDefined();
    expect(lobby.resume(joined.credential)).toBeUndefined();
    const refreshed = lobby.resume(resumed?.credential);
    expect(refreshed?.playerId).toBe(joined.playerId);
    expect(lobby.resume('invalid-token')).toBeUndefined();
    expect(lobby.resume({ credential: joined.credential })).toBeUndefined();
  });

  it('rejects invalid names without changing membership', () => {
    const lobby = LobbySession.createForHost();
    expect(lobby.join(' \t ')).toBe('INVALID_NAME');
    expect(lobby.view().players).toHaveLength(1);
    expect(lobby.join('Guest')).not.toBe('INVALID_NAME');
    expect(lobby.view().players).toHaveLength(2);
  });
});
