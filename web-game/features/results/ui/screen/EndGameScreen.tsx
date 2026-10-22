'use client';

import type { Team } from '../../../../game/game-types';
import { RuneField } from '../../../../components/shared/RuneField';

export interface EndGameResult {
  scores: Readonly<Record<Team, number>>;
  winner: Team | 'draw';
  rounds: number;
}

interface EndGameScreenProps {
  result: EndGameResult;
  audience: 'host' | 'player';
  onReturnHome?: () => void;
}

const TEAM_LABEL: Record<Team, string> = { wolf: 'Đội Sói', sheep: 'Đội Cừu' };

export function EndGameScreen({ result, audience, onReturnHome }: EndGameScreenProps) {
  const headline = result.winner === 'draw' ? 'Hòa' : `${TEAM_LABEL[result.winner]} chiến thắng`;

  return (
    <main className={`endgame-screen endgame-screen--${audience}`} aria-labelledby="endgame-title">
      <RuneField />
      <header className="endgame-heading">
        <p className="endgame-eyebrow">TRẬN ĐẤU ĐÃ KẾT THÚC · {result.rounds} LƯỢT</p>
        <h1 id="endgame-title">{headline}</h1>
        <p className="endgame-summary" role="status">
          {result.winner === 'draw' ? 'Hai đội có cùng số điểm.' : `Chúc mừng ${TEAM_LABEL[result.winner]}!`}
        </p>
      </header>

      <section className="endgame-scores" aria-label="Điểm số cuối cùng">
        {(['wolf', 'sheep'] as const).map((team) => (
          <article className={`endgame-team endgame-team--${team}${result.winner === team ? ' is-winner' : ''}`} key={team}>
            <img src={`/assets/teams/${team}-portrait.png`} alt="" />
            <div className="endgame-team-info">
              <h2>{TEAM_LABEL[team]}</h2>
              {result.winner === team && <p>Đội chiến thắng</p>}
            </div>
            <strong aria-label={`${result.scores[team]} điểm`}>{result.scores[team]}</strong>
          </article>
        ))}
      </section>

      <p className="endgame-confirmation">Kết quả đã được xác nhận cho tất cả người chơi.</p>
      {onReturnHome && <button className="endgame-return" type="button" onClick={onReturnHome}>Về trang chủ</button>}
    </main>
  );
}
