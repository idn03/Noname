'use client';

import { useEffect, useState } from 'react';

export function useSelectionCountdown(serverRemainingMs: number): number {
  const [remainingMs, setRemainingMs] = useState(serverRemainingMs);

  useEffect(() => {
    const deadline = Date.now() + serverRemainingMs;
    const update = () => setRemainingMs(Math.max(0, deadline - Date.now()));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [serverRemainingMs]);

  return remainingMs;
}

export function formatSelectionTime(remainingMs: number): string {
  const seconds = Math.ceil(remainingMs / 1000);
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}
