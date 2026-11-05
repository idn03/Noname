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
    <SheetContent side="bottom" className="gap-0 border-b-0 pt-2 pr-0 pb-[max(24px,env(safe-area-inset-bottom))] pl-0" aria-describedby={descriptionId}>
      <SheetHeader>
        <SheetTitle className="block m-0 px-11 text-center text-[27px] leading-[1.15] font-bold">Chọn thử thách</SheetTitle>
        <SheetDescription id={descriptionId} className="m-0 block text-center text-[15px] text-[#6c6666]">
          {categoryName} · {challenges.length} thử thách
        </SheetDescription>
      </SheetHeader>
      <div className="mt-[22px] grid gap-[10px] px-5">
        {challenges.map((challenge, index) => {
          const isSelected = selectedId === challenge.id;
          return <button
            className={`grid min-h-[54px] cursor-pointer grid-cols-[34px_minmax(0,1fr)_auto] items-start gap-3 rounded-lg bg-white px-[14px] py-[13px] text-left font-type-body text-base leading-[1.45] text-[#211c1d] transition-[border-color,background-color] duration-150 focus-visible:outline-2 focus-visible:outline-[#722f37] focus-visible:outline-offset-2 ${isSelected ? 'border-2 border-[#722f37] bg-[#f1dfe2] font-bold [box-shadow:inset_5px_0_#722f37]' : 'border border-[#d1caca]'}`}
            data-selected={isSelected}
            type="button"
            aria-pressed={isSelected}
            key={challenge.id}
            onClick={() => isSelected ? onClear() : onChoose(challenge)}
          >
            <span className="text-[#722f37] font-arial-fallback text-sm leading-[1.6] font-bold" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <span>{challenge.text}</span>
            <span className="flex min-h-5 items-center gap-[5px] whitespace-nowrap text-[#722f37] font-arial-fallback text-[10px] leading-none font-bold">
              {isSelected && <><Check className="size-[18px] stroke-[3]" aria-hidden="true" /><span>ĐÃ CHỌN</span></>}
            </span>
          </button>;
        })}
        {!challenges.length && <p className="m-0 p-[22px] text-center text-[#6c6666]">Chưa có thử thách trong danh mục này.</p>}
      </div>
    </SheetContent>
  </Sheet>;
}
