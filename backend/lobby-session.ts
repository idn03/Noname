import type { GameState } from '../web-game/game/game-types';
import { systemRandom, type RandomSource } from '../web-game/game/randomness';
import { bundledContent } from './db/bundled-content';
import type { CategoryContent } from './db/content-validation';
import { prepareGameSetup } from './game-setup';
import type { SessionCategoryPool } from './db/session-pool';
import type { LobbyErrorCode, LobbySessionView, LobbyView } from '../shared/lobby-contract';
import { createLobbyView } from './lobby-view';
import { createSandboxPlayers, type LobbyPlayerRecord } from './lobby-sandbox-players';
import { applyLobbyCardSelection } from './lobby-session-card-selection';
import { LobbySessionPlayers } from './lobby-session-players';
import { advanceSandboxTurn, applyLobbyTurnCommand } from './lobby-session-turns';

export const TEAM_ASSIGNMENT_DURATION_MS = 10_000;

export class LobbySession {
  private readonly players: LobbySessionPlayers;
  private phase: LobbyView['phase'] = 'lobby';
  private gameState?: GameState;
  private sessionPools: readonly SessionCategoryPool[] = [];
  private assignmentDeadlineMs?: number;
  private ended = false;

  private constructor(
    private readonly categories: readonly CategoryContent[],
    private readonly random: RandomSource,
    readonly isSandboxRoom = false,
    simulatedPlayers: readonly LobbyPlayerRecord[] = [],
  ) {
    this.players = new LobbySessionPlayers(simulatedPlayers);
  }

  static createForHost(categories: readonly CategoryContent[] = bundledContent, random: RandomSource = systemRandom): LobbySession {
    return new LobbySession(categories, random);
  }

  static createSandboxForHost(categories: readonly CategoryContent[] = bundledContent, random: RandomSource = systemRandom): LobbySession {
    return new LobbySession(categories, random, true, createSandboxPlayers(6 + random.nextInt(5)));
  }

  join(value: unknown): LobbySessionView | LobbyErrorCode {
    const result = this.players.join(value, this.isSandboxRoom, this.phase === 'lobby' && !this.ended);
    return typeof result === 'string' ? result : { ...result, lobby: this.view() };
  }

  connectHost(): LobbySessionView {
    return { ...this.players.connectHost(), lobby: this.view() };
  }

  resume(value: unknown): LobbySessionView | undefined {
    if (typeof value !== 'string' || value.length > 128) return undefined;
    const identity = this.players.resume(value);
    return identity ? { ...identity, lobby: this.view() } : undefined;
  }

  disconnect(playerId: string): LobbyView { this.players.disconnect(playerId); return this.view(); }

  start(actorId: string, confirmLowPopulation = false, now = Date.now()): { lobby: LobbyView; gameState: GameState } | LobbyErrorCode {
    if (!this.isConnectedHost(actorId)) return 'NOT_AUTHORIZED';
    if (this.phase !== 'lobby' || this.ended) return 'SESSION_NOT_ACTIVE';
    const players = this.players.joiningPlayers().filter((player) => player.connected);
    if (players.length < 6 || players.length > 10) return 'NOT_ENOUGH_PLAYERS';
    if (players.length < 10 && !confirmLowPopulation) return 'START_REQUIRES_CONFIRMATION';
    const connectedPlayers = this.players.all().filter((player) => player.connected);
    const setup = prepareGameSetup(connectedPlayers, actorId, this.categories, this.random, this.isSandboxRoom,
      () => now + TEAM_ASSIGNMENT_DURATION_MS);
    if (!setup) return 'INVALID_REQUEST';
    this.gameState = this.isSandboxRoom ? advanceSandboxTurn(setup.gameState, this.random) : setup.gameState;
    this.sessionPools = setup.pools;
    this.phase = 'started';
    this.assignmentDeadlineMs = now + TEAM_ASSIGNMENT_DURATION_MS;
    return { lobby: this.view(actorId, now), gameState: structuredClone(this.gameState) };
  }

