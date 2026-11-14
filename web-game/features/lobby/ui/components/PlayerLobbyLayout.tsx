import type { LobbyPlayerView } from '@shared/lobby-contract';
import { LobbyPlayerStage } from './LobbyPlayerStage';

interface PlayerLobbyLayoutProps {
  players: readonly LobbyPlayerView[];
  error: string;
}

export function PlayerLobbyLayout({ players, error }: PlayerLobbyLayoutProps) {
  const joinedPlayers = players.filter((player) => !player.isHost);
  const host = players.find((player) => player.isHost);

  return <section className="relative z-[1] mx-auto flex min-h-dvh w-full max-w-[402px] flex-col px-5 pt-[max(30px,env(safe-area-inset-top))] pb-[max(100px,calc(env(safe-area-inset-bottom)+84px))] text-white" aria-labelledby="player-lobby-title">
    <header className="text-center">
      <h1 id="player-lobby-title" className="m-0 font-type-display text-[length:clamp(var(--text-heading4),12vw,var(--text-heading2))] font-normal leading-none">Phòng chờ</h1>
      <p className="mt-4 mb-0 text-subtitle" role="status">{joinedPlayers.length}/10 người chơi đã tham gia</p>
      <p className="mt-2 mb-0 text-content text-white/75">Chủ phòng: {host?.name ?? 'Đang kết nối'}{host && !host.connected ? ' · mất kết nối' : ''}</p>
    </header>
    <div className="mt-8 min-h-[400px] flex-1 overflow-hidden rounded-xl bg-[rgb(141_141_141/.22)]">
      <LobbyPlayerStage players={players} started={false} canSeeAllTeams={false} />
    </div>
    <p className="mb-0 mt-5 text-center text-content text-white/75" role="status">Đang chờ Chủ phòng bắt đầu trận.</p>
    {error && <p className="mb-0 mt-3 text-center text-[#ffb6bd] text-content" role="alert">{error}</p>}
  </section>;
}
