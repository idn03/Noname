'use client';

import type { HostCardSelectionView } from '../../../../../shared/card-selection-contract';
import { useSelectionCountdown, formatSelectionTime } from '../../hooks/use-selection-countdown';

interface HostCardSelectionProps { selection: HostCardSelectionView }

export function HostCardSelection({ selection }: HostCardSelectionProps) {
  const remainingMs = useSelectionCountdown(selection.remainingMs);
  return <main className="grid min-h-dvh grid-rows-[auto_1fr] pt-[4.3vh] pb-[12vh] text-white max-[760px]:pt-[3vh] max-[760px]:pb-28" aria-labelledby="card-selection-title">
    <header className="text-center"><h1 id="card-selection-title" className="m-0 font-type-page-title text-[length:clamp(var(--text-heading3),7vw,var(--text-heading1))] leading-none tracking-[-.035em] font-normal max-[760px]:text-[length:clamp(var(--text-heading3),12vw,var(--text-heading2))]">Chọn Thẻ</h1></header>
    <div className="grid grid-cols-[minmax(16rem,1fr)_minmax(14rem,.9fr)_minmax(16rem,1fr)] items-center gap-[clamp(1.3rem,4vw,5rem)] pb-[4vh] max-[760px]:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] max-[760px]:gap-[.6rem] max-[760px]:pb-4">
      <TeamColumn team="wolf" data={selection.teams.wolf} />
      <time className="col-start-2 row-start-1 self-center text-center text-white font-type-display text-[length:clamp(var(--text-heading2),7.2vw,var(--text-heading1))] leading-none tracking-[-.045em] tabular-nums font-normal max-[760px]:text-[length:clamp(var(--text-heading3),10vw,var(--text-heading2))]" aria-label={`Thời gian chọn thẻ còn ${formatSelectionTime(remainingMs)}`}>
        {formatSelectionTime(remainingMs)}
      </time>
      <TeamColumn team="sheep" data={selection.teams.sheep} />
    </div>
  </main>;
}

function TeamColumn({ team, data }: {
  team: 'wolf' | 'sheep';
  data: HostCardSelectionView['teams']['wolf'];
}) {
  const label = team === 'wolf' ? 'Sói' : 'Cừu';
  return <section id={`host-team-${team}`} className={`min-w-0 scroll-mt-4 ${team === 'wolf' ? 'col-start-1 row-start-1 text-[#090607]' : 'col-start-3 row-start-1 text-white'}`}
    aria-label={`Đội ${label}, ${data.ready}/${data.total} thẻ đã gửi`}>
    <header className="flex items-center gap-[.7rem] max-[760px]:gap-[.4rem]">
      <img className={`h-[clamp(2.5rem,3.2vw,3.75rem)] w-[clamp(2.5rem,3.2vw,3.75rem)] object-contain max-[760px]:size-8 ${team === 'sheep' ? 'brightness-0 invert' : ''}`} src={`/assets/teams/${team}-icon.svg`} alt="" /><h2 className={`m-0 font-type-section-title text-[length:clamp(var(--text-title1),2.5vw,var(--text-heading4))] leading-[1.1] font-bold max-[760px]:text-[length:clamp(var(--text-subtitle),4vw,var(--text-title1))] ${team === 'wolf' ? '[text-shadow:0_4px_0_#ffffff50]' : '[text-shadow:0_4px_0_#00000050]'}`}>Đội {label}:</h2>
    </header>
    <ol className="mt-[clamp(1.5rem,4.5vh,3.2rem)] mb-10 grid list-none gap-[clamp(1rem,2.4vh,1.8rem)] p-0 pl-8 max-[760px]:mt-8 max-[760px]:mb-8 max-[760px]:gap-4 max-[760px]:pl-1">
      {data.players.map((player, index) => <li className={`flex min-w-0 items-baseline gap-2 font-type-body text-[length:clamp(var(--text-content),1.1vw,var(--text-subtitle))] leading-[1.25] max-[760px]:flex-wrap max-[760px]:text-content ${team === 'wolf' ? '[text-shadow:0_1px_0_#ffffff50]' : '[text-shadow:0_1px_0_#00000050]'}`} key={player.id}>
        <span className="shrink-0 font-type-body text-title2 leading-none tabular-nums max-[760px]:text-subtitle">{String(index + 1).padStart(2, '0')}</span>
        <span>{player.name}</span>
        {!player.hasCardSlot && <span className="ml-auto font-type-label text-content leading-none opacity-75">Không có thẻ</span>}
      </li>)}
    </ol>
    <h3 className={`mt-0 mr-0 mb-3 ml-8 font-type-section-title text-[length:clamp(var(--text-title1),2vw,var(--text-heading6))] leading-[1.15] font-bold max-[760px]:ml-0 max-[760px]:text-subtitle ${team === 'wolf' ? '[text-shadow:0_4px_0_#ffffff50]' : '[text-shadow:0_4px_0_#00000050]'}`}>Thẻ đã chọn:</h3>
    <ul className="ml-8 mt-0 mb-0 flex list-none flex-wrap gap-[.6rem] p-0 max-[760px]:ml-0 max-[760px]:gap-[.35rem]" aria-label={`Thẻ đã chọn của Đội ${label}`}>
      {data.selectedCategories.map((category, index) => <li className={`min-w-[5.5rem] rounded-full px-[.85rem] py-[.35rem] text-center font-type-body text-content leading-[1.1] max-[760px]:min-w-0 max-[760px]:px-2 max-[760px]:py-[.3rem] max-[760px]:text-content ${team === 'wolf' ? 'bg-[#050405] text-white' : 'bg-white text-[#161113]'}`} key={`${category}-${index}`}>{category}</li>)}
      {!data.selectedCategories.length && <li className="min-w-[5.5rem] rounded-full bg-transparent px-[.85rem] py-[.35rem] text-center font-type-body text-content leading-[1.1] opacity-[.72] max-[760px]:min-w-0 max-[760px]:px-2 max-[760px]:py-[.3rem] max-[760px]:text-content">Chưa có</li>}
    </ul>
  </section>;
}
