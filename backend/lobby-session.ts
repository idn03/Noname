import { createHash, randomBytes, randomUUID } from 'node:crypto';
import type { GameState } from '../web-game/game/game-types';
import { systemRandom } from '../web-game/game/randomness';
import type { RandomSource } from '../web-game/game/randomness';
import { bundledContent } from './db/bundled-content';
import type { CategoryContent } from './db/content-validation';
import { prepareGameSetup } from './game-setup';
import type { SessionCategoryPool } from './db/session-pool';
import type { LobbyErrorCode, LobbyPlayerView, LobbySessionView, LobbyView } from '../shared/lobby-contract';
import { parsePlayerName } from '../shared/lobby-contract';
import { createLobbyView } from './lobby-view';

interface PlayerRecord extends LobbyPlayerView { credentialHash: string }

export class LobbySession {
  private readonly players = new Map<string, PlayerRecord>();
  private phase: LobbyView['phase'] = 'lobby';
  private gameState?: GameState;
  private sessionPools: readonly SessionCategoryPool[] = [];
  private ended = false;

  private constructor(
    private readonly categories: readonly CategoryContent[],
    private readonly random: RandomSource,
  ) {
    const id = randomUUID();
    this.players.set(id, { id, name: 'Chủ phòng', isHost: true, connected: false, credentialHash: '' });
  }

  static createForHost(categories: readonly CategoryContent[] = bundledContent, random: RandomSource = systemRandom): LobbySession {
    return new LobbySession(categories, random);
  }

  join(value: unknown): LobbySessionView | LobbyErrorCode {
    const name = parsePlayerName(value);
    if (!name) return 'INVALID_NAME';
    if (this.phase !== 'lobby' || this.ended) return 'LOBBY_CLOSED';
    if (this.joiningPlayers().length >= 10) return 'LOBBY_FULL';
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
    const credential = randomBytes(32).toString('base64url');
    host.connected = true;
    host.credentialHash = this.hash(credential);
    return { playerId: host.id, credential, lobby: this.view() };
  }

  resume(value: unknown): LobbySessionView | undefined {
    if (typeof value !== 'string' || value.length > 128) return undefined;
    const hash = this.hash(value);
    const player = [...this.players.values()].find((candidate) =>
      candidate.credentialHash !== '' && candidate.credentialHash === hash,
    );
    if (!player) return undefined;
    player.connected = true;
    const credential = randomBytes(32).toString('base64url');
    player.credentialHash = this.hash(credential);
    return { playerId: player.id, credential, lobby: this.view() };
  }

  disconnect(playerId: string): LobbyView {
    const player = this.players.get(playerId);
    if (player) player.connected = false;
    return this.view();
  }

  start(actorId: string, confirmLowPopulation = false): { lobby: LobbyView; gameState: GameState } | LobbyErrorCode {
    if (!this.isConnectedHost(actorId)) return 'NOT_AUTHORIZED';
    if (this.phase !== 'lobby' || this.ended) return 'SESSION_NOT_ACTIVE';
    const players = this.joiningPlayers().filter((player) => player.connected);
    if (players.length < 6 || players.length > 10) return 'NOT_ENOUGH_PLAYERS';
    if (players.length < 10 && !confirmLowPopulation) return 'START_REQUIRES_CONFIRMATION';
    const connectedPlayers = [...this.players.values()].filter((player) => player.connected);
    const setup = prepareGameSetup(connectedPlayers, actorId, this.categories, this.random);
    if (!setup) return 'INVALID_REQUEST';
    this.gameState = setup.gameState;
    this.sessionPools = setup.pools;
    this.phase = 'started';
    return { lobby: this.view(), gameState: structuredClone(this.gameState) };
  }

  currentGameState(): GameState | undefined { return this.gameState && structuredClone(this.gameState); }

  currentSessionPools(): readonly SessionCategoryPool[] { return structuredClone(this.sessionPools); }

  end(actorId: string): LobbyErrorCode | undefined {
    if (!this.isConnectedHost(actorId)) return 'NOT_AUTHORIZED';
    if (this.ended) return 'SESSION_NOT_ACTIVE';
    this.ended = true;
    this.gameState = undefined;
    this.sessionPools = [];
    for (const player of this.players.values()) player.credentialHash = '';
    return undefined;
  }

  view(viewerId?: string): LobbyView {
    return createLobbyView(this.phase, [...this.players.values()], this.gameState, viewerId);
  }

  private joiningPlayers(): PlayerRecord[] {
    return [...this.players.values()].filter((player) => !player.isHost);
  }

  private isConnectedHost(playerId: string): boolean {
    const player = this.players.get(playerId);
    return Boolean(player?.isHost && player.connected);
  }

  private hash(credential: string): string { return createHash('sha256').update(credential).digest('hex'); }
}
