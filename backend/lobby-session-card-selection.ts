import { applyGameCommand } from '../web-game/game/game-engine';
import type { GameErrorCode } from '../web-game/game/game-error';
import type { GameState } from '../web-game/game/game-types';
import { prepareBalancedTeams } from '../web-game/game/team-assignment';
import type { RandomSource } from '../web-game/game/randomness';
import type { LobbyErrorCode } from '../shared/lobby-contract';

type CardCommand =
  | { type: 'select-card'; actorId: string; categoryId: string; challengeId?: string }
  | { type: 'remove-card'; actorId: string };

export type CardSelectionUpdate = { state: GameState } | { error: LobbyErrorCode };

export function applyLobbyCardSelection(
  state: GameState | undefined,
  command: CardCommand,
  random: RandomSource,
): CardSelectionUpdate {
  if (!state) return { error: 'SESSION_NOT_ACTIVE' };
  const result = applyGameCommand(state, command, { random, prepareTeams: prepareBalancedTeams });
  if (result.ok) return { state: result.value };
  return { error: selectionErrorCode(result.error.code) };
}

function selectionErrorCode(code: GameErrorCode): LobbyErrorCode {
  if (code === 'NOT_AUTHORIZED') return 'NOT_AUTHORIZED';
  if (code === 'INVALID_PHASE') return 'SELECTION_CLOSED';
  if (code === 'NOT_FOUND') return 'CARD_NOT_FOUND';
  return code === 'INVALID_COMMAND' ? 'SESSION_NOT_ACTIVE' : 'INVALID_SELECTION';
}
