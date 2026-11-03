import { gameError, type GameResult } from "./game-error";
import { applyCardSelectionCommand } from "./game-card-selection";
import type { GameCommand, GamePlayer, GameState } from "./game-types";
import type { RandomSource } from "./randomness";

export interface PreparedGame {
  players: readonly GamePlayer[];
  rounds: number;
}

export type TeamPreparation = (
  players: readonly GamePlayer[],
  random: RandomSource,
) => GameResult<PreparedGame>;

export function startGame(
  state: GameState,
  actorId: string,
  prepareTeams: TeamPreparation,
  random: RandomSource,
  now: () => number = Date.now,
): GameResult<GameState> {
  if (state.phase !== "lobby") return gameError("INVALID_PHASE", "The game can only start from the lobby.");
  if (!state.players.some((player) => player.id === actorId && player.isHost)) {
    return gameError("NOT_AUTHORIZED", "Only the Host can start the game.");
  }
  if (new Set(state.players.map((player) => player.id)).size !== state.players.length) {
    return gameError("INVALID_INPUT", "Player identifiers must be unique.");
  }
  const prepared = prepareTeams(state.players.map((player) => ({ ...player })), random);
  if (prepared.ok === false) return gameError(prepared.error.code, prepared.error.message);
  if (!isValidPreparation(state.players, prepared.value)) {
    return gameError("INVALID_ASSIGNMENT", "Game preparation returned an invalid player assignment.");
  }
  const startedAt = now();
  const preparedById = new Map(prepared.value.players.map((player) => [player.id, player]));
  return {
    ok: true,
    value: {
      ...state,
      phase: "selection",
      players: state.players.map((player) => ({
        ...player,
        team: preparedById.get(player.id)?.team,
        hasCardSlot: preparedById.get(player.id)?.hasCardSlot,
      })),
      rounds: prepared.value.rounds,
      selectionStartedAtMs: startedAt,
      selectionDeadlineMs: startedAt + prepared.value.rounds * 60_000,
    },
  };
}

function isValidPreparation(players: readonly GamePlayer[], prepared: PreparedGame): boolean {
  if (!Number.isInteger(prepared.rounds) || prepared.rounds < 1 || prepared.players.length !== players.length) return false;
  const originalIds = new Set(players.map((player) => player.id));
  const assignedIds = new Set(prepared.players.map((player) => player.id));
  if (assignedIds.size !== players.length || ![...originalIds].every((id) => assignedIds.has(id))) return false;
  const preparedById = new Map(prepared.players.map((player) => [player.id, player]));
  if (players.some((player) => {
    const assigned = preparedById.get(player.id);
    return !assigned || assigned.name !== player.name || assigned.isHost !== player.isHost
      || (player.isHost
        ? assigned.team !== undefined || assigned.hasCardSlot !== undefined
        : (assigned.team !== "wolf" && assigned.team !== "sheep") || typeof assigned.hasCardSlot !== "boolean");
  })) return false;
  const wolfCount = prepared.players.filter((player) => !player.isHost && player.team === "wolf").length;
  const sheepCount = prepared.players.filter((player) => !player.isHost && player.team === "sheep").length;
  const wolfSlots = prepared.players.filter((player) => !player.isHost && player.team === "wolf" && player.hasCardSlot).length;
  const sheepSlots = prepared.players.filter((player) => !player.isHost && player.team === "sheep" && player.hasCardSlot).length;
  const expectedSlots = Math.min(wolfCount, sheepCount);
  return Math.abs(wolfCount - sheepCount) <= 1 && prepared.rounds === expectedSlots
    && wolfSlots === expectedSlots && sheepSlots === expectedSlots;
}

export function applyGameCommand(
  state: GameState,
  command: GameCommand,
  dependencies: { random: RandomSource; prepareTeams: TeamPreparation; now?: () => number },
): GameResult<GameState> {
  if (command.type === "start") return startGame(state, command.actorId, dependencies.prepareTeams, dependencies.random, dependencies.now);
  if (command.type === "select-card" || command.type === "remove-card") {
    return applyCardSelectionCommand(state, command);
  }
  return gameError("INVALID_COMMAND", "This command is not implemented in the current engine stage.");
}
