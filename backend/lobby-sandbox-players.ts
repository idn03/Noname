import { randomUUID } from 'node:crypto';
import type { LobbyPlayerView } from '../shared/lobby-contract';

export interface LobbyPlayerRecord extends LobbyPlayerView { credentialHash: string }

export function createSandboxPlayers(count: number): LobbyPlayerRecord[] {
  return Array.from({ length: count }, (_, index) => ({
    id: randomUUID(),
    name: `Máy ${index + 1}`,
    isHost: false,
    connected: true,
    credentialHash: '',
  }));
}
