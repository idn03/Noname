'use client';

import { useState } from 'react';
import type { LobbyGameView } from '@shared/card-selection-contract';
import { formatSelectionTime, useSelectionCountdown } from '@/features/game/hooks/use-selection-countdown';

interface TeamAssignmentScreenProps {
  assignment: Extract<LobbyGameView, { phase: 'team-assignment'; role: 'player' }>;
  animateEntrance: boolean;
}

export function TeamAssignmentScreen({ assignment, animateEntrance }: TeamAssignmentScreenProps) {
  const { team, teamMembers, remainingMs } = assignment;
  const [revealOnMount] = useState(animateEntrance);
  const time = useSelectionCountdown(remainingMs);
  const teamName = team === 'wolf' ? 'Sói' : 'Cừu';
  return <section className="relative z-[1] mx-auto grid min-h-dvh w-full max-w-[900px] content-center justify-items-center gap-8 px-6 py-12 text-center" aria-labelledby="team-assignment-title">
    <img className="size-24 object-contain" src={`/assets/teams/${team}-icon.svg`} alt="" />
    <div className={revealOnMount ? 'motion-safe:animate-[content-enter_320ms_ease-out_backwards]' : undefined}>
      <p className="m-0 mb-3 text-[#bd858a] font-type-body text-content font-bold tracking-[.16em]">ĐỘI CỦA BẠN</p>
      <h1 id="team-assignment-title" className="m-0 text-white font-type-page-title text-[length:clamp(var(--text-heading3),10vw,var(--text-heading1))] leading-none uppercase">Đội {teamName}</h1>
    </div>
    <ul aria-label={`Thành viên đội ${teamName}`} className={`m-0 grid w-full max-w-sm list-none gap-1 p-0 text-white font-type-body text-title2 ${revealOnMount ? 'motion-safe:animate-[content-enter_320ms_ease-out_100ms_backwards]' : ''}`}>
      {teamMembers.map(({ id, name }) => <li key={id} className="min-w-0 [overflow-wrap:anywhere]">{name}</li>)}
    </ul>
    <p className="m-0 max-w-[42ch] text-white/80 font-type-body text-subtitle leading-relaxed">Hãy sẵn sàng. Vòng Chọn Thẻ sẽ bắt đầu sau khi mọi người đã chuẩn bị.</p>
    <time className="text-white font-type-display text-heading2 tabular-nums">
      {formatSelectionTime(time)}
    </time>
  </section>;
}
