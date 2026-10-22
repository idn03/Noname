'use client';

import { useState } from 'react';

interface LobbyHostActionsProps {
  started: boolean;
  playerCount: number;
  pending: boolean;
  onStart: (confirmed: boolean) => void;
  onCancel: () => void;
  onDelete: () => void;
}

export function LobbyHostActions(props: LobbyHostActionsProps) {
  const [confirmStart, setConfirmStart] = useState(false);
  const [endAction, setEndAction] = useState<'cancel' | 'delete' | null>(null);
  const { started, playerCount, pending } = props;

  return <div className="host-actions">
    {started ? <button type="button" className="host-secondary" onClick={() => setEndAction('cancel')}>Hủy trận</button> : <>
      {confirmStart ? <div className="host-confirm" role="group" aria-label="Xác nhận bắt đầu">
        <p>Bắt đầu với {playerCount} người chơi?</p>
        <button type="button" disabled={pending} onClick={() => { props.onStart(true); setConfirmStart(false); }}>Xác nhận</button>
        <button type="button" className="host-secondary" onClick={() => setConfirmStart(false)}>Quay lại</button>
      </div> : <button type="button" disabled={pending || playerCount < 6} onClick={() => {
        if (playerCount < 10) setConfirmStart(true);
        else props.onStart(false);
      }}>CHƠI</button>}
      <button type="button" className="host-secondary" onClick={() => setEndAction('delete')}>Xóa phòng này</button>
    </>}
    {!started && playerCount < 6 && <p className="host-requirement">Cần ít nhất 6 người chơi đang kết nối để bắt đầu.</p>}
    {endAction && <div className="host-confirm" role="group" aria-label="Xác nhận kết thúc phòng">
      <p>{endAction === 'delete' ? 'Xóa phòng và ngắt phiên hiện tại?' : 'Kết thúc trận đấu hiện tại?'}</p>
      <button type="button" disabled={pending} onClick={() => {
        if (endAction === 'delete') props.onDelete(); else props.onCancel();
        setEndAction(null);
      }}>Xác nhận</button>
      <button type="button" className="host-secondary" onClick={() => setEndAction(null)}>Quay lại</button>
    </div>}
  </div>;
}
