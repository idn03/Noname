'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { PlayerCardSelectionView } from '../../../../../shared/card-selection-contract';
import { useSelectionCountdown, formatSelectionTime } from '../../hooks/use-selection-countdown';
import { useCardSelectionDraft } from '../../hooks/use-card-selection-draft';
import { PlayerCardCarousel } from './PlayerCardCarousel';

interface PlayerCardSelectionProps {
  selection: PlayerCardSelectionView;
  connected: boolean;
  pending: boolean;
  error: string;
  onSubmit: (draft: { categoryId: string; challengeId?: string }) => void;
  onRemove: () => void;
}

export function PlayerCardSelection({ selection, connected, pending, error, onSubmit, onRemove }: PlayerCardSelectionProps) {
  const remainingMs = useSelectionCountdown(selection.remainingMs);
  const { draft, setDraft, resetDraft, selectCategory, selectChallenge } = useCardSelectionDraft(selection);
  const [activeCategoryId, setActiveCategoryId] = useState(selection.ownCard?.categoryId ?? selection.categories[0]?.id ?? '');
  const activeCategory = selection.categories.find(({ id }) => id === activeCategoryId);
  const draftCategory = selection.categories.find(({ id }) => id === draft?.categoryId);
  const draftChallenge = draftCategory?.challenges?.find(({ id }) => id === draft?.challengeId);
  const canSubmit = Boolean(activeCategory && (selection.team === 'sheep' || (draftCategory?.id === activeCategoryId && draftChallenge)));
  const matchesConfirmed = Boolean(selection.ownCard?.submitted && draft
    && selection.ownCard.categoryId === draft.categoryId
    && (selection.team === 'sheep' || selection.ownCard.challengeId === draft.challengeId));
  const teamName = selection.team === 'wolf' ? 'Sói' : 'Cừu';

  useEffect(() => {
    if (selection.ownCard?.categoryId) setActiveCategoryId(selection.ownCard.categoryId);
  }, [selection.ownCard?.categoryId]);

  function chooseActiveCard() {
    if (!activeCategory) return;
    if (selection.team === 'sheep') {
      selectCategory(activeCategory.id);
      onSubmit({ categoryId: activeCategory.id });
    } else if (draft && draft.categoryId === activeCategory.id) onSubmit(draft);
  }

  function focusCategory(categoryId: string) {
    setActiveCategoryId(categoryId);
  }

  return <main className="relative z-[1] flex min-h-svh w-full max-w-[402px] flex-col items-stretch border-0 rounded-none bg-transparent px-0 pt-[6.8vh] pb-[3vh] text-white shadow-none [@media(max-height:760px)_and_(min-width:641px)]:pt-6 max-[640px]:pt-[max(3.5rem,6.8vh)]" aria-labelledby="card-selection-title">
    <header className="px-[13px]">
      <h1 id="card-selection-title" className="m-0 text-white font-type-page-title text-[32px] leading-[1.08] font-bold">Vòng Chọn Thẻ</h1>
      <p className="mt-2 mb-0 text-white font-type-body text-base leading-[1.2] font-bold">Điểm: {selection.score}</p>
    </header>
      <time className="mt-[3.5vh] mb-[1.2vh] block self-center text-white font-type-display text-[42px] leading-none font-bold tabular-nums [@media(max-height:760px)_and_(min-width:641px)]:mt-4 [@media(max-height:760px)_and_(min-width:641px)]:mb-[.6rem] max-[640px]:mt-[3.5vh]" aria-label={`Còn ${formatSelectionTime(remainingMs)}`}>
      {formatSelectionTime(remainingMs)}
    </time>

    {!selection.hasCardSlot ? <section className="mx-4 my-8 max-w-[36rem] border border-white/40 rounded-2xl bg-black/20 p-8 text-center" role="status">
      <h2 className="font-type-result-title font-medium">Bạn không có thẻ cá nhân trong vòng này</h2><p className="text-[#c2c2b8]">Hãy chờ các thành viên có thẻ hoàn tất lựa chọn.</p>
    </section> : <>
      <PlayerCardCarousel categories={selection.categories} role={selection.team} activeCategoryId={activeCategoryId} initialCategoryId={selection.ownCard?.categoryId}
        draftCategoryId={draft?.categoryId} draftChallengeId={draft?.challengeId} disabled={!connected || pending}
        onFocusCategory={focusCategory} onSelectCategory={selectCategory} onSelectChallenge={selectChallenge}
        onClearChallenge={() => setDraft(undefined)} />
      <Button variant="outline" className="mx-auto mt-[38px] mb-0 min-h-[66px] w-[180px] self-center text-white font-type-body text-sm leading-none font-bold disabled:opacity-[.55] [@media(max-height:760px)_and_(min-width:641px)]:mt-4" type="button" disabled={!connected || pending || !canSubmit || matchesConfirmed} onClick={chooseActiveCard}>
        {pending ? 'ĐANG GỬI…' : matchesConfirmed ? 'ĐÃ CHỌN' : selection.ownCard?.submitted ? 'CẬP NHẬT' : 'CHỌN'}
      </Button>
      <div className="mx-3 mt-[10px] mb-auto flex min-h-[38px] items-center justify-center gap-[.65rem] text-white font-type-body text-[13px] leading-[1.2]">
        {!matchesConfirmed && selection.ownCard?.submitted && <Button type="button" variant="ghost" className="min-h-[34px] px-[10px] text-white font-type-body text-[11px] leading-none font-bold" disabled={pending} onClick={resetDraft}>HỦY SỬA</Button>}
        {selection.ownCard?.submitted && <Button type="button" variant="outline" className="min-h-[34px] px-[10px] text-white font-type-body text-[11px] leading-none font-bold" disabled={!connected || pending} onClick={onRemove}>GỠ THẺ</Button>}
      </div>
    </>}

    {!connected && <p className="mx-4 mt-[.6rem] mb-0 text-center text-white font-type-body text-[13px] leading-[1.25]" role="status">Mất kết nối. Lựa chọn chưa được gửi.</p>}
    {remainingMs === 0 && <p className="mx-4 mt-[.6rem] mb-0 text-center text-white font-type-body text-[13px] leading-[1.25]">Đã hết thời gian. Vòng chọn vẫn mở đến khi mọi thẻ được gửi.</p>}
    {error && <p className="mx-4 mt-[.6rem] mb-0 text-center text-white font-type-body text-[13px] leading-[1.25]" role="alert">{error}</p>}
    <footer className="flex min-h-8 flex-wrap items-center justify-center gap-[.55rem] px-4 text-center text-white font-type-body max-[640px]:gap-[.35rem]">
      <img className="h-[25px] w-[25px] shrink-0 object-contain brightness-0 invert" src={`/assets/teams/${selection.team}-icon.svg`} alt="" />
      <strong>Đội {teamName}:</strong>
      <ul className="m-0 flex flex-wrap list-none justify-center gap-[.55rem] p-0 text-xs max-[640px]:gap-[.4rem]">{selection.teamMembers.map((member) => <li key={member.id}>{member.name}</li>)}</ul>
    </footer>
  </main>;
}
