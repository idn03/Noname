'use client';

import { useState } from 'react';
import type { PlayerCardSelectionView } from '../../../../../shared/card-selection-contract';
import { RuneField } from '../../../../components/shared/RuneField';
import { PlayerCardSelection } from '../components/PlayerCardSelection';

const INITIAL_SELECTION: PlayerCardSelectionView = {
  phase: 'selection',
  team: 'sheep',
  hasCardSlot: true,
  categories: [
    { id: 'music', name: 'Âm nhạc', challengeCount: 3 },
    { id: 'travel', name: 'Du lịch', challengeCount: 2 },
    { id: 'geography', name: 'Địa lý', challengeCount: 4 },
    { id: 'folklore', name: 'Dân Gian', challengeCount: 3 },
  ],
  score: 2,
  teamMembers: [
    { id: 'sheep-1', name: 'Minh Anh' },
    { id: 'sheep-2', name: 'Quốc Bảo' },
    { id: 'sheep-3', name: 'Linh Chi' },
  ],
  readiness: { wolf: { ready: 1, total: 3 }, sheep: { ready: 1, total: 3 } },
  remainingMs: 180_000,
};

export function SheepSelectionPreview() {
  const [selection, setSelection] = useState(INITIAL_SELECTION);

  function submit(draft: { categoryId: string; challengeId?: string }) {
    setSelection((current) => ({ ...current, ownCard: { ...draft, submitted: true } }));
  }

  function remove() {
    setSelection((current) => ({ ...current, ownCard: undefined }));
  }

  return <div className="relative mx-auto flex min-h-svh w-[min(100%,402px)] justify-center overflow-x-hidden overflow-y-auto rounded-[var(--radius-surface)] bg-[linear-gradient(180deg,#722f37_0%,#57272d_54%,#080607_100%)]">
    <RuneField density="player" />
    <PlayerCardSelection selection={selection} connected pending={false} error="" onSubmit={submit} onRemove={remove} />
  </div>;
}
