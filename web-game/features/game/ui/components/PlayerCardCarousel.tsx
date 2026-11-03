'use client';

import { useEffect, useRef } from 'react';
import type { CardCategoryView } from '../../../../../shared/card-selection-contract';
import { GameCard } from './GameCard';

interface PlayerCardCarouselProps {
  categories: readonly CardCategoryView[];
  role: 'wolf' | 'sheep';
  activeCategoryId: string;
  initialCategoryId?: string;
  draftCategoryId?: string;
  draftChallengeId?: string;
  disabled: boolean;
  onFocusCategory: (categoryId: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onSelectChallenge: (categoryId: string, challengeId: string) => void;
}

export function PlayerCardCarousel(props: PlayerCardCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const initial = track && [...track.children].find((item) => (item as HTMLElement).dataset.categoryId === props.initialCategoryId) as HTMLElement | undefined;
    if (track && initial) track.scrollTo({ left: initial.offsetLeft + initial.clientWidth / 2 - track.clientWidth / 2 });
  }, [props.initialCategoryId]);

  function focusNearestCard() {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    const nearest = [...track.children].map((item) => item as HTMLElement)
      .sort((left, right) => distanceFromCenter(left, center) - distanceFromCenter(right, center))[0];
    if (nearest?.dataset.categoryId) props.onFocusCategory(nearest.dataset.categoryId);
  }

  return <div ref={trackRef} className="player-card-carousel" onScroll={focusNearestCard} role="region"
    aria-roledescription="carousel" aria-label="Thẻ khả dụng, vuốt ngang để duyệt">
    {props.categories.map((category) => {
      const selectedChallenge = props.draftCategoryId === category.id
        ? category.challenges?.find(({ id }) => id === props.draftChallengeId)
        : undefined;
      return <div className={`player-card-carousel__item${category.id === props.activeCategoryId ? ' is-active' : ''}`} data-category-id={category.id} key={category.id}>
        <GameCard categoryId={category.id} categoryName={category.name} challengeCount={category.challengeCount}
          role={props.role} phase="selection" challenges={category.challenges} selectedChallenge={selectedChallenge}
          isDraftSelected={props.draftCategoryId === category.id}
          onSelectCategory={() => { props.onFocusCategory(category.id); props.onSelectCategory(category.id); }}
          onSelectChallenge={(challenge) => props.onSelectChallenge(category.id, challenge.id)} disabled={props.disabled} />
      </div>;
    })}
  </div>;
}

function distanceFromCenter(item: HTMLElement, center: number): number {
  return Math.abs(item.offsetLeft + item.clientWidth / 2 - center);
}
