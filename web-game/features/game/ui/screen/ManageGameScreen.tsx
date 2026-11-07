import type { LobbyGameView } from '../../../../../shared/card-selection-contract';
import type { LobbyPlayerView } from '../../../../../shared/lobby-contract';
import { GameCard } from '../components/GameCard';

type Game = Extract<LobbyGameView, { phase: 'turns'; role: 'host' }>;
interface Props { game: Game; players: readonly LobbyPlayerView[]; pending: boolean; error: string; onOutcome: (round: number, succeeded: boolean) => void; onCancel: () => void }

export function ManageGameScreen({ game, players, pending, error, onOutcome, onCancel }: Props) {
  const active = game.activeTurn;
  const nameOf = (id?: string) => players.find((player) => player.id === id)?.name ?? 'Đang chờ';
  const attackCard = active && game.selection.teams.wolf.players.find((player) => player.id === active.attackerId);
  const title = active?.defenderId ? 'Đang thực hiện thử thách' : active ? 'Đang chờ phòng thủ' : 'Đang chờ tấn công';
  return <main className="manage-game-screen" aria-label="Quản lý trận đấu">
    <h1>Lượt {game.round}</h1>
    <div className="manage-game-teams">
      <Team title="Đội Sói" team="wolf" game={game} nameOf={nameOf} />
      <section className="manage-game-center" aria-label="Thử thách hiện tại">
        <p className="manage-game-score">{game.scores.wolf} — {game.scores.sheep}</p>
        <p className="manage-game-status" role="status">{title}</p>
        {active ? <><p className="manage-game-players">{nameOf(active.attackerId)} → {nameOf(active.defenderId)}</p>
          <GameCard categoryId={active.attackCategoryId} categoryName={active.attackCategoryName} challengeCount={1} role="host" phase="turns" selectedChallenge={active.challenge} className="manage-game-card" />
          {active.defenderId && <div className="manage-game-outcomes"><button type="button" disabled={pending} onClick={() => onOutcome(active.round, true)}>Thành Công</button><button type="button" disabled={pending} onClick={() => onOutcome(active.round, false)}>Thất Bại</button></div>}
        </> : <p className="manage-game-waiting">Đội Sói đang chọn thẻ để tấn công.</p>}
        {error && <p className="game-player-error" role="alert">{error}</p>}
      </section>
      <Team title="Đội Cừu" team="sheep" game={game} nameOf={nameOf} />
    </div>
    <details className="manage-game-history"><summary>Xem lịch sử giao đấu</summary>{game.roundHistory.length ? game.roundHistory.map((round) => <p key={`${round.round}-${round.attackerId}`}>Lượt {round.round}: {nameOf(round.attackerId)} tấn công · {round.defenderId ? `${nameOf(round.defenderId)} phòng thủ` : 'không phòng thủ'} · Sói +{round.scoreChange.wolf}, Cừu +{round.scoreChange.sheep}</p>) : <p>Chưa có lượt nào hoàn thành.</p>}</details>
    <button className="manage-game-cancel" type="button" onClick={onCancel} aria-label="Hủy trận">×</button>
  </main>;
}

function Team({ title, team, game, nameOf }: { title: string; team: 'wolf' | 'sheep'; game: Game; nameOf: (id?: string) => string }) {
  const players = game.selection.teams[team].players;
  return <section className={`manage-game-team manage-game-team-${team}`}><h2>{title}</h2><ol>{players.map((player) => <li key={player.id}>{nameOf(player.id)}{player.id === game.activeTurn?.attackerId ? ' · tấn công' : ''}{player.id === game.activeTurn?.defenderId ? ' · phòng thủ' : ''}</li>)}</ol></section>;
}
