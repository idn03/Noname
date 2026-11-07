import type { LobbyGameView } from '../../../../../shared/card-selection-contract';
import type { LobbyPlayerView } from '../../../../../shared/lobby-contract';
import { GameCard } from '../components/GameCard';

type Game = Extract<LobbyGameView, { phase: 'turns'; role: 'player' }>;
interface Props { game: Game; selfId: string; players: readonly LobbyPlayerView[]; pending: boolean; error: string; onAttack: (round: number) => void; onDefend: (round: number) => void }

export function PlayerGameScreen({ game, selfId, players, pending, error, onAttack, onDefend }: Props) {
  const own = game.ownCard;
  const active = game.activeTurn;
  const cardChallenge = game.team === 'wolf' ? own?.challenge : active?.challenge;
  const actionReady = game.team === 'wolf' ? own?.canAttack : own?.canDefend;
  const actionLabel = game.team === 'wolf' ? 'TẤN CÔNG' : 'PHÒNG THỦ';
  const status = active ? active.defenderId ? 'Đang thực hiện thử thách' : 'Đội Sói đang tấn công' : 'Đang chờ lượt tấn công';
  const teammateNames = players.filter((player) => player.team === game.team && !player.isHost).map(({ name }) => name);
  return <main className="relative z-[1] flex min-h-dvh flex-col items-center px-[14px] pt-[calc(env(safe-area-inset-top)+18px)] pb-[calc(env(safe-area-inset-bottom)+18px)] font-type-body text-white" aria-label="Màn chơi">
    <header className="self-stretch"><h1 className="m-0 text-[30px] leading-[1.1]">Lượt {game.round}</h1><p className="my-1 text-[17px] font-bold">Điểm: {game.scores[game.team ?? 'sheep']}</p><p className="my-1 text-sm opacity-[.88]" role="status">{status}</p></header>
    {own && <div className="mt-[clamp(20px,7vh,58px)] w-[min(50vw,200px)]"><GameCard categoryId={own.categoryId} categoryName={own.categoryName} challengeCount={1} role={game.team ?? 'sheep'} phase="turns" selectedChallenge={cardChallenge} disabled={own.used} /></div>}
    {active && <p className="my-[24px] text-center text-[17px] font-bold">{active.defenderId ? 'Đội Cừu đang thực hiện thử thách' : `Đội Sói tấn công bằng thẻ ${active.attackCategoryName}`}</p>}
    {actionReady && <button className="min-h-[58px] w-full max-w-[182px] rounded-[13px] border-2 border-white bg-transparent font-type-body text-sm font-bold text-white active:scale-[.98] motion-reduce:active:scale-100" type="button" disabled={pending} onClick={() => game.team === 'wolf' ? onAttack(game.round) : onDefend(game.round)}>{pending ? 'ĐANG GỬI…' : actionLabel}</button>}
    {!actionReady && !active && <p className="my-[24px] text-center text-[17px] font-bold">Đang chờ đồng đội bắt đầu lượt chơi.</p>}
    {error && <p className="text-center text-[#ffd1d4]" role="alert">{error}</p>}
    <footer className="mt-auto flex flex-wrap items-center justify-center gap-[10px] pt-6 text-center text-[13px]"><span>Đã chọn: {own?.categoryName ?? 'Chưa có thẻ'}</span><strong className="text-[17px]">{game.team === 'wolf' ? 'Đội Sói' : 'Đội Cừu'}</strong><span>{teammateNames.filter((name) => name !== players.find(({ id }) => id === selfId)?.name).join('　')}</span></footer>
  </main>;
}
