import { useEffect, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { RoundAward } from '../../hooks/use-round-presentation';
import { GameCard } from './GameCard';

export function RoundAwardCard({ award }: { award: RoundAward }) {
  const reduced = useReducedMotion();
  const { entry, credited, credit } = award;
  useEffect(() => {
    // A suspended animation must still release the confirmed round.
    const fallback = setTimeout(credit, reduced ? 600 : 2000);
    return () => clearTimeout(fallback);
  }, [credit, reduced]);
  const sheepScored = entry.scoreChange.sheep > 0;
  const points = sheepScored ? entry.scoreChange.sheep : entry.scoreChange.wolf;
  const team = sheepScored ? 'Đội Cừu' : 'Đội Sói';
  return <div className="relative mx-auto aspect-[5/8] w-full max-w-[200px]">
    <p className="sr-only" role="status">Lượt {entry.round} kết thúc. {team} được cộng {points} điểm.</p>
    <motion.div aria-hidden="true" initial={{ opacity: 1 }} animate={{ opacity: 0, scale: entry.challengeSucceeded && !reduced ? 0.78 : 1 }}
      transition={{ delay: reduced ? 0 : 0.25, duration: reduced ? 0 : 0.3 }}>
      <GameCard categoryId={entry.attackCategoryId} categoryName={entry.attackCategoryName ?? entry.attackCategoryId}
        viewerRole="host" phase="turns" challengeCount={1} disabled />
    </motion.div>
    <motion.div aria-hidden="true" className="absolute inset-0 flex flex-col items-center justify-center text-white"
      initial={{ opacity: 0 }} animate={{ opacity: reduced ? [1, 1] : [0, 1, 1, 0], y: reduced ? 0 : [0, 0, 0, -64] }}
      transition={reduced ? { duration: 0.45 } : { delay: 0.55, duration: 1.15, times: [0, 0.24, 0.64, 1] }}
      onAnimationComplete={credit}>
      <strong className="text-title1 [--text-title1:120px] leading-none">+{points}</strong>
      <span className="text-subtitle font-bold">{team}</span>
    </motion.div>
    {credited && <span className="sr-only">Đã cập nhật điểm của {team}.</span>}
  </div>;
}

export function SheepImpact({ award, children }: { award?: RoundAward; children: ReactNode }) {
  const reduced = useReducedMotion();
  const hit = award && !award.entry.challengeSucceeded && !reduced;
  return <motion.div key={award?.entry.round ?? 'playing'} className="relative"
    animate={{ x: hit ? [0, -6, 5, -3, 0] : 0 }} transition={{ duration: 0.28 }}>
    {children}
    {hit && <motion.span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-1 w-16 -rotate-45 rounded-full bg-white"
      initial={{ scaleX: 0, opacity: 1 }} animate={{ scaleX: [0, 1, 1], opacity: [1, 1, 0] }} transition={{ duration: 0.28 }} />}
  </motion.div>;
}
