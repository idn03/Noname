'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '../../../../components/shared/Button';
import { PressableText } from '../../../../components/shared/PressableText';
import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { useLobbyHostActions } from '../../hooks/use-lobby-host-actions';

interface LobbyHostActionsProps {
  className?: string;
  primaryButtonClassName?: string;
  secondaryButtonClassName?: string;
  secondaryPrefix?: string;
  confirmationButtonClassName?: string;
  started: boolean;
  playerCount: number;
  pending: boolean;
  onStart: (confirmed: boolean) => void;
  onCancel: () => void;
  onDelete: () => void;
}

export function LobbyHostActions(props: LobbyHostActionsProps) {
  const { className = 'mt-6 flex flex-wrap gap-[10px]', primaryButtonClassName = '', secondaryButtonClassName = 'border-current bg-transparent', secondaryPrefix, confirmationButtonClassName = 'py-[6px]', started, playerCount, pending, onStart, onCancel, onDelete } = props;
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

  return <div className={className}>
    {started ? <PressableText className={secondaryButtonClassName} disabled={pending} onClick={() => setEndAction('cancel')}>
      {secondaryPrefix && <span className="font-[var(--font-arial-fallback)] text-[1.3rem] leading-none">{secondaryPrefix}</span>}Hủy trận
    </PressableText> : <>
      {!confirmStart && <Button type="button" className={primaryButtonClassName} disabled={pending || playerCount < 6} onClick={requestStart}>CHƠI</Button>}
      <PressableText className={`inline-flex items-center gap-[10px] ${secondaryButtonClassName}`} onClick={() => setEndAction('delete')}>
        <Trash2 size={20} strokeWidth={1.8} aria-hidden="true" />
        <span>Xóa phòng này</span>
      </PressableText>
    </>}
    {!started && playerCount < 6 && <p className="m-0 flex-[1_1_100%] text-[#aaa] text-[13px]">Cần ít nhất 6 người chơi đang kết nối để bắt đầu.</p>}
    <Dialog open={confirmationOpen && !closingConfirmation} onOpenChange={(open) => { if (!open) closeConfirmation(false); }}>
      {confirmationOpen && <DialogContent
        className="flex w-[min(calc(100vw-48px),440px)] flex-col items-stretch gap-[14px] rounded-lg border-0 bg-[rgb(0_0_0/.3)] p-6 shadow-[0_12px_40px_rgb(0_0_0/.24)]"
        overlayClassName="grid place-items-center bg-[rgb(0_0_0/.58)] p-6"
        aria-describedby="host-confirmation-message"
      >
        <DialogTitle className="sr-only">{confirmationLabel}</DialogTitle>
        <DialogDescription id="host-confirmation-message" className="mb-1 w-full text-white">{confirmationMessage}</DialogDescription>
        <div className="flex w-full gap-[14px] [&>button]:min-h-12 [&>button]:flex-1 [&>button]:text-white [&>button]:font-judson [&>button]:text-base [&>button]:font-bold">
          <Button type="button" variant="mobile" className={confirmationButtonClassName} autoFocus disabled={pending || closingConfirmation} onClick={() => closeConfirmation(true)}>Xác nhận</Button>
          <Button type="button" variant="mobile" className={`border-current bg-transparent ${confirmationButtonClassName}`} disabled={closingConfirmation} onClick={() => closeConfirmation(false)}>Quay lại</Button>
        </div>
      </DialogContent>}
    </Dialog>
  </div>;
}
