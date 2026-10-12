import { gameError, type GameResult } from "./game-error";
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
  const teamById = new Map(prepared.value.players.map((player) => [player.id, player.team]));
  return {
    ok: true,
    value: {
      ...state,
      phase: "selection",
      players: state.players.map((player) => ({ ...player, team: teamById.get(player.id) })),
      rounds: prepared.value.rounds,
    },
  };
}

function isValidPreparation(players: readonly GamePlayer[], prepared: PreparedGame): boolean {
  if (!Number.isInteger(prepared.rounds) || prepared.rounds < 1 || prepared.players.length !== players.length) return false;
  const originalIds = new Set(players.map((player) => player.id));
  const assignedIds = new Set(prepared.players.map((player) => player.id));
  return assignedIds.size === players.length
    && [...originalIds].every((id) => assignedIds.has(id))
    && prepared.players.every((player) => player.team === "wolf" || player.team === "sheep");
}

export function applyGameCommand(
  state: GameState,
  command: GameCommand,
  dependencies: { random: RandomSource; prepareTeams: TeamPreparation },
): GameResult<GameState> {
  if (command.type === "start") return startGame(state, command.actorId, dependencies.prepareTeams, dependencies.random);
  return gameError("INVALID_COMMAND", "This command is not implemented in the current engine stage.");
}
