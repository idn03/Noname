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

  return <main className="card-selection-screen card-selection-screen--player" aria-labelledby="card-selection-title">
    <header className="player-selection-heading">
      <h1 id="card-selection-title">Vòng Chọn Thẻ</h1>
      <p>Điểm: {selection.score}</p>
    </header>
    <time className="player-selection-clock" aria-label={`Còn ${formatSelectionTime(remainingMs)}`}>
      {formatSelectionTime(remainingMs)}
    </time>

    {!selection.hasCardSlot ? <section className="card-selection-slotless" role="status">
      <h2>Bạn không có thẻ cá nhân trong vòng này</h2><p>Hãy chờ các thành viên có thẻ hoàn tất lựa chọn.</p>
    </section> : <>
      <PlayerCardCarousel categories={selection.categories} role={selection.team} activeCategoryId={activeCategoryId} initialCategoryId={selection.ownCard?.categoryId}
        draftCategoryId={draft?.categoryId} draftChallengeId={draft?.challengeId} disabled={!connected || pending}
        onFocusCategory={focusCategory} onSelectCategory={selectCategory} onSelectChallenge={selectChallenge}
        onClearChallenge={() => setDraft(undefined)} />
      <Button variant="outline" className="player-selection-submit" type="button" disabled={!connected || pending || !canSubmit || matchesConfirmed} onClick={chooseActiveCard}>
        {pending ? 'ĐANG GỬI…' : matchesConfirmed ? 'ĐÃ CHỌN' : selection.ownCard?.submitted ? 'CẬP NHẬT' : 'CHỌN'}
      </Button>
      <div className="player-selection-actions" aria-live="polite">
        {!matchesConfirmed && selection.ownCard?.submitted && <Button type="button" variant="ghost" className="player-selection-clear" disabled={pending} onClick={resetDraft}>HỦY SỬA</Button>}
        {selection.ownCard?.submitted && <Button type="button" variant="outline" className="player-selection-remove" disabled={!connected || pending} onClick={onRemove}>GỠ THẺ</Button>}
      </div>
    </>}

    {!connected && <p className="player-selection-error" role="status">Mất kết nối. Lựa chọn chưa được gửi.</p>}
    {remainingMs === 0 && <p className="player-selection-error">Đã hết thời gian. Vòng chọn vẫn mở đến khi mọi thẻ được gửi.</p>}
    {error && <p className="player-selection-error" role="alert">{error}</p>}
    <footer className="player-selection-team">
      <img src={`/assets/teams/${selection.team}-icon.svg`} alt="" />
      <strong>Đội {teamName}:</strong>
      <ul>{selection.teamMembers.map((member) => <li key={member.id}>{member.name}</li>)}</ul>
    </footer>
  </main>;
}
