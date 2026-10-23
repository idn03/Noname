'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '../../../../components/shared/Button';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { useLobbyHostActions } from '../../hooks/use-lobby-host-actions';

interface LobbyHostActionsProps {
  started: boolean;
  playerCount: number;
  pending: boolean;
  onStart: (confirmed: boolean) => void;
  onCancel: () => void;
  onDelete: () => void;
}

export function LobbyHostActions(props: LobbyHostActionsProps) {
  const { started, playerCount, pending, onStart, onCancel, onDelete } = props;
  const { confirmStart, endAction, setConfirmStart, setEndAction, requestStart, confirmStarting, confirmEnding } =
    useLobbyHostActions(started, playerCount, onStart, onCancel, onDelete);
  const [portalReady, setPortalReady] = useState(false);

  useEffect(() => setPortalReady(true), []);

  return <div className="host-actions">
    {started ? <Button type="button" className="host-secondary" onClick={() => setEndAction('cancel')}>Hủy trận</Button> : <>
      {confirmStart ? <div className="host-confirm" role="group" aria-label="Xác nhận bắt đầu">
        <p>Bắt đầu với {playerCount} người chơi?</p>
        <Button type="button" disabled={pending} onClick={confirmStarting}>Xác nhận</Button>
        <Button type="button" className="host-secondary" onClick={() => setConfirmStart(false)}>Quay lại</Button>
      </div> : <Button type="button" disabled={pending || playerCount < 6} onClick={requestStart}>CHƠI</Button>}
      <Button type="button" className="host-secondary host-delete-room" onClick={() => setEndAction('delete')}>
        <Trash2 size={20} strokeWidth={1.8} aria-hidden="true" />
        <span>Xóa phòng này</span>
      </Button>
    </>}
    {!started && playerCount < 6 && <p className="host-requirement">Cần ít nhất 6 người chơi đang kết nối để bắt đầu.</p>}
    {endAction && portalReady && createPortal(<div className="host-confirm-overlay">
      <div className="host-confirm host-confirm-modal" role="alertdialog" aria-modal="true" aria-label="Xác nhận kết thúc phòng">
        <p>{endAction === 'delete' ? 'Xóa phòng và ngắt phiên hiện tại?' : 'Kết thúc trận đấu hiện tại?'}</p>
        <Button type="button" disabled={pending} onClick={confirmEnding}>Xác nhận</Button>
        <Button type="button" className="host-secondary" onClick={() => setEndAction(null)}>Quay lại</Button>
      </div>
    </div>, document.body)}
  </div>;
}
