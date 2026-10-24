'use client';

import { useState } from 'react';

export function useLobbyHostActions(
  playerCount: number,
  onStart: (confirmed: boolean) => void,
) {
  const [confirmStart, setConfirmStart] = useState(false);

  const requestStart = () => {
    if (playerCount < 10) setConfirmStart(true);
    else onStart(false);
  };

  return { confirmStart, setConfirmStart, requestStart };
}
