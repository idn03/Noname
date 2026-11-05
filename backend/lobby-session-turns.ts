import { applyGameCommand } from '../web-game/game/game-engine';
import type { GameCommand, GameState } from '../web-game/game/game-types';
import type { RandomSource } from '../web-game/game/randomness';
import { prepareBalancedTeams } from '../web-game/game/team-assignment';
import type { LobbyErrorCode } from '../shared/lobby-contract';

type TurnCommand = Extract<GameCommand, { type: 'attack' | 'defend' | 'record-challenge-outcome' }>;
export type TurnUpdate = { state: GameState } | { error: LobbyErrorCode };

export function applyLobbyTurnCommand(state: GameState | undefined, command: TurnCommand, random: RandomSource): TurnUpdate {
  if (!state) return { error: 'SESSION_NOT_ACTIVE' };
  const result = applyGameCommand(state, command, { random, prepareTeams: prepareBalancedTeams });
  if (result.ok) return { state: result.value };
  return { error: result.error.code === 'NOT_AUTHORIZED' ? 'NOT_AUTHORIZED' : 'INVALID_TURN' };
}

export function advanceSandboxTurn(state: GameState, random: RandomSource): GameState {
  let current = state;
  while (current.phase === 'turns' && !current.activeTurn) {
    const wolf = current.players.find((player) => player.team === 'wolf' && player.hasCardSlot
      && player.cardSubmitted && !player.cardUsed);
    if (!wolf) break;
    const attack = applyLobbyTurnCommand(current, { type: 'attack', actorId: wolf.id, round: current.round }, random);
    if ('error' in attack) break;
    current = attack.state;
    if (!current.activeTurn) continue;
    const sheep = current.players.find((player) => player.team === 'sheep' && player.hasCardSlot
      && player.cardSubmitted && !player.cardUsed && player.cardCategory === current.activeTurn?.attackCategoryId);
    if (!sheep) break;
    const defense = applyLobbyTurnCommand(current, { type: 'defend', actorId: sheep.id, round: current.round }, random);
    if ('error' in defense) break;
    current = defense.state;
  }
  return current;
}
