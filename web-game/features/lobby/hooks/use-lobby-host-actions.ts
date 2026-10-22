'use client';

import { useState } from 'react';

type EndAction = 'cancel' | 'delete' | null;

export function useLobbyHostActions(
  started: boolean,
  playerCount: number,
  onStart: (confirmed: boolean) => void,
  onCancel: () => void,
  onDelete: () => void,
) {
  const [confirmStart, setConfirmStart] = useState(false);
  const [endAction, setEndAction] = useState<EndAction>(null);

  const requestStart = () => {
    if (playerCount < 10) setConfirmStart(true);
    else onStart(false);
  };
  const confirmStarting = () => {
    onStart(true);
    setConfirmStart(false);
  };
  const confirmEnding = () => {
    if (endAction === 'delete') onDelete();
    else if (endAction === 'cancel') onCancel();
    setEndAction(null);
  };

  return {
    confirmStart, endAction, setConfirmStart, setEndAction,
    requestStart, confirmStarting, confirmEnding,
  };
}
