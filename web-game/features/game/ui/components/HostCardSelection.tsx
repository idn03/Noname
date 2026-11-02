'use client';

import type { HostCardSelectionView } from '../../../../../shared/card-selection-contract';
import { useSelectionCountdown, formatSelectionTime } from '../../hooks/use-selection-countdown';

export function HostCardSelection({ selection }: { selection: HostCardSelectionView }) {
  const remainingMs = useSelectionCountdown(selection.remainingMs);
  return <main className="card-selection-screen card-selection-screen--host" aria-labelledby="card-selection-title">
    <header className="card-selection-heading">
      <p className="card-selection-eyebrow">VÒNG CHỌN THẺ</p>
      <div className="card-selection-title-row"><div><h1 id="card-selection-title">Tiến độ hai đội</h1><p>Chờ người chơi gửi đủ lựa chọn</p></div>
        <time className="card-selection-clock">{formatSelectionTime(remainingMs)}</time>
      </div>
    </header>
    <div className="card-selection-team-progress">
      {(['wolf', 'sheep'] as const).map((team) => {
        const label = team === 'wolf' ? 'Sói' : 'Cừu';
        const group = selection.teams[team];
        return <section className={`card-selection-team card-selection-team--${team}`} key={team} aria-labelledby={`team-${team}`}>
          <header><img src={`/assets/teams/${team}-icon.svg`} alt="" /><h2 id={`team-${team}`}>Đội {label}</h2>
            <span>{group.ready}/{group.total} thẻ</span></header>
          <ul>{group.players.map((player) => <li key={player.id} className={player.ready ? 'is-ready' : ''}>
            <span>{player.name}</span><span>{!player.hasCardSlot ? 'Không có thẻ' : player.ready ? 'Đã gửi' : 'Đang chọn'}</span>
          </li>)}</ul>
        </section>;
      })}
    </div>
    <p className="card-selection-host-note">Lựa chọn riêng tư của người chơi không hiển thị ở màn hình này.</p>
  </main>;
}
