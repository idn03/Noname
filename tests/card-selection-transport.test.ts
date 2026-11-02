import type { Server, Socket } from 'socket.io';
import { describe, expect, it } from 'vitest';
import { attachLobbyTransport } from '../backend/lobby-transport';
import type { LobbySession } from '../backend/lobby-session';
import { LOBBY_EVENTS, type LobbyCommandReply, type LobbyView } from '../shared/lobby-contract';

describe('card selection transport', () => {
  it('accepts private team-appropriate selections and broadcasts role-filtered state', () => {
    const harness = createHarness();
    const host = new FakeSocket('host', '127.0.0.1');
    harness.io.connect(host);
    host.trigger(LOBBY_EVENTS.hostCreate, {}, () => undefined);
    const guests = Array.from({ length: 6 }, (_, index) => {
      const socket = new FakeSocket(`player-${index}`, '192.168.1.10');
      harness.io.connect(socket);
      const reply: LobbyCommandReply[] = [];
      socket.trigger(LOBBY_EVENTS.join, { name: `P${index}` }, (value: LobbyCommandReply) => reply.push(value));
      return { socket, id: reply[0]?.playerId ?? '', credential: socket.outbound(LOBBY_EVENTS.credential).at(-1) as string };
    });
    host.trigger(LOBBY_EVENTS.hostStart, { confirmLowPopulation: true }, () => undefined);
    const state = harness.getSession()?.currentGameState();
    if (!state) throw new Error('Expected started game state');
    const wolf = guests.find(({ id }) => state.players.some((player) => player.id === id && player.team === 'wolf' && player.hasCardSlot));
    const sheep = guests.find(({ id }) => state.players.some((player) => player.id === id && player.team === 'sheep' && player.hasCardSlot));
    if (!wolf || !sheep) throw new Error('Expected card slots for both teams');

    const wolfView = wolf.socket.outbound(LOBBY_EVENTS.state).at(-1) as LobbyView;
    const wolfSelection = wolfView.game?.phase === 'selection' && wolfView.game.role === 'player' ? wolfView.game.selection : undefined;
    const wolfCategory = wolfSelection?.categories[0];
    const challenge = wolfCategory?.challenges?.[0];
    if (!wolfCategory || !challenge) throw new Error('Expected Wolf challenge choices');
    const wolfReply: LobbyCommandReply[] = [];
    wolf.socket.trigger(LOBBY_EVENTS.selectCard, { categoryId: wolfCategory.id, challengeId: challenge.id }, (value: LobbyCommandReply) => wolfReply.push(value));
    expect(wolfReply[0]).toMatchObject({ ok: true });
    const resumedWolf = new FakeSocket('resumed-wolf', '192.168.1.10');
    resumedWolf.handshake.auth = { credential: wolf.credential };
    harness.io.connect(resumedWolf);
    expect(resumedWolf.outbound(LOBBY_EVENTS.state).at(-1)).toMatchObject({
      game: { phase: 'selection', role: 'player', selection: { ownCard: { categoryId: wolfCategory.id, challengeId: challenge.id, submitted: true } } },
    });
    const sheepView = sheep.socket.outbound(LOBBY_EVENTS.state).at(-1) as LobbyView;
    expect(sheepView.game?.phase === 'selection' && sheepView.game.role === 'player'
      ? sheepView.game.selection.categories.every((category) => category.challenges === undefined) : false).toBe(true);
    expect(host.outbound(LOBBY_EVENTS.state).at(-1)).not.toMatchObject({ game: { selection: { teams: { wolf: { players: [{ cardCategory: expect.anything() }] } } } } });

    const sheepSelection = sheepView.game?.phase === 'selection' && sheepView.game.role === 'player' ? sheepView.game.selection : undefined;
    const sheepCategory = sheepSelection?.categories[0];
    if (!sheepCategory) throw new Error('Expected Sheep categories');
    const invalidReply: LobbyCommandReply[] = [];
    sheep.socket.trigger(LOBBY_EVENTS.selectCard, { categoryId: sheepCategory.id, challengeId: 'unexpected' }, (value: LobbyCommandReply) => invalidReply.push(value));
    expect(invalidReply[0]).toMatchObject({ ok: false, error: { code: 'INVALID_SELECTION' } });
    expect(sheep.socket.outbound(LOBBY_EVENTS.state).at(-1)).toMatchObject({ game: { phase: 'selection' } });

    for (const { socket, id } of guests) {
      const player = state.players.find((candidate) => candidate.id === id);
      if (!player?.hasCardSlot || player.id === wolf.id) continue;
      const view = socket.outbound(LOBBY_EVENTS.state).at(-1) as LobbyView;
      const selection = view.game?.phase === 'selection' && view.game.role === 'player' ? view.game.selection : undefined;
      const category = selection?.categories[0];
      if (!category) throw new Error('Expected category while selection remains open');
      const selectedChallenge = player.team === 'wolf' ? category.challenges?.[0]?.id : undefined;
      const reply: LobbyCommandReply[] = [];
      socket.trigger(LOBBY_EVENTS.selectCard, {
        categoryId: category.id, ...(selectedChallenge ? { challengeId: selectedChallenge } : {}),
      }, (value: LobbyCommandReply) => reply.push(value));
      expect(reply[0]).toMatchObject({ ok: true });
    }
    const revealed = sheep.socket.outbound(LOBBY_EVENTS.state).at(-1) as LobbyView;
    expect(revealed.game?.phase).toBe('turns');
    expect(revealed.game?.phase === 'turns' && revealed.game.revealedCards.some((card) => card.team === 'wolf' && Boolean(card.challenge?.text))).toBe(true);
  });
});

function createHarness() {
  const io = new FakeIo();
  let session: LobbySession | undefined;
  attachLobbyTransport(io as unknown as Server, () => session, (value) => { session = value; });
  return { io, getSession: () => session };
}

class FakeIo {
  private connection?: (socket: Socket) => void;
  private readonly sockets: FakeSocket[] = [];
  on(_event: string, listener: (socket: Socket) => void) { this.connection = listener; }
  emit(event: string, payload: unknown) { for (const socket of this.sockets) socket.emit(event, payload); return this; }
  connect(socket: FakeSocket) { this.sockets.push(socket); this.connection?.(socket as unknown as Socket); }
}

class FakeSocket {
  handshake: Socket['handshake'];
  private readonly listeners = new Map<string, (...args: never[]) => void>();
  private readonly sent = new Map<string, unknown[]>();
  constructor(readonly id: string, address: string) { this.handshake = { address, auth: {} } as Socket['handshake']; }
  on(event: string, listener: (...args: never[]) => void) { this.listeners.set(event, listener); return this; }
  emit(event: string, ...args: unknown[]) { this.sent.set(event, [...(this.sent.get(event) ?? []), args[0]]); return this; }
  trigger(event: string, ...args: unknown[]) { this.listeners.get(event)?.(...args as never[]); }
  outbound(event: string) { return this.sent.get(event) ?? []; }
  disconnect() {}
}
