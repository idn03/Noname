export function getLobbyScreenKey(phase: string | undefined, role: string | undefined, host: boolean, hasJoined: boolean) {
  if (phase && role) return `${phase}:${role}`;
  if (host) return 'lobby:host';
  if (hasJoined) return 'lobby:player';
  return 'home';
}
