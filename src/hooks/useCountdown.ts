import { useEffect, useMemo, useState } from 'react';

export type CountdownParts = {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
};

/** Countdown to a target instant (wall clock); parent supplies `targetMs`. */
export function useCountdown(targetMs: number): CountdownParts {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return useMemo(() => {
    const totalMs = Math.max(0, targetMs - now);
    if (totalMs <= 0) {
      return {
        totalMs: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
      };
    }
    const sec = Math.floor(totalMs / 1000);
    const days = Math.floor(sec / 86400);
    const hours = Math.floor((sec % 86400) / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    return { totalMs, days, hours, minutes, seconds, isExpired: false };
  }, [now, targetMs]);
}
