import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { parsePlayerName, type LobbyErrorCode } from '../shared/lobby-contract';
import type { LobbyPlayerRecord } from './lobby-sandbox-players';

export class LobbySessionPlayers {
  private readonly records = new Map<string, LobbyPlayerRecord>();

  constructor(simulatedPlayers: readonly LobbyPlayerRecord[]) {
    const id = randomUUID();
    this.records.set(id, { id, name: 'Chủ phòng', isHost: true, connected: false, credentialHash: '' });
    simulatedPlayers.forEach((player) => this.records.set(player.id, player));
  }

  join(value: unknown, sandbox: boolean, canJoin: boolean): PlayerCredential | LobbyErrorCode {
    if (sandbox) return 'SANDBOX_ROOM';
    const name = parsePlayerName(value);
    if (!name) return 'INVALID_NAME';
    if (!canJoin) return 'LOBBY_CLOSED';
    if (this.joiningPlayers().length >= 10) return 'LOBBY_FULL';
    const id = randomUUID();
    const credential = this.newCredential();
    this.records.set(id, { id, name, isHost: false, connected: true, credentialHash: this.hash(credential) });
    return { playerId: id, credential };
  }

  connectHost(): PlayerCredential {
    const host = [...this.records.values()].find((player) => player.isHost);
    if (!host) throw new Error('Host identity is missing');
    const credential = this.newCredential();
    host.connected = true;
    host.credentialHash = this.hash(credential);
    return { playerId: host.id, credential };
  }

  resume(value: unknown): PlayerCredential | undefined {
    if (typeof value !== 'string' || value.length > 128) return undefined;
    const hash = this.hash(value);
    const player = [...this.records.values()].find((candidate) => candidate.credentialHash && candidate.credentialHash === hash);
    if (!player) return undefined;
    player.connected = true;
    const credential = this.newCredential();
    player.credentialHash = this.hash(credential);
    return { playerId: player.id, credential };
  }

  disconnect(playerId: string): void { const player = this.records.get(playerId); if (player) player.connected = false; }
  all(): LobbyPlayerRecord[] { return [...this.records.values()]; }
  joiningPlayers(): LobbyPlayerRecord[] { return this.all().filter((player) => !player.isHost); }
  connectedHost(playerId: string): boolean { const player = this.records.get(playerId); return Boolean(player?.isHost && player.connected); }
  clearCredentials(): void { for (const player of this.records.values()) player.credentialHash = ''; }

  private newCredential(): string { return randomBytes(32).toString('base64url'); }
  private hash(credential: string): string { return createHash('sha256').update(credential).digest('hex'); }
}

interface PlayerCredential { playerId: string; credential: string }
