import type { Server, Socket } from 'socket.io';
import { describe, expect, it } from 'vitest';
import { attachLobbyTransport } from '../backend/lobby-transport';
import { LobbySession } from '../backend/lobby-session';
import { LOBBY_EVENTS, type LobbyView } from '../shared/lobby-contract';

describe('lobby transport', () => {
  it('sends the current snapshot and safely reports invalid handshake credentials', () => {
    const lobby = LobbySession.createForHost();
    lobby.connectHost();
    const { socket } = connect(lobby, { credential: 'invalid-token' });

    expect(socket.outbound(LOBBY_EVENTS.state)).toHaveLength(1);
    expect((socket.outbound(LOBBY_EVENTS.state)[0] as LobbyView).players).toHaveLength(1);
    expect(socket.outbound(LOBBY_EVENTS.error)[0]).toMatchObject({ code: 'INVALID_CREDENTIAL' });
  });

  it('rejects a second join on the same connection without adding an identity', () => {
    const lobby = LobbySession.createForHost();
    lobby.connectHost();
    const { socket } = connect(lobby);
    const first: { ok: boolean }[] = [];
    const second: { ok: boolean; error?: { code: string } }[] = [];

    socket.trigger(LOBBY_EVENTS.join, { name: 'Guest' }, (result: { ok: boolean }) => first.push(result));
    socket.trigger(LOBBY_EVENTS.join, { name: 'Again' }, (result: { ok: boolean; error?: { code: string } }) => second.push(result));

    expect(first[0].ok).toBe(true);
    expect(second[0]).toMatchObject({ ok: false, error: { code: 'INVALID_REQUEST' } });
    expect(lobby.view().players).toHaveLength(2);
  });
});

function connect(session: LobbySession, auth: { credential?: string } = {}) {
  const io = new FakeIo();
  attachLobbyTransport(io as unknown as Server, () => session, () => undefined);
  const socket = new FakeSocket(auth);
  io.connect(socket);
  return { io, socket };
}

class FakeIo {
  private connection?: (socket: Socket) => void;
  on(_event: string, listener: (socket: Socket) => void) { this.connection = listener; }
  emit() { return this; }
  connect(socket: FakeSocket) { this.connection?.(socket as unknown as Socket); }
}

class FakeSocket {
  readonly id = 'socket-1';
  readonly handshake: Socket['handshake'];
  private readonly listeners = new Map<string, (...args: never[]) => void>();
  private readonly sent = new Map<string, unknown[]>();

  constructor(auth: { credential?: string }) {
    this.handshake = { address: '127.0.0.1', auth } as Socket['handshake'];
  }
  on(event: string, listener: (...args: never[]) => void) { this.listeners.set(event, listener); return this; }
  emit(event: string, ...args: unknown[]) {
    this.sent.set(event, [...(this.sent.get(event) ?? []), args[0]]);
    return this;
  }
  trigger(event: string, ...args: unknown[]) { this.listeners.get(event)?.(...args as never[]); }
  outbound(event: string) { return this.sent.get(event) ?? []; }
}
