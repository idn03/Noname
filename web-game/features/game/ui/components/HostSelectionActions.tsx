'use client';

import { History, RotateCcw } from 'lucide-react';
import { LobbyHostActions } from '@/features/lobby/ui/components/LobbyHostActions';

interface HostSelectionActionsProps {
  playerCount: number;
  pending: boolean;
  onCancel: () => void;
  onStart: (confirmed: boolean) => void;
  onDelete: () => void;
}

export function HostSelectionActions(props: HostSelectionActionsProps) {
  return <nav className="host-selection-actions" aria-label="Điều khiển trận đấu">
    <button type="button" disabled title="Tính năng chưa khả dụng">
      <History aria-hidden="true" /><span>Xem lịch sử giao đấu</span>
    </button>
    <LobbyHostActions started playerCount={props.playerCount} pending={props.pending}
      onStart={props.onStart} onCancel={props.onCancel} onDelete={props.onDelete} />
    <button type="button" disabled title="Tính năng chưa khả dụng">
      <RotateCcw aria-hidden="true" /><span>Làm lại trận</span>
    </button>
  </nav>;
}
