import type { FormEventHandler } from 'react';
import { flyFromRight } from '../home-entrance';
import LobbyNameForm from './LobbyNameForm';

interface PlayerJoinPanelProps {
  name: string;
  error: string;
  disabled: boolean;
  waitingForRoom: boolean;
  isStartedGuest: boolean;
  onNameChange: (name: string) => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export function PlayerJoinPanel({ name, error, disabled, waitingForRoom, isStartedGuest, onNameChange, onSubmit }: PlayerJoinPanelProps) {
  return <div className="min-w-0 self-auto my-0 mt-[clamp(40px,11vh,112px)] max-[700px]:mt-2">
    <p className={`${flyFromRight} [--enter-delay:1160ms] m-0 mb-7 text-white font-type-body text-subtitle font-normal leading-[1.4]`}>Hãy để màn đêm định đoạt tất cả</p>
    <div className={`${flyFromRight} [--enter-delay:1320ms]`}>
      <LobbyNameForm label="Tên hiển thị" action="Tham gia phòng" pendingAction="Đang tham gia…" name={name} error={error} disabled={disabled} onNameChange={onNameChange} onSubmit={onSubmit} />
      {isStartedGuest && <p className="m-0 mt-1 ml-2 text-[#aaa] font-type-body text-content" role="status">Ván chơi đã bắt đầu và không nhận thêm người chơi mới.</p>}
      {waitingForRoom && <p className="m-0 mt-1 ml-2 text-[#aaa] font-type-body text-content" role="status">Đang chờ Chủ phòng tạo phòng trên máy chủ.</p>}
    </div>
  </div>;
}
