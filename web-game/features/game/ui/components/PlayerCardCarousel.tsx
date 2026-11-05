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
  locked: boolean;
  disabled: boolean;
  onFocusCategory: (categoryId: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onSelectChallenge: (categoryId: string, challengeId: string) => void;
  onClearChallenge: (categoryId: string) => void;
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

  return <div className="w-full overflow-hidden">
    <div ref={trackRef} className={`flex w-full snap-x snap-mandatory gap-8 ${props.locked ? 'overflow-x-hidden [touch-action:pan-y]' : 'overflow-x-scroll [touch-action:pan-x_pan-y]'} px-[max(1rem,calc((100%_-_200px)/2))] [overscroll-behavior-x:contain] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch] motion-reduce:scroll-auto max-[640px]:gap-[.65rem]`} onScroll={focusNearestCard} role="region"
      aria-roledescription="carousel" aria-label={props.locked ? 'Thẻ đã chọn. Bấm Bỏ chọn để chọn thẻ khác.' : 'Thẻ khả dụng, vuốt ngang hoặc dùng nút để duyệt'}>
    {props.categories.map((category) => {
      const selectedChallenge = props.draftCategoryId === category.id
        ? category.challenges?.find(({ id }) => id === props.draftChallengeId)
        : undefined;
      const isActive = category.id === props.activeCategoryId;
      return <div className={`shrink-0 basis-[200px] snap-center ${isActive ? 'opacity-100' : 'opacity-[.58]'} transition-opacity duration-[160ms] ease-linear motion-reduce:transition-none [@media(max-height:760px)_and_(min-width:641px)]:basis-[174px]`} data-category-id={category.id} key={category.id}>
        <GameCard categoryId={category.id} categoryName={category.name} challengeCount={category.challengeCount}
          className="aspect-[.65]"
          role={props.role} phase="selection" challenges={category.challenges} selectedChallenge={selectedChallenge}
          isActive={isActive} isDraftSelected={props.draftCategoryId === category.id}
          onSelectCategory={() => { props.onFocusCategory(category.id); props.onSelectCategory(category.id); }}
          onOpenChallengeSheet={() => props.onFocusCategory(category.id)}
          onSelectChallenge={(challenge) => props.onSelectChallenge(category.id, challenge.id)}
          onClearChallenge={() => props.onClearChallenge(category.id)} disabled={props.disabled || props.locked} />
      </div>;
      })}
    </div>
  </div>;
}

function distanceFromCenter(item: HTMLElement, center: number): number {
  return Math.abs(item.offsetLeft + item.clientWidth / 2 - center);
}
