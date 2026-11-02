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
  onSelectChallenge?: (challenge: GameCardChallenge) => void;
  disabled?: boolean;
}

const categoryArt: Record<string, string> = {
  music: 'guitar-sticker.png', travel: 'backpack-sticker.png', geography: 'compass-sticker.png',
  films: 'film-sticker.png', folklore: 'folklore-sticker.png', healthcare: 'healthcare-sticker.png',
};

export function GameCard({
  categoryId, categoryName, challengeCount, role, phase, challenges = [], selectedChallenge, onSelectChallenge, disabled = false,
}: GameCardProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const canChoose = phase === 'selection' && role === 'wolf' && !disabled && Boolean(onSelectChallenge);
  const canFlip = phase !== 'selection' && Boolean(selectedChallenge);

  function activateCard() {
    if (canChoose) setSheetOpen(true);
    else if (canFlip) setFlipped((value) => !value);
  }

  function chooseChallenge(challenge: GameCardChallenge) {
    onSelectChallenge?.(challenge);
    setSheetOpen(false);
  }

  return <>
    <button
      className={`game-card${flipped ? ' is-flipped' : ''}${canChoose || canFlip ? ' is-interactive' : ''}`}
      type="button"
      aria-label={cardLabel(categoryName, challengeCount, selectedChallenge, flipped)}
      aria-haspopup={canChoose ? 'dialog' : undefined}
      aria-pressed={canFlip ? flipped : undefined}
      disabled={disabled || (!canChoose && !canFlip)}
      onClick={activateCard}
    >
      <span className="game-card__flipper">
        <span className="game-card__face game-card__front">
          <span className="game-card__frame" aria-hidden="true" />
          {artPath(categoryId) && <img className="game-card__art" src={artPath(categoryId)} alt="" />}
          <span className="game-card__category">{categoryName}</span>
          <span className="game-card__count">Có {challengeCount} thử thách</span>
        </span>
        <span className="game-card__face game-card__back" aria-hidden={!flipped}>
          <span className="game-card__frame" aria-hidden="true" />
          <span className="game-card__back-title">Thử thách</span>
          <span className="game-card__challenge">{selectedChallenge?.text}</span>
          {artPath(categoryId) && <img className="game-card__art game-card__back-art" src={artPath(categoryId)} alt="" />}
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
