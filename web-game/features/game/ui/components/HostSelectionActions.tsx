'use client';

import { History, RotateCcw } from 'lucide-react';
import { LobbyHostActions } from '@/features/lobby/ui/components/LobbyHostActions';

interface HostSelectionActionsProps {
  playerCount: number;
  pending: boolean;
  onCancel: () => void;
  onStart: (confirmed: boolean) => void;
  onDelete: () => void;
  compact?: boolean;
}

export function HostSelectionActions(props: HostSelectionActionsProps) {
  const actionButtonClasses = 'inline-flex min-h-[2.7rem] items-center gap-[.4rem] border-0 rounded-none bg-transparent px-[.55rem] py-[.35rem] text-white font-type-body text-[.85rem] leading-none font-bold whitespace-nowrap disabled:!cursor-not-allowed disabled:!opacity-[.85] focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 [&_svg]:size-[1.35rem] max-[760px]:gap-[.25rem] max-[760px]:px-[.2rem] max-[760px]:text-[.68rem] max-[760px]:[&_svg]:size-4 max-[760px]:[&_span]:max-w-[4.4rem] max-[760px]:[&_span]:whitespace-normal';
  return <nav className="fixed bottom-[clamp(3rem,6vh,4.5rem)] left-[clamp(1rem,2.6vw,3rem)] z-20 flex items-center gap-[clamp(1rem,3vw,3.5rem)] max-[760px]:right-[4.8rem] max-[760px]:bottom-[max(3rem,calc(env(safe-area-inset-bottom)+2rem))] max-[760px]:left-2 max-[760px]:justify-between max-[760px]:gap-[.1rem]" aria-label="Điều khiển trận đấu">
    {!props.compact && <button className={actionButtonClasses} type="button" disabled title="Tính năng chưa khả dụng">
      <History aria-hidden="true" /><span>Xem lịch sử giao đấu</span>
    </button>}
    <LobbyHostActions className="m-0 flex flex-wrap gap-[.4rem]" secondaryButtonClassName={`${actionButtonClasses} max-[760px]:gap-[.25rem]`} secondaryPrefix={props.compact ? undefined : '⊗'} started playerCount={props.playerCount} pending={props.pending}
      onStart={props.onStart} onCancel={props.onCancel} onDelete={props.onDelete} />
    {!props.compact && <button className={actionButtonClasses} type="button" disabled title="Tính năng chưa khả dụng">
      <RotateCcw aria-hidden="true" /><span>Làm lại trận</span>
    </button>}
  </nav>;
}
