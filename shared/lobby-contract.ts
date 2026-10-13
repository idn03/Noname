export const LOBBY_EVENTS = {
  hostCreate: 'host:create',
  join: 'player:join',
  resume: 'player:resume',
  identity: 'player:identity',
  state: 'lobby:state',
  credential: 'player:credential',
  error: 'game:error',
} as const;

export type LobbyErrorCode =
  | 'INVALID_NAME'
  | 'NO_ACTIVE_SESSION'
  | 'LOBBY_CLOSED'
  | 'LOBBY_FULL'
  | 'INVALID_CREDENTIAL'
  | 'INVALID_REQUEST'
  | 'SESSION_ALREADY_ACTIVE'
  | 'HOST_CREATION_LOCAL_ONLY';

export type LobbyJoinResult =
  | { ok: true; playerId: string; credential: string; lobby: LobbyView }
  | { ok: false; error: LobbyErrorView };

export interface LobbyPlayerView {
  id: string;
  name: string;
  isHost: boolean;
  connected: boolean;
}

export interface LobbyView {
  phase: 'lobby' | 'started';
  players: readonly LobbyPlayerView[];
}

export interface LobbySessionView {
  playerId: string;
  credential?: string;
  lobby: LobbyView;
}

export interface LobbyErrorView {
  code: LobbyErrorCode;
  message: string;
}

export function parsePlayerName(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const name = value.trim();
  const visibleCharacters = Array.from(name).length;
  if (visibleCharacters < 1 || visibleCharacters > 24 || /\p{Cc}/u.test(name)) return undefined;
  return name;
}
