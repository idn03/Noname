'use client';

import type { HostCardSelectionView } from '../../../../../shared/card-selection-contract';
import { useSelectionCountdown, formatSelectionTime } from '../../hooks/use-selection-countdown';

interface HostCardSelectionProps { selection: HostCardSelectionView }

export function HostCardSelection({ selection }: HostCardSelectionProps) {
  const remainingMs = useSelectionCountdown(selection.remainingMs);
  return <main className="host-card-selection" aria-labelledby="card-selection-title">
    <header className="host-card-selection__heading"><h1 id="card-selection-title">Chọn Thẻ</h1></header>
    <div className="host-card-selection__stage">
      <TeamColumn team="wolf" data={selection.teams.wolf} />
      <time className="host-card-selection__timer" aria-label={`Thời gian chọn thẻ còn ${formatSelectionTime(remainingMs)}`}>
        {formatSelectionTime(remainingMs)}
      </time>
      <TeamColumn team="sheep" data={selection.teams.sheep} />
    </div>
    <nav className="host-card-selection__team-nav" aria-label="Đi tới đội">
      <a href="#host-team-wolf" aria-label="Đi tới Đội Sói"><img src="/assets/teams/wolf-icon.svg" alt="" /></a>
      <a href="#host-team-sheep" aria-label="Đi tới Đội Cừu"><img src="/assets/teams/sheep-icon.svg" alt="" /></a>
    </nav>
  </main>;
}

function TeamColumn({ team, data }: {
  team: 'wolf' | 'sheep';
  data: HostCardSelectionView['teams']['wolf'];
}) {
  const label = team === 'wolf' ? 'Sói' : 'Cừu';
  return <section id={`host-team-${team}`} className={`host-card-team host-card-team--${team}`}
    aria-label={`Đội ${label}, ${data.ready}/${data.total} thẻ đã gửi`}>
    <header className="host-card-team__heading">
      <img src={`/assets/teams/${team}-icon.svg`} alt="" /><h2>Đội {label}:</h2>
    </header>
    <ol className="host-card-team__players">
      {data.players.map((player, index) => <li key={player.id}>
        <span className="host-card-team__number">{String(index + 1).padStart(2, '0')}</span>
        <span>{player.name}</span>
        {!player.hasCardSlot && <span className="host-card-team__slotless">Không có thẻ</span>}
      </li>)}
    </ol>
    <h3>Thẻ đã chọn:</h3>
    <ul className="host-card-team__selected" aria-label={`Thẻ đã chọn của Đội ${label}`}>
      {data.selectedCategories.map((category, index) => <li key={`${category}-${index}`}>{category}</li>)}
      {!data.selectedCategories.length && <li className="host-card-team__empty">Chưa có</li>}
    </ul>
  </section>;
}
