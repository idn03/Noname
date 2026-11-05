import type { LobbyGameView } from '../../../../../shared/card-selection-contract';
import { GameCard } from './GameCard';

export function SelectionWaiting({ game }: { game: Extract<LobbyGameView, { phase: 'turns'; role: 'player' }> }) {
  return <main className="relative z-[1] w-full max-w-[42rem] border border-[rgb(239_228_199/.22)] rounded-3xl bg-[rgb(13_18_17/.92)] p-12 text-center text-[#f3eee2] shadow-[0_24px_80px_rgb(0_0_0/.28)] max-[640px]:rounded-2xl max-[640px]:p-4" aria-labelledby="selection-waiting-title">
    <p className="mt-0 mb-4 text-[#b8b8b8] text-xs tracking-[.19em]">VÁN CHƠI ĐÃ SẴN SÀNG</p>
    <h1 id="selection-waiting-title" className="m-0 font-georgia-fallback text-[clamp(1.8rem,4vw,2.8rem)] leading-[normal] font-medium">Các thẻ đã được chọn</h1>
    <p className="text-[#c2c2b8]">Đội của bạn đã sẵn sàng cho lượt chơi.</p>
    <div className="mt-6 mb-[.4rem] inline-block rounded-full border border-[#722f37] px-[1.2rem] py-[.8rem] text-white">Lượt {game.round} / {game.rounds}</div>
    {game.team && <p className="m-0 text-[#c2c2b8]">Bạn thuộc Đội {game.team === 'wolf' ? 'Sói' : 'Cừu'}</p>}
    <section className="relative z-[1] mt-6 grid grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] gap-4" aria-label="Các thẻ đã được chọn">
      {game.revealedCards.map((card) => <GameCard key={card.playerId} categoryId={card.categoryId} categoryName={card.categoryName}
        challengeCount={card.challengeCount} role={game.team ?? 'sheep'} phase="turns" selectedChallenge={card.challenge} className="max-w-[12rem] justify-self-center" />)}
    </section>
  </main>;
}
