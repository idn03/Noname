import { createHash, randomBytes, randomUUID } from 'node:crypto';
import type { LobbyErrorCode, LobbyPlayerView, LobbySessionView, LobbyView } from '../shared/lobby-contract';
import { parsePlayerName } from '../shared/lobby-contract';

interface PlayerRecord extends LobbyPlayerView { credentialHash: string }

export class LobbySession {
  private readonly players = new Map<string, PlayerRecord>();
  private phase: LobbyView['phase'] = 'lobby';

  private constructor(hostName: string) {
    const name = parsePlayerName(hostName);
    if (!name) throw new Error('Host display name is invalid');
    const id = randomUUID();
    this.players.set(id, { id, name, isHost: true, connected: false, credentialHash: '' });
  }

  static createForHost(hostName: string): LobbySession {
    return new LobbySession(hostName);
  }

  join(value: unknown): LobbySessionView | LobbyErrorCode {
    const name = parsePlayerName(value);
    if (!name) return 'INVALID_NAME';
    if (this.phase !== 'lobby') return 'LOBBY_CLOSED';
    if (this.players.size >= 10) return 'LOBBY_FULL';
    const id = randomUUID();
    const credential = randomBytes(32).toString('base64url');
    this.players.set(id, {
      id, name, isHost: false, connected: true,
      credentialHash: this.hash(credential),
    });
    return { playerId: id, credential, lobby: this.view() };
  }

  connectHost(): LobbySessionView {
    const host = [...this.players.values()].find((player) => player.isHost);
    if (!host) throw new Error('Host identity is missing');
    host.connected = true;
    return { playerId: host.id, lobby: this.view() };
  }

  resume(value: unknown): LobbySessionView | undefined {
    if (typeof value !== 'string' || value.length > 128) return undefined;
    const hash = this.hash(value);
    const player = [...this.players.values()].find((candidate) =>
      candidate.credentialHash !== '' && candidate.credentialHash === hash,
    );
    if (!player) return undefined;
    player.connected = true;
    return { playerId: player.id, lobby: this.view() };
  }

  disconnect(playerId: string): LobbyView {
    const player = this.players.get(playerId);
    if (player) player.connected = false;
    return this.view();
  }

  closeAdmission(): LobbyView {
    this.phase = 'started';
    return this.view();
  }

  view(): LobbyView {
    return {
      phase: this.phase,
      players: [...this.players.values()].map(({ id, name, isHost, connected }) => ({ id, name, isHost, connected })),
    };
  }

  private hash(credential: string): string {
    return createHash('sha256').update(credential).digest('hex');
  }
}
