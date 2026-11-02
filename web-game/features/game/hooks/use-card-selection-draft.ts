'use client';

import { useEffect, useState } from 'react';
import type { PlayerCardSelectionView } from '../../../../shared/card-selection-contract';

export interface CardSelectionDraft {
  categoryId: string;
  challengeId?: string;
}

export function useCardSelectionDraft(selection: PlayerCardSelectionView) {
  const categoryId = selection.ownCard?.categoryId ?? '';
  const challengeId = selection.ownCard?.challengeId;
  const submitted = selection.ownCard?.submitted ?? false;
  const [draft, setDraft] = useState<CardSelectionDraft | undefined>(() => toDraft(categoryId, challengeId));

  useEffect(() => {
    setDraft(toDraft(categoryId, challengeId));
  }, [categoryId, challengeId, submitted]);

  const resetDraft = () => setDraft(toDraft(categoryId, challengeId));
  const selectCategory = (nextCategoryId: string) => setDraft({ categoryId: nextCategoryId });
  const selectChallenge = (nextCategoryId: string, nextChallengeId: string) => {
    setDraft({ categoryId: nextCategoryId, challengeId: nextChallengeId });
  };

  return { draft, setDraft, resetDraft, selectCategory, selectChallenge };
}

function toDraft(categoryId: string, challengeId?: string): CardSelectionDraft | undefined {
  return categoryId ? { categoryId, ...(challengeId ? { challengeId } : {}) } : undefined;
}
