export type GameErrorCode = "INVALID_COMMAND" | "INVALID_PHASE" | "NOT_AUTHORIZED" | "INVALID_INPUT" | "NOT_FOUND" | "INVALID_ASSIGNMENT";

export interface GameError {
  code: GameErrorCode;
  message: string;
}

export type GameResult<T> = { ok: true; value: T } | { ok: false; error: GameError };

export function gameError<T>(code: GameErrorCode, message: string): GameResult<T> {
  return { ok: false, error: { code, message } };
}
