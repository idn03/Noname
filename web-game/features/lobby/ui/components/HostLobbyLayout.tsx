import { useLayoutEffect, useRef } from 'react';
import type { LobbyPlayerView } from '@shared/lobby-contract';
import { LobbyHostActions } from '@/features/lobby/ui/components/LobbyHostActions';
import { LobbyPlayerStage } from '@/features/lobby/ui/components/LobbyPlayerStage';

interface HostLobbyLayoutProps {
  players: readonly LobbyPlayerView[];
  connectedPlayers: number;
  connected: boolean;
  pending: boolean;
  error: string;
  started: boolean;
  onStart: (confirmed: boolean) => void;
  onCancel: () => void;
  onDelete: () => void;
}

export function HostLobbyLayout(props: HostLobbyLayoutProps) {
  const { players, connectedPlayers, connected, pending, error, started, onStart, onCancel, onDelete } = props;
  const joinedPlayers = players.filter((player) => !player.isHost);
  const layoutRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    if (!started || !layoutRef.current) return;
    const root = layoutRef.current;
    const rosterNames = new Map([...root.querySelectorAll<HTMLElement>('[data-roster-player-id]')]
      .map((element) => [element.dataset.rosterPlayerId, element]));
    const animations: Animation[] = [];
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    root.querySelectorAll<HTMLElement>('[data-team-player-id]').forEach((target, index) => {
      const source = rosterNames.get(target.dataset.teamPlayerId);
      if (!source) { target.style.opacity = '1'; return; }
      const from = source.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const offsetX = from.left + from.width / 2 - to.left - to.width / 2;
      const offsetY = from.top + from.height / 2 - to.top - to.height / 2;
      const animation = target.animate([
        { transform: `translate(${offsetX}px, ${offsetY}px)`, opacity: 0 },
        { transform: 'translate(0, 0)', opacity: 1 },
      ], { duration: reducedMotion ? 180 : 1000, delay: reducedMotion ? 0 : index * 65, easing: 'cubic-bezier(.22,.7,.2,1)', fill: 'both' });
      animation.onfinish = () => { target.style.opacity = '1'; animation.cancel(); };
      animations.push(animation);
    });

    return () => animations.forEach((animation) => animation.cancel());
  }, [started]);

  const wolfPlayers = joinedPlayers.filter((player) => player.team === 'wolf');
  const sheepPlayers = joinedPlayers.filter((player) => player.team === 'sheep');

  return <section ref={layoutRef} className="grid min-h-dvh w-full max-w-[1920px] grid-cols-[minmax(480px,.95fr)_minmax(380px,.9fr)_minmax(390px,1.45fr)] items-center gap-[clamp(36px,5vw,100px)] mx-auto px-[clamp(36px,4vw,80px)] py-14 text-white font-judson max-[1550px]:grid-cols-[minmax(480px,.95fr)_minmax(340px,1.05fr)] max-[1550px]:gap-12 max-[1550px]:px-10 max-[900px]:grid-cols-1 max-[900px]:gap-9 max-[700px]:px-5 max-[700px]:py-8" aria-label="Phòng chơi của Chủ phòng">
    <aside className="flex flex-col justify-center gap-11 max-[900px]:gap-6">
      <h1 className="m-0 flex flex-col text-white font-judson text-[clamp(90px,8vw,156px)] font-normal leading-[.98] [text-shadow:0_4px_20px_rgb(0_0_0/.2)] max-[900px]:flex-row max-[900px]:gap-[.25em] max-[900px]:text-[clamp(48px,13vw,76px)]" aria-label="Sói và Cừu"><span>SÓI</span><span>VÀ</span><span>CỪU</span></h1>
      <div>
        <LobbyHostActions className="grid gap-[18px] m-0" primaryButtonClassName="w-[min(100%,480px)] min-h-[140px] text-white font-judson text-[60px] leading-none font-bold max-[700px]:min-h-[84px] max-[700px]:text-[42px]" secondaryButtonClassName="w-fit min-h-[42px] border-0 px-0 text-white font-judson text-xl font-bold text-left" confirmationButtonClassName="px-[18px] py-0" started={started} playerCount={connectedPlayers} pending={pending} onStart={onStart} onCancel={onCancel} onDelete={onDelete} />
      </div>
    </aside>

    <section className="min-w-0" aria-labelledby="host-lobby-roster-title">
      <header className="mb-[18px] flex items-end justify-between gap-6 max-[700px]:flex-col max-[700px]:items-start max-[700px]:gap-[10px]">
        <div>
          <h2 id="host-lobby-roster-title" className="m-0 text-white font-judson text-[clamp(30px,2.5vw,44px)] font-bold leading-[1.1] max-[700px]:text-[30px]">Danh sách người chơi</h2>
          <p className="mt-[10px] mb-0 text-white/82 font-judson text-lg leading-[1.4] max-[700px]:text-[15px]">{joinedPlayers.length}/10 người chơi đã tham gia · {connectedPlayers} đang kết nối</p>
        </div>
        <span className="shrink-0 mb-1 text-white text-[13px]" role="status">{connected ? 'Đã kết nối' : 'Đang kết nối lại'}</span>
      </header>
      <div className="min-h-[620px] overflow-hidden rounded-xl bg-[rgb(141_141_141/.34)] max-[1550px]:min-h-[540px] max-[700px]:min-h-[440px]">
        <LobbyPlayerStage players={players} started={started} canSeeAllTeams />
      </div>
      {error && <p className="my-[14px] text-[#ffb6bd] text-[14px]" role="alert">{error}</p>}
    </section>

    <aside className={`flex min-h-[620px] flex-col justify-start gap-[clamp(130px,22vh,250px)] pt-[70px] ${started ? 'visible' : 'invisible'} max-[1550px]:col-start-2 max-[1550px]:min-h-0 max-[1550px]:flex-row max-[1550px]:justify-between max-[1550px]:gap-6 max-[1550px]:pt-[10px] max-[900px]:col-start-1 max-[700px]:min-h-0 max-[700px]:gap-[18px]`} aria-label="Hai đội trong trận đấu" aria-hidden={!started}>
      <div className={`flex flex-1 flex-col items-start gap-[14px] text-[#080607] max-[700px]:gap-[10px] ${started ? 'animate-[host-lobby-team-fade-in_520ms_ease-out_both] motion-reduce:[animation-duration:180ms]' : ''}`}>
        <div className="flex items-center gap-5 max-[1550px]:gap-3 max-[700px]:gap-2"><img className="h-[clamp(58px,5vw,86px)] w-[clamp(48px,4.4vw,76px)] object-contain max-[700px]:h-[50px] max-[700px]:w-[40px]" src="/assets/teams/wolf-icon.svg" alt="" /><h2 className="m-0 font-judson text-[clamp(38px,3vw,56px)] font-bold leading-none max-[1550px]:text-[clamp(30px,4vw,44px)] max-[700px]:text-[26px]">Đội Sói:</h2></div>
        {started && <ul className="m-0 grid gap-[10px] list-none p-0 pl-24 text-white font-judson text-[20px] leading-[1.25] max-[1550px]:pl-[60px] max-[1550px]:text-[18px] max-[700px]:pl-12 max-[700px]:text-[16px]" aria-label="Người chơi đội Sói">
          {wolfPlayers.map((player) => <li className="opacity-0" key={player.id} data-team-player-id={player.id}>{player.name}</li>)}
        </ul>}
      </div>
      <div className={`flex flex-1 flex-col items-start gap-[14px] text-white max-[700px]:gap-[10px] ${started ? 'animate-[host-lobby-team-fade-in_520ms_ease-out_both] [animation-delay:100ms] motion-reduce:[animation-duration:180ms]' : ''}`}>
        <div className="flex items-center gap-5 max-[1550px]:gap-3 max-[700px]:gap-2"><img className="h-[clamp(58px,5vw,86px)] w-[clamp(48px,4.4vw,76px)] object-contain max-[700px]:h-[50px] max-[700px]:w-[40px]" src="/assets/teams/sheep-icon.svg" alt="" /><h2 className="m-0 font-judson text-[clamp(38px,3vw,56px)] font-bold leading-none max-[1550px]:text-[clamp(30px,4vw,44px)] max-[700px]:text-[26px]">Đội Cừu:</h2></div>
        {started && <ul className="m-0 grid gap-[10px] list-none p-0 pl-24 text-white font-judson text-[20px] leading-[1.25] max-[1550px]:pl-[60px] max-[1550px]:text-[18px] max-[700px]:pl-12 max-[700px]:text-[16px]" aria-label="Người chơi đội Cừu">
          {sheepPlayers.map((player) => <li className="opacity-0" key={player.id} data-team-player-id={player.id}>{player.name}</li>)}
        </ul>}
      </div>
    </aside>
  </section>;
}
