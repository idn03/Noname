'use client';

import { Button } from '../../../../components/shared/Button';
import type { PlayerCardSelectionView } from '../../../../../shared/card-selection-contract';
import { useSelectionCountdown, formatSelectionTime } from '../../hooks/use-selection-countdown';
import { useCardSelectionDraft } from '../../hooks/use-card-selection-draft';
import { GameCard } from './GameCard';

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
  const draftCategory = selection.categories.find(({ id }) => id === draft?.categoryId);
  const draftChallenge = draftCategory?.challenges?.find(({ id }) => id === draft?.challengeId);
  const canSubmit = Boolean(draftCategory && (selection.team === 'sheep' || draftChallenge));
  const matchesConfirmed = selection.ownCard?.categoryId === draft?.categoryId
    && (selection.team === 'sheep' || selection.ownCard?.challengeId === draft?.challengeId);
  const teamName = selection.team === 'wolf' ? 'Sói' : 'Cừu';
  const icon = selection.team === 'wolf' ? '/assets/teams/wolf-icon.svg' : '/assets/teams/sheep-icon.svg';

  return <main className="card-selection-screen card-selection-screen--player" aria-labelledby="card-selection-title">
    <header className="card-selection-heading">
      <p className="card-selection-eyebrow">VÒNG CHỌN THẺ</p>
      <div className="card-selection-title-row">
        <img src={icon} alt="" />
        <div><h1 id="card-selection-title">Đội {teamName}</h1><p>Chọn một thẻ cho lượt chơi</p></div>
        <time className="card-selection-clock" aria-label={`Còn ${formatSelectionTime(remainingMs)}`}>
          {formatSelectionTime(remainingMs)}
        </time>
      </div>
      <ReadinessSummary readiness={selection.readiness} />
    </header>

    {!selection.hasCardSlot ? <section className="card-selection-slotless" role="status">
      <h2>Bạn không có thẻ cá nhân trong vòng này</h2>
      <p>Hãy chờ các thành viên có thẻ hoàn tất lựa chọn.</p>
    </section> : <>
      <p className="card-selection-instruction">
        {selection.team === 'wolf' ? 'Chọn danh mục rồi chọn thử thách cho thẻ.' : 'Chạm vào một thẻ để chọn danh mục.'}
      </p>
      <div className="card-selection-cards" aria-label="Danh mục thẻ">
        {selection.categories.map((category) => {
          const selectedChallenge = draft?.categoryId === category.id
            ? category.challenges?.find(({ id }) => id === draft.challengeId)
            : undefined;
          return <div className="card-selection-card-wrap" key={category.id}>
            <GameCard
              categoryId={category.id}
              categoryName={category.name}
              challengeCount={category.challengeCount}
              role={selection.team}
              phase="selection"
              challenges={category.challenges}
              selectedChallenge={selectedChallenge}
              isDraftSelected={draft?.categoryId === category.id}
              onSelectCategory={() => selectCategory(category.id)}
              onSelectChallenge={(challenge) => selectChallenge(category.id, challenge.id)}
              disabled={!connected || pending}
            />
            {selection.ownCard?.categoryId === category.id && <span className="card-selection-confirmed-tag">Đã gửi</span>}
          </div>;
        })}
      </div>
      <section className="card-selection-actions" aria-label="Gửi lựa chọn thẻ">
        <p className="card-selection-draft-state" role="status">
          {selection.ownCard?.submitted && matchesConfirmed ? 'Lựa chọn đã được gửi.' : draftCategory ? 'Lựa chọn đang ở bản nháp.' : 'Chưa chọn thẻ.'}
        </p>
        <div className="card-selection-action-buttons">
          {draft && !matchesConfirmed && <Button type="button" className="card-selection-secondary" disabled={pending} onClick={resetDraft}>
            {selection.ownCard?.submitted ? 'Hoàn tác thay đổi' : 'Bỏ chọn'}
          </Button>}
          {selection.ownCard?.submitted && <Button type="button" className="card-selection-secondary" disabled={!connected || pending} onClick={onRemove}>
            Gỡ thẻ đã gửi
          </Button>}
          <Button type="button" disabled={!connected || pending || !canSubmit} onClick={() => draft && onSubmit(draft)}>
            {pending ? 'Đang gửi…' : selection.ownCard?.submitted ? 'Gửi thay đổi' : 'Gửi thẻ'}
          </Button>
        </div>
        {!connected && <p className="card-selection-connection" role="status">Mất kết nối. Lựa chọn chưa được gửi.</p>}
        {remainingMs === 0 && <p className="card-selection-expired">Đã hết thời gian. Vòng chọn vẫn mở đến khi mọi thẻ được gửi.</p>}
        {error && <p className="error-message" role="alert">{error}</p>}
      </section>
    </>}
  </main>;
}

function ReadinessSummary({ readiness }: Pick<PlayerCardSelectionView, 'readiness'>) {
  return <div className="card-selection-readiness" aria-label="Tiến độ chọn thẻ">
    <span>Sói {readiness.wolf.ready}/{readiness.wolf.total}</span>
    <span>Cừu {readiness.sheep.ready}/{readiness.sheep.total}</span>
  </div>;
}
