'use client';

import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from 'react';
import { Button } from '../../../../components/shared/Button';

interface HostHomeActionsProps {
  connected: boolean;
  pending: boolean;
  error: string;
  onCreate: () => void;
  onCreateSandbox: () => void;
}

export function HostHomeActions({ connected, pending, error, onCreate, onCreateSandbox }: HostHomeActionsProps) {
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heldForSandbox = useRef(false);

  const clearHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = null;
  };
  const beginHold = () => {
    clearHold();
    heldForSandbox.current = false;
    if (!connected || pending) return;
    holdTimer.current = setTimeout(() => {
      holdTimer.current = null;
      heldForSandbox.current = true;
      onCreateSandbox();
    }, 3000);
  };
  const finishKeyboardHold = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    clearHold();
    if (!heldForSandbox.current) onCreate();
    heldForSandbox.current = false;
  };
  const finishPointerHold = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button === 0) clearHold();
  };

  useEffect(() => {
    if (!connected || pending) clearHold();
    return clearHold;
  }, [connected, pending]);

  return <div className="grid grid-cols-2 items-start gap-x-[clamp(28px,4vw,72px)] gap-y-[30px] mt-[30px] max-[700px]:grid-cols-1 max-[700px]:gap-[26px] max-[700px]:mt-0">
    <section className="row-start-1 col-start-1 max-[700px]:row-auto" aria-labelledby="rules-heading">
      <h2 id="rules-heading" className="m-0 text-white font-type-section-title text-heading4 font-bold leading-[1.15]">Luật chơi:</h2>
      <ul className="mt-3 mb-0 pl-5 text-white font-type-body text-subtitle leading-[1.8] [&>li+li]:mt-2">
        <li>• Tất cả người chơi (ngoại trừ chủ phòng) sẽ được chia thành 2 đội: <strong>Cừu</strong> và <strong>Sói</strong></li>
        <li>• Mỗi đội sẽ chọn những thẻ bài và thực hiện các thử thách tương ứng để lấy điểm</li>
        <li>• Đội có số điểm lớn hơn ở cuối trận đấu sẽ là đội chiến thắng</li>
      </ul>
    </section>
    <section className="row-start-2 col-start-1 max-[700px]:row-auto" aria-labelledby="sheep-rule-heading">
      <div className="flex items-center gap-[14px] min-h-[60px]"><img className="size-[60px] object-contain" src="/assets/teams/sheep-icon.svg" alt="" /><h2 id="sheep-rule-heading" className="m-0 text-white font-type-section-title text-heading4 font-bold leading-[1.15]">Đội Cừu:</h2></div>
      <p className="mt-5 mb-0 ml-[30px] text-white font-type-body text-subtitle leading-[1.9]">Đoán các thẻ mà <strong>Đội Sói</strong> chọn để chọn những thẻ phòng thủ phù hợp. Khi đối phương tấn công, nếu Đội Cừu có các thẻ tương ứng sẽ cho phép lật và phòng thủ. Để phòng thủ thành công tuyệt đối, Cừu cần phải thực hiện thành công thử thách được mô tả trong thẻ.</p>
    </section>
    <section className="row-start-2 col-start-2 max-[700px]:row-auto max-[700px]:col-auto" aria-labelledby="wolf-rule-heading">
      <div className="flex items-center gap-[14px] min-h-[60px]"><img className="size-[60px] object-contain" src="/assets/teams/wolf-icon.svg" alt="" /><h2 id="wolf-rule-heading" className="m-0 text-[#080607] font-type-section-title text-heading4 font-bold leading-[1.15]">Đội Sói:</h2></div>
      <p className="mt-5 mb-0 ml-[30px] text-[#080607] font-type-body text-subtitle leading-[1.9]">Đội của bạn sẽ chọn các thẻ và thử thách mà trò chơi cung cấp. Khi bắt đầu lượt, lật 1 thẻ đã chọn để tấn công, lượt tấn công thành công là khi <strong>Đội Cừu</strong> không có thẻ cùng loại để phòng thủ hoặc không hoàn thành thử thách. Nếu tấn công thành công, đội của bạn sẽ được cộng điểm và bắt cóc một chú <strong>Cừu</strong>.</p>
    </section>
    <div className="row-start-3 col-span-2 mx-auto mt-[140px] w-full max-w-[480px] text-center max-[700px]:row-auto max-[700px]:col-auto">
      <Button
        className="min-h-[140px] w-full max-w-[480px] text-white font-type-display text-heading3 font-bold leading-none max-[700px]:min-h-[78px] max-[700px]:text-heading4"
        type="button"
        disabled={!connected || pending}
        aria-describedby="host-create-note"
        onPointerDown={(event) => { if (event.button === 0) beginHold(); }}
        onPointerUp={finishPointerHold}
        onPointerCancel={() => { clearHold(); heldForSandbox.current = false; }}
        onPointerLeave={clearHold}
        onClick={() => {
          if (heldForSandbox.current) { heldForSandbox.current = false; return; }
          onCreate();
        }}
        onKeyDown={(event) => {
          if ((event.key === 'Enter' || event.key === ' ') && !event.repeat) {
            event.preventDefault();
            beginHold();
          }
        }}
        onKeyUp={finishKeyboardHold}
        onBlur={clearHold}
        onContextMenu={(event) => event.preventDefault()}
      >{pending ? 'ĐANG TẠO…' : 'TẠO'}</Button>
      <p id="host-create-note" className="mt-3 text-white font-type-body text-content leading-[1.4]">Tạo phòng trên máy chủ này và tham gia với tư cách Host.</p>
      {error && <p className="my-[14px] text-[#ffb6bd] text-content" role="alert">{error}</p>}
    </div>
  </div>;
}
