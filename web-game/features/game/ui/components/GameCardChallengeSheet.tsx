'use client';

import { useId } from 'react';
import { Check } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

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
  onClear: () => void;
}

export function GameCardChallengeSheet({
  open, categoryName, challenges, selectedId, onOpenChange, onChoose, onClear,
}: GameCardChallengeSheetProps) {
  const descriptionId = useId();
  return <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent side="bottom" className="game-card-sheet" aria-describedby={descriptionId}>
      <SheetHeader className="game-card-sheet__header">
        <SheetTitle className="game-card-sheet__title">Chọn thử thách</SheetTitle>
        <SheetDescription id={descriptionId} className="game-card-sheet__description">
          {categoryName} · {challenges.length} thử thách
        </SheetDescription>
      </SheetHeader>
      <div className="game-card-sheet__list">
        {challenges.map((challenge, index) => {
          const isSelected = selectedId === challenge.id;
          return <button
            className={`game-card-sheet__option${isSelected ? ' is-selected' : ''}`}
            data-selected={isSelected}
            type="button"
            aria-pressed={isSelected}
            key={challenge.id}
            onClick={() => isSelected ? onClear() : onChoose(challenge)}
          >
            <span className="game-card-sheet__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <span>{challenge.text}</span>
            <span className="game-card-sheet__selection-state">
              {isSelected && <><Check className="game-card-sheet__check" aria-hidden="true" /><span>ĐÃ CHỌN</span></>}
            </span>
          </button>;
        })}
        {!challenges.length && <p className="game-card-sheet__empty">Chưa có thử thách trong danh mục này.</p>}
      </div>
    </SheetContent>
  </Sheet>;
}
