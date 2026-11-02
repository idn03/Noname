import type { LobbyGameView } from '../../../../../shared/card-selection-contract';
import { GameCard } from './GameCard';

export function SelectionWaiting({ game }: { game: Extract<LobbyGameView, { phase: 'turns' }> }) {
  return <main className="card-selection-screen card-selection-screen--waiting" aria-labelledby="selection-waiting-title">
    <p className="card-selection-eyebrow">VÁN CHƠI ĐÃ SẴN SÀNG</p>
    <h1 id="selection-waiting-title">Các thẻ đã được chọn</h1>
    <p>{game.role === 'host' ? 'Vòng chọn đã hoàn tất. Có thể tiếp tục điều phối ván chơi.' : 'Đội của bạn đã sẵn sàng cho lượt chơi.'}</p>
    <div className="card-selection-round">Lượt {game.round} / {game.rounds}</div>
    {game.team && <p className="card-selection-team-label">Bạn thuộc Đội {game.team === 'wolf' ? 'Sói' : 'Cừu'}</p>}
    <section className="revealed-card-grid" aria-label="Các thẻ đã được chọn">
      {game.revealedCards.map((card) => <GameCard key={card.playerId} categoryId={card.categoryId} categoryName={card.categoryName}
        challengeCount={card.challengeCount} role={game.role === 'host' ? 'host' : game.team ?? 'sheep'} phase="turns" selectedChallenge={card.challenge} />)}
    </section>
  </main>;
}
