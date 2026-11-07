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
    <main className={`relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden gap-[34px] bg-[linear-gradient(180deg,#722f37_0%,#57272d_54%,#080607_100%)] px-6 py-14 text-center text-white ${audience === 'player' ? 'mx-auto w-[min(100%,402px)] gap-7 px-5 pt-11 pb-9 max-[520px]:justify-start' : ''}`} aria-labelledby="endgame-title">
      <RuneField density={audience === 'player' ? 'player' : 'default'} />
      <header className="relative z-[1] w-full">
        <p className="m-0 mb-[13px] text-[#f0dfe0] font-type-label text-content leading-[1.4] font-bold tracking-[.16em]">TRẬN ĐẤU ĐÃ KẾT THÚC · {result.rounds} LƯỢT</p>
        <h1 id="endgame-title" className="m-0 font-type-result-title text-[length:clamp(var(--text-heading5),8vw,var(--text-heading2))] leading-[1.04] font-normal tracking-[-.045em]">{headline}</h1>
        <p className="mt-[14px] mb-0 text-[#f1e7e7] font-type-result-title text-subtitle leading-[1.4]" role="status">
          {result.winner === 'draw' ? 'Hai đội có cùng số điểm.' : `Chúc mừng ${teamLabel(result.winner)}!`}
        </p>
      </header>

      <section className={`relative z-[1] grid w-[min(100%,760px)] grid-cols-2 gap-4 ${audience === 'player' ? 'max-[520px]:grid-cols-1 max-[520px]:gap-3' : 'max-[520px]:grid-cols-1'}`} aria-label="Điểm số cuối cùng">
        {(['wolf', 'sheep'] as const).map((team) => (
          <article className={`grid min-w-0 grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-[14px] rounded-[14px] border border-[rgb(255_255_255/.42)] bg-[rgb(0_0_0/.24)] p-4 text-left ${result.winner === team ? 'border-white bg-[rgb(255_255_255/.12)]' : ''} ${audience === 'player' ? 'max-[520px]:grid-cols-[48px_minmax(0,1fr)_auto] max-[520px]:p-[13px]' : ''}`} key={team}>
            <img className="h-[78px] w-14 rounded-[7px] object-cover [object-position:center_24%] max-[520px]:h-[66px] max-[520px]:w-12" src={`/assets/teams/${team}-portrait.png`} alt="" />
            <div className="min-w-0">
              <h2 className="m-0 font-type-result-title text-title2 leading-[1.2] font-semibold">{teamLabel(team)}</h2>
              {result.winner === team && <p className="mt-[7px] mb-0 text-[#f0dfe0] text-content">Đội chiến thắng</p>}
            </div>
            <strong className="font-type-result-title text-heading6 leading-none font-normal" aria-label={`${result.scores[team]} điểm`}>{result.scores[team]}</strong>
          </article>
        ))}
      </section>

      <p className="relative z-[1] m-0 max-w-[42ch] text-[#d2c5c6] text-content leading-[1.5]">Kết quả đã được xác nhận cho tất cả người chơi.</p>
      {onReturnHome && <Button className="relative z-[1] min-h-12 px-[26px] text-white font-type-label text-content leading-none font-semibold" type="button" onClick={onReturnHome}>Về trang chủ</Button>}
    </main>
  );
}
