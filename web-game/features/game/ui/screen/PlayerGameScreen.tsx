import type { LobbyGameView } from '@shared/card-selection-contract';
import type { LobbyPlayerView } from '@shared/lobby-contract';
import { GameCard } from '@/features/game/ui/components/GameCard';

import type { RoundAward } from '../../hooks/use-round-presentation';
import { RoundAwardCard, SheepImpact } from '../components/round-award-card';

type Game = Extract<LobbyGameView, { phase: 'turns'; role: 'player' }>;
interface Props { award?: RoundAward; game: Game; selfId: string; players: readonly LobbyPlayerView[]; pending: boolean; error: string; onAttack: (round: number) => void; onDefend: (round: number) => void }

export function PlayerGameScreen({ award, game, selfId, players, pending, error, onAttack, onDefend }: Props) {
  const own = game.ownCard;
  const active = game.activeTurn;
  const scoringTeam = award && (award.entry.scoreChange.sheep > 0 ? 'sheep' : 'wolf');
  const card = active ? { categoryId: active.attackCategoryId, categoryName: active.attackCategoryName } : own;
  const actionReady = game.team === 'wolf' ? own?.canAttack : own?.canDefend;
  const actionLabel = game.team === 'wolf' ? 'TẤN CÔNG' : 'PHÒNG THỦ';
  const status = award ? 'Lượt đã kết thúc' : active ? active.defenderId ? 'Đang thực hiện thử thách' : 'Đội Sói đang tấn công' : 'Đang chờ lượt tấn công';
  const teammateNames = players.filter((player) => player.team === game.team && !player.isHost).map(({ name }) => name);
  return <main className="relative z-[1] flex min-h-dvh flex-col items-center px-[14px] pt-[calc(env(safe-area-inset-top)+18px)] pb-[calc(env(safe-area-inset-bottom)+18px)] font-type-body text-white" aria-label="Màn chơi">
    <header className="self-stretch"><h1 className="m-0 text-heading6 leading-[1.1]">Lượt {game.round}</h1><p className="my-1 text-subtitle font-bold">Điểm: {game.scores[game.team ?? 'sheep']}</p>
      {scoringTeam && scoringTeam !== game.team && <p className="my-1 text-subtitle font-bold">Điểm Đội {scoringTeam === 'sheep' ? 'Cừu' : 'Sói'}: {game.scores[scoringTeam]}</p>}
      <p className="my-1 text-content opacity-[.88]" role="status">{status}</p></header>
    {(award || card) && <div className="mt-[clamp(20px,7vh,58px)] w-[min(50vw,200px)]">
      {award ? <RoundAwardCard key={award.entry.round} award={award} /> : card &&
        <GameCard key={`${game.round}-${active?.attackerId ?? 'own'}`} categoryId={card.categoryId} categoryName={card.categoryName}
          challengeCount={1} viewerRole={game.team ?? 'sheep'} phase="turns" selectedChallenge={active?.challenge} />}
    </div>}
    {award && <SheepImpact award={award}><p className="my-6 text-subtitle font-bold">
      {award.entry.challengeSucceeded ? 'Đội Cừu hoàn thành thử thách' : 'Đội Cừu trúng đòn'}
    </p></SheepImpact>}
    {active && <p className="my-[24px] text-center text-subtitle font-bold">{active.defenderId ? 'Đội Cừu đang thực hiện thử thách' : `Đội Sói tấn công bằng thẻ ${active.attackCategoryName}`}</p>}
    {!award && actionReady && <button className="min-h-[58px] w-full max-w-[182px] rounded-[13px] border-2 border-white bg-transparent font-type-body text-content font-bold text-white active:scale-[.98] motion-reduce:active:scale-100" type="button" disabled={pending} onClick={() => game.team === 'wolf' ? onAttack(game.round) : onDefend(game.round)}>{pending ? 'ĐANG GỬI…' : actionLabel}</button>}
    {!award && !actionReady && !active && <p className="my-[24px] text-center text-subtitle font-bold">Đang chờ đồng đội bắt đầu lượt chơi.</p>}
    {error && <p className="text-center text-[#ffd1d4]" role="alert">{error}</p>}
    <footer className="mt-auto flex flex-wrap items-center justify-center gap-[10px] pt-6 text-center text-content"><span>Đã chọn: {own?.categoryName ?? 'Chưa có thẻ'}</span><strong className="text-subtitle">{game.team === 'wolf' ? 'Đội Sói' : 'Đội Cừu'}</strong><span>{teammateNames.filter((name) => name !== players.find(({ id }) => id === selfId)?.name).join('　')}</span></footer>
  </main>;
}
