'use client';

import { useEndGameScreen, type EndGameResult } from '../../hooks/use-end-game-screen';
import { RuneField } from '../../../../components/shared/RuneField';
import { Button } from '../../../../components/shared/Button';

export type { EndGameResult } from '../../hooks/use-end-game-screen';

interface EndGameScreenProps {
  result: EndGameResult;
  audience: 'host' | 'player';
  onReturnHome?: () => void;
}

export function EndGameScreen({ result, audience, onReturnHome }: EndGameScreenProps) {
  const { headline, teamLabel } = useEndGameScreen(result);

  return (
    <main className={`endgame-screen endgame-screen--${audience}`} aria-labelledby="endgame-title">
      <RuneField />
      <header className="endgame-heading">
        <p className="endgame-eyebrow">TRẬN ĐẤU ĐÃ KẾT THÚC · {result.rounds} LƯỢT</p>
        <h1 id="endgame-title">{headline}</h1>
        <p className="endgame-summary" role="status">
          {result.winner === 'draw' ? 'Hai đội có cùng số điểm.' : `Chúc mừng ${teamLabel(result.winner)}!`}
        </p>
      </header>

      <section className="endgame-scores" aria-label="Điểm số cuối cùng">
        {(['wolf', 'sheep'] as const).map((team) => (
          <article className={`endgame-team endgame-team--${team}${result.winner === team ? ' is-winner' : ''}`} key={team}>
            <img src={`/assets/teams/${team}-portrait.png`} alt="" />
            <div className="endgame-team-info">
              <h2>{teamLabel(team)}</h2>
              {result.winner === team && <p>Đội chiến thắng</p>}
            </div>
            <strong aria-label={`${result.scores[team]} điểm`}>{result.scores[team]}</strong>
          </article>
        ))}
      </section>

      <p className="endgame-confirmation">Kết quả đã được xác nhận cho tất cả người chơi.</p>
      {onReturnHome && <Button className="endgame-return" type="button" onClick={onReturnHome}>Về trang chủ</Button>}
    </main>
  );
}
