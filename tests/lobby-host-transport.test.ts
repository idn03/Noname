import type { Server, Socket } from 'socket.io';
import { describe, expect, it } from 'vitest';
import { attachLobbyTransport } from '../backend/lobby-transport';
import type { LobbySession } from '../backend/lobby-session';
import { LOBBY_EVENTS, type LobbyCommandReply } from '../shared/lobby-contract';

describe('Host lobby transport', () => {
  it('creates a name-free room only from loopback and assigns the Host identity', () => {
    const harness = createHarness();
    const host = new FakeSocket('host', '127.0.0.1');
    harness.io.connect(host);
    const replies: LobbyCommandReply[] = [];
    host.trigger(LOBBY_EVENTS.hostCreate, {}, (reply: LobbyCommandReply) => replies.push(reply));

    expect(replies).toMatchObject([{ ok: true }]);
    expect(harness.getSession()?.view().players[0]).toMatchObject({ isHost: true, name: 'Chủ phòng', connected: true });
    expect(host.outbound(LOBBY_EVENTS.credential)).toHaveLength(1);
  });

  it('rejects remote creation, unauthorized start, and unconfirmed low-population start', () => {
    const harness = createHarness();
    const remote = new FakeSocket('remote', '192.168.1.12');
    harness.io.connect(remote);
    const remoteReplies: LobbyCommandReply[] = [];
    remote.trigger(LOBBY_EVENTS.hostCreate, {}, (reply: LobbyCommandReply) => remoteReplies.push(reply));
    expect(remoteReplies[0]).toMatchObject({ ok: false, error: { code: 'HOST_CREATION_LOCAL_ONLY' } });

    const host = new FakeSocket('host', '127.0.0.1');
    harness.io.connect(host);
    host.trigger(LOBBY_EVENTS.hostCreate, {}, () => undefined);
    const guests = Array.from({ length: 6 }, (_, index) => {
      const guest = new FakeSocket(`guest-${index}`, '192.168.1.12');
      harness.io.connect(guest);
      guest.trigger(LOBBY_EVENTS.join, { name: `P${index}` }, () => undefined);
      return guest;
    });
    const unauthorized: LobbyCommandReply[] = [];
    guests[0].trigger(LOBBY_EVENTS.hostStart, { confirmLowPopulation: true }, (reply: LobbyCommandReply) => unauthorized.push(reply));
    expect(unauthorized[0]).toMatchObject({ ok: false, error: { code: 'NOT_AUTHORIZED' } });
    const deniedCancel: LobbyCommandReply[] = [];
    guests[0].trigger(LOBBY_EVENTS.hostCancel, {}, (reply: LobbyCommandReply) => deniedCancel.push(reply));
    expect(deniedCancel[0]).toMatchObject({ ok: false, error: { code: 'NOT_AUTHORIZED' } });
    const needsConfirmation: LobbyCommandReply[] = [];
    host.trigger(LOBBY_EVENTS.hostStart, {}, (reply: LobbyCommandReply) => needsConfirmation.push(reply));
    expect(needsConfirmation[0]).toMatchObject({ ok: false, error: { code: 'START_REQUIRES_CONFIRMATION' } });
    expect(harness.getSession()?.view().phase).toBe('lobby');
    const accepted: LobbyCommandReply[] = [];
    host.trigger(LOBBY_EVENTS.hostStart, { confirmLowPopulation: true }, (reply: LobbyCommandReply) => accepted.push(reply));
    expect(accepted[0]).toMatchObject({ ok: true });
    expect(harness.getSession()?.view().phase).toBe('started');
  });

  it('broadcasts cancellation, clears the active session, and permits room recreation', () => {
    const harness = createHarness();
    const host = new FakeSocket('host', '127.0.0.1');
    harness.io.connect(host);
    host.trigger(LOBBY_EVENTS.hostCreate, {}, () => undefined);
    const replies: LobbyCommandReply[] = [];
    host.trigger(LOBBY_EVENTS.hostCancel, {}, (reply: LobbyCommandReply) => replies.push(reply));

    expect(replies[0]).toMatchObject({ ok: true });
    expect(harness.getSession()).toBeUndefined();
    expect(host.outbound(LOBBY_EVENTS.ended)).toEqual(['cancelled']);
    const recreated: LobbyCommandReply[] = [];
    host.trigger(LOBBY_EVENTS.hostCreate, {}, (reply: LobbyCommandReply) => recreated.push(reply));
    expect(recreated[0]).toMatchObject({ ok: true });
    host.trigger(LOBBY_EVENTS.hostDeleteRoom, {}, () => undefined);
    expect(harness.getSession()).toBeUndefined();
    expect(host.outbound(LOBBY_EVENTS.ended)).toEqual(['cancelled', 'deleted']);
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
  readonly handshake: Socket['handshake'];
  private readonly listeners = new Map<string, (...args: never[]) => void>();
  private readonly sent = new Map<string, unknown[]>();
  constructor(readonly id: string, address: string) {
    this.handshake = { address, auth: {} } as Socket['handshake'];
  }
  on(event: string, listener: (...args: never[]) => void) { this.listeners.set(event, listener); return this; }
  emit(event: string, ...args: unknown[]) { this.sent.set(event, [...(this.sent.get(event) ?? []), args[0]]); return this; }
  trigger(event: string, ...args: unknown[]) { this.listeners.get(event)?.(...args as never[]); }
  outbound(event: string) { return this.sent.get(event) ?? []; }
  disconnect() {}
}
