import type { LobbyPlayerView } from '../../../../../shared/lobby-contract';
import { useLobbyPlayerStage } from '../../hooks/use-lobby-player-stage';

interface LobbyPlayerStageProps {
  players: readonly LobbyPlayerView[];
  started: boolean;
  canSeeAllTeams: boolean;
}

export function LobbyPlayerStage({ players, started, canSeeAllTeams }: LobbyPlayerStageProps) {
  const { wolfTeam, sheepTeam, tokens } = useLobbyPlayerStage(players, started, canSeeAllTeams);
  const stageClassName = canSeeAllTeams
    ? 'min-h-[620px] border-0 rounded-[inherit] bg-transparent max-[1550px]:min-h-[540px] max-[700px]:min-h-[440px]'
    : 'min-h-[400px] border border-[var(--gray)] rounded-lg bg-[rgb(0_0_0/.15)] max-[700px]:min-h-[420px]';

  return <div className={`lobby-stage relative overflow-hidden ${stageClassName} ${started ? 'lobby-stage--assigned' : ''}`} role="group" aria-label={started ? 'Người chơi sau khi chia đội' : 'Người chơi đang chờ chia đội'}>
    {started && !canSeeAllTeams && <div className="absolute inset-0" aria-hidden="true">
      <section className="absolute inset-y-0 left-0 flex w-1/2 justify-center border-r border-[rgb(141_141_141/.7)] bg-[rgb(0_0_0/.1)] px-[14px] py-[22px] max-[700px]:px-2 max-[700px]:py-[14px]"><h3 className="m-0 flex items-center gap-2 text-white font-judson text-xl font-bold max-[700px]:gap-[5px] max-[700px]:text-base"><img className="size-9 object-contain max-[700px]:size-7" src="/assets/teams/wolf-icon.svg" alt="" />Đội Sói</h3></section>
      <section className="absolute inset-y-0 right-0 flex w-1/2 justify-center bg-[rgb(255_255_255/.04)] px-[14px] py-[22px] max-[700px]:px-2 max-[700px]:py-[14px]"><h3 className="m-0 flex items-center gap-2 text-white font-judson text-xl font-bold max-[700px]:gap-[5px] max-[700px]:text-base"><img className="size-9 object-contain max-[700px]:size-7" src="/assets/teams/sheep-icon.svg" alt="" />Đội Cừu</h3></section>
    </div>}
    <ul className="lobby-player-tokens absolute inset-0 z-[1] m-0 list-none p-0" aria-hidden={started && canSeeAllTeams}>
      {tokens.map(({ player, style }, index) => <li className={`lobby-player-token absolute flex w-max items-center overflow-hidden text-white font-judson text-ellipsis whitespace-nowrap ${canSeeAllTeams ? 'min-h-[40px] max-w-[46%] gap-2 border-0 bg-transparent px-2 py-1 text-lg [transform:translate(-50%,-50%)!important] [transition:opacity_420ms_ease-out] motion-reduce:[transition-duration:180ms] max-[700px]:max-w-[46%] max-[700px]:gap-2 max-[700px]:px-2 max-[700px]:py-1 max-[700px]:text-lg' : 'min-h-0 max-w-[46%] gap-2 border border-white/65 border-b-0 rounded-md bg-[rgb(0_0_0/.7)] px-3 py-2 text-base leading-[1.2] [transition:left_1.35s_cubic-bezier(.17,.72,.25,1),top_1.35s_cubic-bezier(.17,.72,.25,1),transform_1.35s_cubic-bezier(.17,.72,.25,1),opacity_.4s_ease] motion-reduce:transition-none max-[700px]:gap-[5px] max-[700px]:max-w-[47%] max-[700px]:px-2 max-[700px]:py-[7px] max-[700px]:text-[13px]'} ${canSeeAllTeams && started ? 'opacity-0 pointer-events-none [transition-delay:0ms!important]' : ''} ${started ? 'shadow-[0_3px_12px_rgb(0_0_0/.25)]' : ''} ${player.connected ? '' : 'opacity-[.55]'}`} data-roster-player-id={player.id} key={player.id} style={style}>
        <span className="sr-only">{player.team ? `Đội ${player.team === 'wolf' ? 'Sói' : 'Cừu'}: ` : ''}</span>
        <span className="lobby-player-order text-[22px] opacity-[.82]" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <span className={`${canSeeAllTeams ? 'hidden' : 'inline-block size-[9px] flex-[0_0_9px] rounded-full border border-[#888]'} ${player.connected && !canSeeAllTeams ? 'border-[#b85c66] bg-[#b85c66]' : ''}`} aria-hidden="true" />
        <span>{player.name}</span>
      </li>)}
    </ul>
  </div>;
}
