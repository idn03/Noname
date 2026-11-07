'use client';

import { formatSelectionTime, useSelectionCountdown } from '@/features/game/hooks/use-selection-countdown';

interface TeamAssignmentScreenProps {
  team: 'wolf' | 'sheep';
  remainingMs: number;
}

export function TeamAssignmentScreen({ team, remainingMs }: TeamAssignmentScreenProps) {
  const time = useSelectionCountdown(remainingMs);
  const teamName = team === 'wolf' ? 'Sói' : 'Cừu';
  return <section className="relative z-[1] mx-auto grid min-h-dvh w-full max-w-[900px] content-center justify-items-center gap-8 px-6 py-12 text-center" aria-labelledby="team-assignment-title">
    <img className="size-24 object-contain" src={`/assets/teams/${team}-icon.svg`} alt="" />
    <div>
      <p className="m-0 mb-3 text-[#bd858a] font-type-body text-content font-bold tracking-[.16em]">ĐỘI CỦA BẠN</p>
      <h1 id="team-assignment-title" className="m-0 text-white font-type-page-title text-[length:clamp(var(--text-heading3),10vw,var(--text-heading1))] leading-none">Đội {teamName}</h1>
    </div>
    <p className="m-0 max-w-[42ch] text-white/80 font-type-body text-subtitle leading-relaxed">Hãy sẵn sàng. Vòng Chọn Thẻ sẽ bắt đầu sau khi mọi người đã chuẩn bị.</p>
    <time className="text-white font-type-display text-heading2 tabular-nums" aria-label={`Vòng Chọn Thẻ bắt đầu sau ${formatSelectionTime(time)}`}>
      {formatSelectionTime(time)}
    </time>
  </section>;
}
