import type { LobbyGameView } from '../../../../../shared/card-selection-contract';
import type { LobbyPlayerView } from '../../../../../shared/lobby-contract';
import { GameCard } from '../components/GameCard';

type Game = Extract<LobbyGameView, { phase: 'turns'; role: 'host' }>;
interface Props { game: Game; players: readonly LobbyPlayerView[]; pending: boolean; error: string; onOutcome: (round: number, succeeded: boolean) => void; onCancel: () => void }

export function ManageGameScreen({ game, players, pending, error, onOutcome, onCancel }: Props) {
  const active = game.activeTurn;
  const nameOf = (id?: string) => players.find((player) => player.id === id)?.name ?? 'Đang chờ';
  const title = active?.defenderId ? 'Đang thực hiện thử thách' : active ? 'Đang chờ phòng thủ' : 'Đang chờ tấn công';
  return <main className="relative z-[1] min-h-dvh px-[4vw] pt-[clamp(42px,7vh,84px)] pb-[110px] font-type-body text-white max-[640px]:px-[14px] max-[640px]:pt-[46px] max-[640px]:pb-[92px]" aria-label="Quản lý trận đấu">
    <h1 className="m-0 text-center text-[clamp(48px,7vw,92px)] leading-[1.05]">Lượt {game.round}</h1>
    <div className="mt-[clamp(18px,6vh,66px)] grid grid-cols-[minmax(0,1fr)_minmax(180px,220px)_minmax(0,1fr)] items-start gap-[clamp(14px,4vw,58px)] max-[640px]:mt-7 max-[640px]:grid-cols-2 max-[640px]:gap-x-4 max-[640px]:gap-y-2">
      <Team title="Đội Sói" team="wolf" game={game} nameOf={nameOf} />
      <section className="text-center max-[640px]:col-span-full max-[640px]:row-start-1" aria-label="Thử thách hiện tại">
        <p className="mb-2 mt-0 text-2xl font-bold">{game.scores.wolf} — {game.scores.sheep}</p>
        <p className="my-0 text-lg" role="status">{title}</p>
        {active ? <><p className="text-sm">{nameOf(active.attackerId)} → {nameOf(active.defenderId)}</p>
          <GameCard categoryId={active.attackCategoryId} categoryName={active.attackCategoryName} challengeCount={1} role="host" phase="turns" selectedChallenge={active.challenge} className="mx-auto mt-[22px] w-full max-w-[200px] max-[640px]:mt-[14px] max-[640px]:!w-36" />
          {active.defenderId && <div className="mt-4 grid gap-2 max-[640px]:grid-cols-2"><button className="min-h-[46px] rounded-[10px] border-2 border-white/80 bg-transparent font-type-body text-base font-bold text-white active:scale-[.98] motion-reduce:active:scale-100" type="button" disabled={pending} onClick={() => onOutcome(active.round, true)}>Thành Công</button><button className="min-h-[46px] rounded-[10px] border-2 border-white/80 bg-transparent font-type-body text-base font-bold text-white active:scale-[.98] motion-reduce:active:scale-100" type="button" disabled={pending} onClick={() => onOutcome(active.round, false)}>Thất Bại</button></div>}
        </> : <p className="mt-8">Đội Sói đang chọn thẻ để tấn công.</p>}
        {error && <p className="text-center text-[#ffd1d4]" role="alert">{error}</p>}
      </section>
      <Team title="Đội Cừu" team="sheep" game={game} nameOf={nameOf} />
    </div>
    <details className="fixed bottom-[max(18px,env(safe-area-inset-bottom))] left-[clamp(18px,3vw,50px)] z-[3] max-w-[min(420px,65vw)] text-[13px] max-[640px]:bottom-[max(12px,env(safe-area-inset-bottom))] max-[640px]:left-3 max-[640px]:max-w-[calc(100vw-92px)] max-[640px]:text-xs open:rounded-lg open:border open:border-white/45 open:bg-[#351519] open:p-3"><summary className="cursor-pointer">Xem lịch sử giao đấu</summary>{game.roundHistory.length ? game.roundHistory.map((round) => <p className="my-2" key={`${round.round}-${round.attackerId}`}>Lượt {round.round}: {nameOf(round.attackerId)} tấn công · {round.defenderId ? `${nameOf(round.defenderId)} phòng thủ` : 'không phòng thủ'} · Sói +{round.scoreChange.wolf}, Cừu +{round.scoreChange.sheep}</p>) : <p className="my-2">Chưa có lượt nào hoàn thành.</p>}</details>
    <button className="fixed right-[clamp(18px,4vw,60px)] bottom-[max(18px,env(safe-area-inset-bottom))] z-[3] min-h-[46px] w-[54px] rounded-[10px] border-2 border-white/80 bg-transparent font-type-body text-4xl leading-none text-white max-[640px]:right-3 max-[640px]:bottom-[max(12px,env(safe-area-inset-bottom))] max-[640px]:w-[46px]" type="button" onClick={onCancel} aria-label="Hủy trận">×</button>
  </main>;
}

function Team({ title, team, game, nameOf }: { title: string; team: 'wolf' | 'sheep'; game: Game; nameOf: (id?: string) => string }) {
  const players = game.selection.teams[team].players;
  return <section className={`pt-2 ${team === 'sheep' ? 'text-right' : ''}`}><h2 className="mb-[18px] mt-0 text-[clamp(23px,3vw,38px)] max-[640px]:text-[21px]">{title}</h2><ol className="m-0 list-none p-0 text-[15px] max-[640px]:text-[13px]">{players.map((player) => <li className="mb-[18px]" key={player.id}>{nameOf(player.id)}{player.id === game.activeTurn?.attackerId ? ' · tấn công' : ''}{player.id === game.activeTurn?.defenderId ? ' · phòng thủ' : ''}</li>)}</ol></section>;
}
