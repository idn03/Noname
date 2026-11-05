'use client';

import { useState } from 'react';
import type { PlayerCardSelectionView } from '../../../../../shared/card-selection-contract';
import { RuneField } from '../../../../components/shared/RuneField';
import { PlayerCardSelection } from '../components/PlayerCardSelection';

const INITIAL_SELECTION: PlayerCardSelectionView = {
  phase: 'selection',
  team: 'wolf',
  hasCardSlot: true,
  categories: [
    { id: 'music', name: 'Âm nhạc', challengeCount: 3, challenges: [
      { id: 'music-1', text: 'Hát một đoạn bài hát có nhắc đến mưa.' },
      { id: 'music-2', text: 'Huýt sáo giai điệu của một ca khúc quen thuộc.' },
      { id: 'music-3', text: 'Kể tên ba nhạc cụ có dây.' },
    ] },
    { id: 'travel', name: 'Du lịch', challengeCount: 2, challenges: [
      { id: 'travel-1', text: 'Mô tả một chuyến đi đáng nhớ mà không nói tên địa điểm.' },
      { id: 'travel-2', text: 'Kể tên ba món đồ cần mang theo khi đi cắm trại.' },
    ] },
    { id: 'films', name: 'Điện ảnh', challengeCount: 2, challenges: [
      { id: 'films-1', text: 'Diễn tả một bộ phim chỉ bằng hành động.' },
      { id: 'films-2', text: 'Kể tên một nhân vật hoạt hình có siêu năng lực.' },
    ] },
    { id: 'geography', name: 'Địa lý', challengeCount: 2, challenges: [
      { id: 'geography-1', text: 'Kể tên ba quốc gia có đường bờ biển.' },
      { id: 'geography-2', text: 'Mô tả một kiểu địa hình mà không gọi tên.' },
    ] },
  ],
  score: 2,
  teamMembers: [
    { id: 'wolf-1', name: 'Minh Anh' },
    { id: 'wolf-2', name: 'Quốc Bảo' },
    { id: 'wolf-3', name: 'Linh Chi' },
  ],
  readiness: { wolf: { ready: 1, total: 3 }, sheep: { ready: 0, total: 3 } },
  remainingMs: 180_000,
};

export function WolfSelectionPreview() {
  const [selection, setSelection] = useState(INITIAL_SELECTION);

  function submit(draft: { categoryId: string; challengeId?: string }) {
    setSelection((current) => ({ ...current, ownCard: { ...draft, submitted: true } }));
  }

  function remove() {
    setSelection((current) => ({ ...current, ownCard: undefined }));
  }

  return <div className="relative mx-auto flex min-h-svh w-[min(100%,402px)] justify-center overflow-x-hidden overflow-y-auto bg-[linear-gradient(180deg,#722f37_0%,#57272d_54%,#080607_100%)]">
    <RuneField />
    <PlayerCardSelection selection={selection} connected pending={false} error="" onSubmit={submit} onRemove={remove} />
  </div>;
}
