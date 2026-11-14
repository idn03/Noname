'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const MINIMUM_LOADING_MS = 1000;
const MAXIMUM_WAIT_MS = 3000;

export function usePageTransition(screenKey: string, animateTransitions: boolean, error: string, onTimeout: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const previousScreenKey = useRef(screenKey);
  const startedAt = useRef<number | null>(null);
  const confirmed = useRef(false);
  const didTimeout = useRef(false);
  const minimumTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maximumTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (minimumTimer.current) clearTimeout(minimumTimer.current);
    if (maximumTimer.current) clearTimeout(maximumTimer.current);
    minimumTimer.current = null;
    maximumTimer.current = null;
  }, []);

  const cancelTransition = useCallback(() => {
    clearTimers();
    startedAt.current = null;
    confirmed.current = false;
    didTimeout.current = false;
    setIsLoading(false);
  }, [clearTimers]);

  const beginTransition = useCallback(() => {
    clearTimers();
    startedAt.current = Date.now();
    confirmed.current = false;
    didTimeout.current = false;
    setIsLoading(true);
    maximumTimer.current = setTimeout(() => {
      if (confirmed.current) return;
      startedAt.current = null;
      maximumTimer.current = null;
      didTimeout.current = true;
      setIsLoading(false);
      onTimeout();
    }, MAXIMUM_WAIT_MS);
  }, [clearTimers, onTimeout]);

  useLayoutEffect(() => {
    if (previousScreenKey.current === screenKey) return;
    previousScreenKey.current = screenKey;
    if (didTimeout.current) {
      didTimeout.current = false;
      return;
    }
    if (startedAt.current === null && !animateTransitions) return;
    if (startedAt.current === null) {
      startedAt.current = Date.now();
      setIsLoading(true);
    }
    confirmed.current = true;
    if (maximumTimer.current) clearTimeout(maximumTimer.current);
    maximumTimer.current = null;
    if (minimumTimer.current) clearTimeout(minimumTimer.current);
    const remaining = Math.max(0, MINIMUM_LOADING_MS - (Date.now() - startedAt.current));
    if (!remaining) {
      startedAt.current = null;
      confirmed.current = false;
      setIsLoading(false);
      return;
    }
    minimumTimer.current = setTimeout(() => {
      startedAt.current = null;
      confirmed.current = false;
      minimumTimer.current = null;
      setIsLoading(false);
    }, remaining);
  }, [animateTransitions, screenKey]);

  useEffect(() => {
    if (error && isLoading) cancelTransition();
  }, [cancelTransition, error, isLoading]);

  useEffect(() => clearTimers, [clearTimers]);

  return { isLoading, beginTransition, cancelTransition };
}

export function withPageTransition<Arguments extends unknown[]>(begin: () => void, action: (...arguments_: Arguments) => void) {
  return (...arguments_: Arguments) => {
    begin();
    action(...arguments_);
  };
}