  completeTeamAssignment(now = Date.now()): boolean {
    if (!this.assignmentDeadlineMs || now < this.assignmentDeadlineMs || this.ended) return false;
    this.assignmentDeadlineMs = undefined;
    if (this.gameState?.selectionDeadlineMs !== undefined) {
      this.gameState = {
        ...this.gameState,
        selectionStartedAtMs: now,
        selectionDeadlineMs: now + this.gameState.rounds * 60_000,
      };
    }
    return true;
  }

  selectCard(actorId: string, categoryId: string, challengeId?: string): LobbyErrorCode | undefined {
    return this.applySelectionCommand({ type: 'select-card', actorId, categoryId, challengeId });
  }

  removeCard(actorId: string): LobbyErrorCode | undefined {
    return this.applySelectionCommand({ type: 'remove-card', actorId });
  }

  attack(actorId: string, round: number): LobbyErrorCode | undefined { return this.applyTurn({ type: 'attack', actorId, round }); }
  defend(actorId: string, round: number): LobbyErrorCode | undefined { return this.applyTurn({ type: 'defend', actorId, round }); }
  recordChallengeOutcome(actorId: string, round: number, succeeded: boolean): LobbyErrorCode | undefined {
    return this.applyTurn({ type: 'record-challenge-outcome', actorId, round, succeeded });
  }

  currentGameState(): GameState | undefined { return this.gameState && structuredClone(this.gameState); }

  currentSessionPools(): readonly SessionCategoryPool[] { return structuredClone(this.sessionPools); }

  end(actorId: string): LobbyErrorCode | undefined {
    if (!this.isConnectedHost(actorId)) return 'NOT_AUTHORIZED';
    if (this.ended) return 'SESSION_NOT_ACTIVE';
    this.ended = true;
    this.gameState = undefined;
    this.sessionPools = [];
    this.assignmentDeadlineMs = undefined;
    this.players.clearCredentials();
    return undefined;
  }

  view(viewerId?: string, now = Date.now()): LobbyView {
    return createLobbyView(this.phase, this.players.all(), this.gameState, viewerId, this.sessionPools, now, this.assignmentDeadlineMs);
  }

  private applySelectionCommand(command: { type: 'select-card'; actorId: string; categoryId: string; challengeId?: string } | { type: 'remove-card'; actorId: string }): LobbyErrorCode | undefined {
    if (this.players.connectedHost(command.actorId)) return 'NOT_AUTHORIZED';
    const player = this.gameState?.players.find(({ id }) => id === command.actorId);
    if (!player || player.isHost || player.hasCardSlot !== true) return 'NOT_AUTHORIZED';
    if (this.isTeamAssignmentActive()) return 'SELECTION_CLOSED';
    const result = applyLobbyCardSelection(this.gameState, command, this.random);
    if ('error' in result) return result.error;
    this.gameState = result.state;
  }

  private applyTurn(command: { type: 'attack' | 'defend'; actorId: string; round: number } | { type: 'record-challenge-outcome'; actorId: string; round: number; succeeded: boolean }): LobbyErrorCode | undefined {
    const isHost = this.players.connectedHost(command.actorId);
    if (command.type === 'record-challenge-outcome' ? !isHost : isHost) return 'NOT_AUTHORIZED';
    const player = this.gameState?.players.find(({ id }) => id === command.actorId);
    if (command.type !== 'record-challenge-outcome' && !player) return 'NOT_AUTHORIZED';
    if (this.isTeamAssignmentActive()) return 'INVALID_TURN';
    const result = applyLobbyTurnCommand(this.gameState, command, this.random);
    if ('error' in result) return result.error;
    this.gameState = this.isSandboxRoom && command.type === 'record-challenge-outcome'
      ? advanceSandboxTurn(result.state, this.random)
      : result.state;
  }

  private isConnectedHost(playerId: string): boolean { return this.players.connectedHost(playerId); }
  private isTeamAssignmentActive(now = Date.now()): boolean {
    return this.assignmentDeadlineMs !== undefined && now < this.assignmentDeadlineMs;
  }
}
