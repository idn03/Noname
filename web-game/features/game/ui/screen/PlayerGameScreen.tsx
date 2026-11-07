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
  return <main className="game-player-screen" aria-label="Màn chơi">
    <header className="game-player-heading"><h1>Lượt {game.round}</h1><p>Điểm: {game.scores[game.team ?? 'sheep']}</p><p className="game-player-status" role="status">{status}</p></header>
    {own && <div className="game-player-card"><GameCard categoryId={own.categoryId} categoryName={own.categoryName} challengeCount={1} role={game.team ?? 'sheep'} phase="turns" selectedChallenge={cardChallenge} disabled={own.used} /></div>}
    {active && <p className="game-player-message">{active.defenderId ? 'Đội Cừu đang thực hiện thử thách' : `Đội Sói tấn công bằng thẻ ${active.attackCategoryName}`}</p>}
    {actionReady && <button className="game-player-action" type="button" disabled={pending} onClick={() => game.team === 'wolf' ? onAttack(game.round) : onDefend(game.round)}>{pending ? 'ĐANG GỬI…' : actionLabel}</button>}
    {!actionReady && !active && <p className="game-player-message">Đang chờ đồng đội bắt đầu lượt chơi.</p>}
    {error && <p className="game-player-error" role="alert">{error}</p>}
    <footer className="game-player-footer"><span>Đã chọn: {own?.categoryName ?? 'Chưa có thẻ'}</span><strong>{game.team === 'wolf' ? 'Đội Sói' : 'Đội Cừu'}</strong><span>{teammateNames.filter((name) => name !== players.find(({ id }) => id === selfId)?.name).join('　')}</span></footer>
  </main>;
}
