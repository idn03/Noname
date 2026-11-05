import type { Server, Socket } from 'socket.io';
import { describe, expect, it } from 'vitest';
import { attachLobbyTransport } from '../backend/lobby-transport';
import { bundledContent } from '../backend/db/bundled-content';
import type { LobbySession } from '../backend/lobby-session';
import { LOBBY_EVENTS, type LobbyCommandReply } from '../shared/lobby-contract';

describe('turn gameplay transport', () => {
  it('authenticates turn actions, broadcasts challenges, and rejects duplicate and stale submissions', () => {
    const io = new FakeIo();
    let session: LobbySession | undefined;
    const categories = bundledContent.map((category) => ({
      ...category,
      challenges: Array.from({ length: 4 }, (_, index) => ({
        id: `${category.id}-fixture-${index}`, text: `Fixture challenge ${index}`, categoryId: category.id,
      })),
    }));
    attachLobbyTransport(io as unknown as Server, () => session, (value) => { session = value; }, categories);
    const host = new FakeSocket('host', '127.0.0.1');
    io.connect(host);
    host.trigger(LOBBY_EVENTS.hostCreate, {}, () => undefined);
    const guests = Array.from({ length: 6 }, (_, index) => {
      const socket = new FakeSocket(`player-${index}`, '192.168.1.10');
      io.connect(socket);
      const replies: LobbyCommandReply[] = [];
      socket.trigger(LOBBY_EVENTS.join, { name: `P${index}` }, (reply: LobbyCommandReply) => replies.push(reply));
      return { socket, id: replies[0]?.playerId ?? '' };
    });
    host.trigger(LOBBY_EVENTS.hostStart, { confirmLowPopulation: true }, () => undefined);
    const state = session?.currentGameState();
    if (!state?.cardSelection) throw new Error('Expected initialized card selection');
    const wolves = guests.filter(({ id }) => state.players.some((player) => player.id === id && player.team === 'wolf' && player.hasCardSlot));
    const sheep = guests.filter(({ id }) => state.players.some((player) => player.id === id && player.team === 'sheep' && player.hasCardSlot));
    const sheepCategories = state.cardSelection.categoryIdsByTeam.sheep;
    const category = state.cardSelection.categoryIdsByTeam.wolf.find((id) => sheepCategories.includes(id));
    const challenges = category && state.cardSelection.challengeIdsByCategory[category];
    if (!category || !challenges || wolves.length < 2 || sheep.length < 2) throw new Error('Expected matching team categories and card slots');

    wolves.forEach(({ socket }, index) => socket.trigger(LOBBY_EVENTS.selectCard, {
      categoryId: category, challengeId: challenges[index],
    }, () => undefined));
    sheep.forEach(({ socket }) => socket.trigger(LOBBY_EVENTS.selectCard, { categoryId: category }, () => undefined));
    const attacker = wolves[0];
    const defender = sheep[0];
    if (!attacker || !defender) throw new Error('Expected attack and defense players');
    const attackReply: LobbyCommandReply[] = [];
    const unauthorized: LobbyCommandReply[] = [];
    host.trigger(LOBBY_EVENTS.attack, { round: 1 }, (reply: LobbyCommandReply) => unauthorized.push(reply));
    expect(unauthorized[0]).toMatchObject({ ok: false, error: { code: 'NOT_AUTHORIZED' } });
    attacker.socket.trigger(LOBBY_EVENTS.attack, { round: 1 }, (reply: LobbyCommandReply) => attackReply.push(reply));
    expect(attackReply[0]?.ok).toBe(true);
    expect(attacker.socket.outbound(LOBBY_EVENTS.state).at(-1)).toMatchObject({
      game: { phase: 'turns', activeTurn: { attackerId: attacker.id, round: 1, challenge: { text: expect.any(String) } } },
    });
    const defenseReply: LobbyCommandReply[] = [];
    defender.socket.trigger(LOBBY_EVENTS.defend, { round: 1 }, (reply: LobbyCommandReply) => defenseReply.push(reply));
    expect(defenseReply[0]?.ok).toBe(true);
    const duplicate: LobbyCommandReply[] = [];
    sheep[1]?.socket.trigger(LOBBY_EVENTS.defend, { round: 1 }, (reply: LobbyCommandReply) => duplicate.push(reply));
    expect(duplicate[0]).toMatchObject({ ok: false, error: { code: 'INVALID_TURN' } });

    const outcome: LobbyCommandReply[] = [];
    host.trigger(LOBBY_EVENTS.recordChallengeOutcome, { round: 1, succeeded: true }, (reply: LobbyCommandReply) => outcome.push(reply));
    expect(outcome[0]?.ok).toBe(true);
    const stale: LobbyCommandReply[] = [];
    host.trigger(LOBBY_EVENTS.recordChallengeOutcome, { round: 1, succeeded: false }, (reply: LobbyCommandReply) => stale.push(reply));
    expect(stale[0]).toMatchObject({ ok: false, error: { code: 'INVALID_TURN' } });
    expect(session?.currentGameState()).toMatchObject({ round: 2, scores: { wolf: 0, sheep: 2 } });
  });
});

class FakeIo {
  private connection?: (socket: Socket) => void;
  private readonly sockets: FakeSocket[] = [];
  on(_event: string, listener: (socket: Socket) => void) { this.connection = listener; }
  emit(event: string, payload: unknown) { for (const socket of this.sockets) socket.emit(event, payload); return this; }
  connect(socket: FakeSocket) { this.sockets.push(socket); this.connection?.(socket as unknown as Socket); }
}

class FakeSocket {
  private readonly listeners = new Map<string, (...args: never[]) => void>();
  private readonly sent = new Map<string, unknown[]>();
  readonly handshake: Socket['handshake'];
  constructor(readonly id: string, address: string) { this.handshake = { address, auth: {} } as Socket['handshake']; }
  on(event: string, listener: (...args: never[]) => void) { this.listeners.set(event, listener); return this; }
  emit(event: string, ...args: unknown[]) { this.sent.set(event, [...(this.sent.get(event) ?? []), args[0]]); return this; }
  trigger(event: string, ...args: unknown[]) { this.listeners.get(event)?.(...args as never[]); }
  outbound(event: string) { return this.sent.get(event) ?? []; }
  disconnect() {}
}
