'use client';

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

  return <div className="host-actions">
    {started ? <button type="button" className="host-secondary" onClick={() => setEndAction('cancel')}>Hủy trận</button> : <>
      {confirmStart ? <div className="host-confirm" role="group" aria-label="Xác nhận bắt đầu">
        <p>Bắt đầu với {playerCount} người chơi?</p>
        <button type="button" disabled={pending} onClick={confirmStarting}>Xác nhận</button>
        <button type="button" className="host-secondary" onClick={() => setConfirmStart(false)}>Quay lại</button>
      </div> : <button type="button" disabled={pending || playerCount < 6} onClick={requestStart}>CHƠI</button>}
      <button type="button" className="host-secondary" onClick={() => setEndAction('delete')}>Xóa phòng này</button>
    </>}
    {!started && playerCount < 6 && <p className="host-requirement">Cần ít nhất 6 người chơi đang kết nối để bắt đầu.</p>}
    {endAction && <div className="host-confirm" role="group" aria-label="Xác nhận kết thúc phòng">
      <p>{endAction === 'delete' ? 'Xóa phòng và ngắt phiên hiện tại?' : 'Kết thúc trận đấu hiện tại?'}</p>
      <button type="button" disabled={pending} onClick={confirmEnding}>Xác nhận</button>
      <button type="button" className="host-secondary" onClick={() => setEndAction(null)}>Quay lại</button>
    </div>}
  </div>;
}
