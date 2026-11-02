'use client';

import { useId } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '../../../../components/ui/sheet';

export interface GameCardChallenge {
  id: string;
  text: string;
}

interface GameCardChallengeSheetProps {
  open: boolean;
  categoryName: string;
  challenges: readonly GameCardChallenge[];
  selectedId?: string;
  onOpenChange: (open: boolean) => void;
  onChoose: (challenge: GameCardChallenge) => void;
}

export function GameCardChallengeSheet({
  open, categoryName, challenges, selectedId, onOpenChange, onChoose,
}: GameCardChallengeSheetProps) {
  const descriptionId = useId();
  return <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent className="game-card-sheet" aria-describedby={descriptionId}>
      <SheetTitle className="game-card-sheet__title">Chọn thử thách</SheetTitle>
      <SheetDescription id={descriptionId} className="game-card-sheet__description">
        {categoryName} · {challenges.length} thử thách
      </SheetDescription>
      <div className="game-card-sheet__list">
        {challenges.map((challenge, index) => <button
          className={`game-card-sheet__option${selectedId === challenge.id ? ' is-selected' : ''}`}
          type="button"
          aria-pressed={selectedId === challenge.id}
          key={challenge.id}
          onClick={() => onChoose(challenge)}
        >
          <span className="game-card-sheet__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <span>{challenge.text}</span>
        </button>)}
        {!challenges.length && <p className="game-card-sheet__empty">Chưa có thử thách trong danh mục này.</p>}
      </div>
    </SheetContent>
  </Sheet>;
}
