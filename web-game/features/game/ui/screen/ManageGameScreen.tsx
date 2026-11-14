import { useRef } from 'react';
import type { LobbyGameView } from '@shared/card-selection-contract';
import type { LobbyPlayerView } from '@shared/lobby-contract';
import { Button } from '@/components/shared/Button';
import { GameCard } from '@/features/game/ui/components/GameCard';
import { HostSelectionActions } from '@/features/game/ui/components/HostSelectionActions';

type Game = Extract<LobbyGameView, { phase: 'turns'; role: 'host' }>;
interface Props { game: Game; players: readonly LobbyPlayerView[]; pending: boolean; error: string; onOutcome: (round: number, succeeded: boolean) => void; onCancel: () => void; onReplay: () => void }

export function ManageGameScreen({ game, players, pending, error, onOutcome, onCancel, onReplay }: Props) {
  const historyRef = useRef<HTMLDetailsElement>(null);
  const active = game.activeTurn;
  const nameOf = (id?: string) => players.find((player) => player.id === id)?.name ?? 'Đang chờ';
  return <main className="relative z-[1] min-h-dvh px-[4vw] pt-[clamp(42px,7vh,84px)] pb-[110px] font-type-body text-white max-[640px]:px-[14px] max-[640px]:pt-[46px] max-[640px]:pb-[92px]" aria-label="Quản lý trận đấu">
    <h1 className="m-0 text-center text-[length:clamp(var(--text-heading3),7vw,var(--text-heading2))] leading-[1.05]">Lượt {game.round}</h1>
    <div className="mt-[clamp(18px,6vh,66px)] grid grid-cols-[minmax(0,1fr)_minmax(180px,220px)_minmax(0,1fr)] items-start gap-[clamp(14px,4vw,58px)] max-[640px]:mt-7 max-[640px]:grid-cols-2 max-[640px]:gap-x-4 max-[640px]:gap-y-2">
      <Team title="Đội Sói" score={game.scores.wolf} team="wolf" game={game} nameOf={nameOf} />
      <section className="text-center max-[640px]:col-span-full max-[640px]:row-start-1" aria-label="Thử thách hiện tại">
        {active ? <>
          <GameCard categoryId={active.attackCategoryId} categoryName={active.attackCategoryName} challengeCount={1} role="host" phase="turns" selectedChallenge={active.challenge} className="mx-auto mt-[22px] w-full max-w-[200px] max-[640px]:mt-[14px] max-[640px]:!w-36" />
          {active.defenderId && <div className="mt-4 grid gap-4 max-[640px]:grid-cols-2"><Button variant="small" className="border-white/80 font-bold text-white" type="button" disabled={pending} onClick={() => onOutcome(active.round, true)}>Thành Công</Button><Button variant="small" className="border-white/80 font-bold text-white" type="button" disabled={pending} onClick={() => onOutcome(active.round, false)}>Thất Bại</Button></div>}
        </> : <p className="mt-8">Đội Sói đang chọn thẻ để tấn công.</p>}
        {error && <p className="text-center text-[#ffd1d4]" role="alert">{error}</p>}
      </section>
      <Team title="Đội Cừu" score={game.scores.sheep} team="sheep" game={game} nameOf={nameOf} />
    </div>
    <details ref={historyRef} className="fixed bottom-[calc(env(safe-area-inset-bottom)+8rem)] left-[clamp(18px,3vw,50px)] z-[30] max-h-[45dvh] max-w-[min(420px,65vw)] overflow-auto text-content max-[640px]:bottom-[calc(env(safe-area-inset-bottom)+7rem)] max-[640px]:left-3 max-[640px]:max-w-[calc(100vw-92px)] max-[640px]:text-content open:rounded-lg open:border open:border-white/45 open:bg-[#351519] open:p-3"><summary className="sr-only">Lịch sử giao đấu</summary>{game.roundHistory.length ? game.roundHistory.map((round) => <p className="my-2" key={`${round.round}-${round.attackerId}`}>Lượt {round.round}: {nameOf(round.attackerId)} tấn công · {round.defenderId ? `${nameOf(round.defenderId)} phòng thủ` : 'không phòng thủ'} · Sói +{round.scoreChange.wolf}, Cừu +{round.scoreChange.sheep}</p>) : <p className="my-2">Chưa có lượt nào hoàn thành.</p>}</details>
    <HostSelectionActions playerCount={players.filter((player) => !player.isHost && player.connected).length} pending={pending} onCancel={onCancel} onReplay={onReplay} onStart={() => undefined} onDelete={() => undefined} onHistory={() => { if (historyRef.current) historyRef.current.open = !historyRef.current.open; }} />
  </main>;
}

function Team({ title, score, team, game, nameOf }: { title: string; score: number; team: 'wolf' | 'sheep'; game: Game; nameOf: (id?: string) => string }) {
  const players = game.selection.teams[team].players;
  const isWolf = team === 'wolf';
  const alignRight = team === 'sheep';
  return <section className={`pt-2 ${isWolf ? 'text-black' : 'text-white'} ${alignRight ? 'text-right' : ''}`}>
    <p className="mb-1 ml-3 mt-0 text-heading6 font-bold">Điểm: {score}</p>
    <div className={`mb-[18px] flex items-center gap-3 ${alignRight ? 'justify-end' : ''}`}>
      <img className={`size-[60px] object-contain ${isWolf ? '' : 'brightness-0 invert'}`} src={`/assets/teams/${team}-icon.svg`} alt="" />
      <h2 className={`m-0 text-heading3 font-bold leading-[1.1] max-[760px]:text-heading6 ${isWolf ? '[text-shadow:0_4px_0_#ffffff50]' : '[text-shadow:0_4px_0_#00000050]'}`}>{title}</h2>
    </div>
    <ol className="m-0 list-none p-0 text-content text-white max-[640px]:text-content">{players.map((player) => <li className="mb-[18px]" key={player.id}>{nameOf(player.id)}{player.id === game.activeTurn?.attackerId ? ' · tấn công' : ''}{player.id === game.activeTurn?.defenderId ? ' · phòng thủ' : ''}</li>)}</ol>
  </section>;
}
