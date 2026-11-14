'use client';

import type { ReactNode } from 'react';
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'motion/react';
import { RuneField } from '@/components/shared/RuneField';

interface PageTransitionFrameProps {
  screenKey: string;
  animateTransitions: boolean;
  className: string;
  density?: 'default' | 'player';
  children: ReactNode;
}

export function PageTransitionFrame({ screenKey, animateTransitions, className, density = 'default', children }: PageTransitionFrameProps) {
  return <div className={`${className} !overflow-visible`}>
    <RuneField density={density} />
    <div className="relative z-[1] grid min-h-dvh grid-cols-1 [&>*]:col-start-1 [&>*]:row-start-1">
      <AnimatePresence initial={false} custom={animateTransitions}>
        <TransitionPage key={screenKey} animateTransitions={animateTransitions}>{children}</TransitionPage>
      </AnimatePresence>
    </div>
  </div>;
}

function TransitionPage({ children, animateTransitions }: { children: ReactNode; animateTransitions: boolean }) {
  const isPresent = useIsPresent();
  const prefersReducedMotion = useReducedMotion();
  const variants = {
    enter: (enabled: boolean) => enabled && !prefersReducedMotion ? { opacity: 0, top: 6 } : { opacity: 1, top: 0 },
    visible: { opacity: 1, top: 0, transition: { duration: prefersReducedMotion ? 0 : 0.18, ease: 'easeOut' } },
    exit: (enabled: boolean) => ({ opacity: 0, transition: { duration: enabled && !prefersReducedMotion ? 0.14 : 0, ease: 'easeOut' } }),
  };

  return <motion.div
    className="relative col-start-1 row-start-1 min-h-dvh"
    custom={animateTransitions}
    variants={variants}
    initial={animateTransitions ? 'enter' : false}
    animate="visible"
    exit="exit"
    aria-hidden={!isPresent}
    inert={!isPresent}
    style={{ pointerEvents: isPresent ? 'auto' : 'none' }}
  >{children}</motion.div>;
}
