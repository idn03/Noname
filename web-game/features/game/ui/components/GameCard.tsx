'use client';

import { useState } from 'react';
import { GameCardChallengeSheet, type GameCardChallenge } from './GameCardChallengeSheet';

export interface GameCardProps {
  categoryId: string;
  categoryName: string;
  challengeCount: number;
  role: 'wolf' | 'sheep' | 'host';
  phase: 'selection' | 'turns' | 'results';
  challenges?: readonly GameCardChallenge[];
  selectedChallenge?: GameCardChallenge;
  isDraftSelected?: boolean;
  onSelectCategory?: () => void;
  onOpenChallengeSheet?: () => void;
  onSelectChallenge?: (challenge: GameCardChallenge) => void;
  onClearChallenge?: () => void;
  disabled?: boolean;
  className?: string;
}

const categoryArt: Record<string, string> = {
  music: 'guitar-sticker.png', travel: 'backpack-sticker.png', geography: 'compass-sticker.png',
  films: 'film-sticker.png', folklore: 'folklore-sticker.png', healthcare: 'healthcare-sticker.png',
};

export function GameCard({
  categoryId, categoryName, challengeCount, role, phase, challenges = [], selectedChallenge,
  isDraftSelected = false, onSelectCategory, onOpenChallengeSheet, onSelectChallenge, onClearChallenge, disabled = false, className = '',
}: GameCardProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const canChoose = phase === 'selection' && role !== 'host' && !disabled
    && (role === 'wolf' ? Boolean(onSelectChallenge) : Boolean(onSelectCategory));
  const canFlip = phase !== 'selection' && Boolean(selectedChallenge);

  function activateCard() {
    if (canChoose && role === 'wolf') { onOpenChallengeSheet?.(); setSheetOpen(true); }
    else if (canChoose) onSelectCategory?.();
    else if (canFlip) setFlipped((value) => !value);
  }

  function chooseChallenge(challenge: GameCardChallenge) {
    onSelectChallenge?.(challenge);
    setSheetOpen(false);
  }

  return <>
    <button
      className={`relative block aspect-[5/8] w-full max-w-[200px] overflow-visible rounded-[12px] border-0 bg-transparent p-0 text-black [perspective:1000px] [-webkit-tap-highlight-color:transparent] disabled:opacity-100 ${canChoose || canFlip ? 'cursor-pointer' : 'cursor-default'} focus-visible:outline-[3px] focus-visible:outline-white focus-visible:outline-offset-[5px] ${className}`}
      type="button"
      aria-label={cardLabel(categoryName, challengeCount, selectedChallenge, flipped)}
      aria-haspopup={canChoose && role === 'wolf' ? 'dialog' : undefined}
      aria-pressed={phase === 'selection' ? isDraftSelected : canFlip ? flipped : undefined}
      disabled={disabled || (!canChoose && !canFlip)}
      onClick={activateCard}
    >
        <span className={`absolute inset-0 block [transform-style:preserve-3d] transition-transform duration-500 [transition-timing-function:cubic-bezier(.2,.72,.18,1)] motion-reduce:transition-none ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
        <span className={`absolute inset-0 block overflow-hidden rounded-[12px] bg-white shadow-[0_2px_8px_rgb(0_0_0/.22)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden] ${isDraftSelected ? 'outline outline-[3px] outline-[#722f37] outline-offset-2' : ''}`}>
          <span className="pointer-events-none absolute inset-[1%] rounded-[6%] border border-[#111] shadow-[inset_0_2px_16px_rgb(0_0_0/.3)]" aria-hidden="true" />
          {artPath(categoryId) && <img className="absolute top-[6.25%] left-1/2 h-[56.25%] w-[32.5%] -translate-x-1/2 object-contain" src={artPath(categoryId)} alt="" />}
          <span className="absolute top-[65.5%] left-1/2 block w-[calc(100%-24px)] -translate-x-1/2 overflow-hidden text-ellipsis whitespace-nowrap text-center font-judson text-2xl leading-[1.15] [text-shadow:0_2px_4px_rgb(0_0_0/.25)]">{categoryName}</span>
          <span className="absolute top-[78.5%] left-1/2 block w-[calc(100%-24px)] -translate-x-1/2 text-center font-judson text-base leading-[1.2] text-[#5a5a5a]">Có {challengeCount} thử thách</span>
        </span>
        <span className="absolute inset-0 block [transform:rotateY(180deg)] overflow-hidden rounded-[12px] bg-white shadow-[0_2px_8px_rgb(0_0_0/.22)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]" aria-hidden={!flipped}>
          <span className="pointer-events-none absolute inset-[1%] rounded-[6%] border border-[#111] shadow-[inset_0_2px_16px_rgb(0_0_0/.3)]" aria-hidden="true" />
          <span className="absolute top-[4.4%] left-1/2 block w-[calc(100%-24px)] -translate-x-1/2 text-center font-judson text-2xl leading-[1.15]">Thử thách</span>
          <span className="absolute top-[18%] left-1/2 block max-h-[36%] w-[81%] -translate-x-1/2 overflow-auto text-center font-judson text-sm leading-[1.25] [scrollbar-width:none]">{selectedChallenge?.text}</span>
          {artPath(categoryId) && <img className="absolute top-[58%] left-1/2 h-[37.5%] w-[21.7%] -translate-x-1/2 object-contain" src={artPath(categoryId)} alt="" />}
        </span>
      </span>
    </button>
    {canChoose && <GameCardChallengeSheet
      open={sheetOpen}
      categoryName={categoryName}
      challenges={challenges}
      selectedId={selectedChallenge?.id}
      onOpenChange={setSheetOpen}
      onChoose={chooseChallenge}
      onClear={() => { onClearChallenge?.(); setSheetOpen(false); }}
    />}
  </>;
}

function artPath(categoryId: string): string | undefined {
  const art = categoryArt[categoryId.toLocaleLowerCase()];
  return art ? `/assets/card-stickers/${art}` : undefined;
}

function cardLabel(name: string, count: number, challenge?: GameCardChallenge, flipped = false): string {
  return flipped ? `Mặt sau thẻ ${name}: ${challenge?.text ?? ''}. Nhấn để lật lại.`
    : `Thẻ ${name}, có ${count} thử thách.${challenge ? ' Đã chọn thử thách.' : ''}`;
}
