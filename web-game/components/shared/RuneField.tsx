'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useEffect, useState } from 'react';

const RUNES = Array.from({ length: 8 }, (_, index) =>
  `/assets/backgrounds/rune-${String(index + 1).padStart(2, '0')}.png`,
);
const TOP_OFFSETS = [12, 18, 25, 16, 28, 22, 32, 13];
const MOTION_SCALE = 1.3;
const TRAVEL_SCALE = 1.3;

export function RuneField() {
  const prefersReducedMotion = useReducedMotion();
  const [hasMounted, setHasMounted] = useState(false);
  const shouldReduceMotion = hasMounted && prefersReducedMotion === true;

  useEffect(() => setHasMounted(true), []);

  return (
    <div className="rune-field" aria-hidden="true">
      {RUNES.map((src, index) => <Rune key={src} src={src} index={index} reduceMotion={shouldReduceMotion} />)}
    </div>
  );
}

interface RuneProps {
  src: string;
  index: number;
  reduceMotion: boolean | null;
}

function Rune({ src, index, reduceMotion }: RuneProps) {
  const direction = index % 2 === 0 ? 1 : -1;
  const placement = { top: `${TOP_OFFSETS[index]}%` };

  return <motion.img
    className={`rune-mark rune-mark--${index + 1}`}
    src={src}
    alt=""
    initial={{ x: 0, y: '0vh', opacity: 0.72 }}
    animate={{
      x: [0, (reduceMotion ? 14 : 28) * TRAVEL_SCALE * direction, 0],
      y: ['0vh', `${(reduceMotion ? 4 : 7) * TRAVEL_SCALE}vh`, '0vh'],
    }}
    transition={{
      duration: ((reduceMotion ? 22 : 14) + index * 1.2) / MOTION_SCALE,
      delay: (-index * 1.8) / MOTION_SCALE,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'loop',
    }}
    style={placement}
  />;
}
