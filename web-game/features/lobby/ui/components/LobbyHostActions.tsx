'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '../../../../components/shared/Button';
import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
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
  const { confirmStart, setConfirmStart, requestStart } = useLobbyHostActions(playerCount, onStart);
  const [closingConfirmation, setClosingConfirmation] = useState(false);
  const [endAction, setEndAction] = useState<'cancel' | 'delete' | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const confirmationOpen = confirmStart || endAction !== null;
  const confirmationMessage = confirmStart
    ? `Bắt đầu với ${playerCount} người chơi?`
    : endAction === 'delete' ? 'Xóa phòng và ngắt phiên hiện tại?' : 'Kết thúc trận đấu hiện tại?';
  const confirmationLabel = confirmStart ? 'Xác nhận bắt đầu' : 'Xác nhận kết thúc phòng';
  const closeConfirmation = (accept: boolean) => {
    if (closingConfirmation) return;
    setClosingConfirmation(true);
    closeTimer.current = setTimeout(() => {
      closeTimer.current = null;
      const action = endAction;
      setConfirmStart(false);
      setEndAction(null);
      setClosingConfirmation(false);
      if (!accept) return;
      if (confirmStart) onStart(true);
      else if (action === 'delete') onDelete();
      else if (action === 'cancel') onCancel();
    }, 180);
  };

  useEffect(() => {
    return () => { if (closeTimer.current) clearTimeout(closeTimer.current); };
  }, []);

  return <div className="host-actions">
    {started ? <Button type="button" className="host-secondary" disabled={pending} onClick={() => setEndAction('cancel')}>Hủy trận</Button> : <>
      {!confirmStart && <Button type="button" disabled={pending || playerCount < 6} onClick={requestStart}>CHƠI</Button>}
      <Button type="button" className="host-secondary host-delete-room" onClick={() => setEndAction('delete')}>
        <Trash2 size={20} strokeWidth={1.8} aria-hidden="true" />
        <span>Xóa phòng này</span>
      </Button>
    </>}
    {!started && playerCount < 6 && <p className="host-requirement">Cần ít nhất 6 người chơi đang kết nối để bắt đầu.</p>}
    <Dialog open={confirmationOpen} onOpenChange={(open) => { if (!open) closeConfirmation(false); }}>
      {confirmationOpen && <DialogContent
        className={`host-confirm-modal ${closingConfirmation ? 'host-confirm-modal--closing' : ''}`}
        overlayClassName={`host-confirm-overlay ${closingConfirmation ? 'host-confirm-overlay--closing' : ''}`}
        aria-describedby="host-confirmation-message"
      >
        <DialogTitle className="sr-only">{confirmationLabel}</DialogTitle>
        <DialogDescription id="host-confirmation-message" className="host-confirm-message">{confirmationMessage}</DialogDescription>
        <div className="host-confirm-actions">
          <Button type="button" size="mobile" autoFocus disabled={pending || closingConfirmation} onClick={() => closeConfirmation(true)}>Xác nhận</Button>
          <Button type="button" size="mobile" className="host-secondary" disabled={closingConfirmation} onClick={() => closeConfirmation(false)}>Quay lại</Button>
        </div>
      </DialogContent>}
    </Dialog>
  </div>;
}
