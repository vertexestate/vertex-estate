import confetti from 'canvas-confetti';

/** Matches coming-soon overlay (gold / lime / cream). */
const PALETTE = ['#d4ff3f', '#facc15', '#fef08a', '#fffef0', '#a3e635', '#fde047'];

/**
 * Party-style confetti after a successful waitlist signup.
 * Respects `prefers-reduced-motion` with a short, lighter burst.
 */
export function playWaitlistCelebration(): void {
  if (typeof window === 'undefined') return;

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const base = { colors: PALETTE, zIndex: 260 };

  if (reduced) {
    void confetti({
      ...base,
      particleCount: 36,
      spread: 70,
      origin: { x: 0.5, y: 0.72 },
      gravity: 0.95,
      ticks: 120,
    });
    return;
  }

  const burst = (partial: confetti.Options) => {
    void confetti({ ...base, ...partial });
  };

  burst({
    particleCount: 130,
    spread: 88,
    startVelocity: 42,
    gravity: 0.92,
    ticks: 220,
    origin: { x: 0.5, y: 0.66 },
    scalar: 1.05,
    shapes: ['circle', 'square'],
  });

  burst({
    particleCount: 55,
    spread: 110,
    startVelocity: 32,
    origin: { x: 0.28, y: 0.74 },
    angle: 55,
  });

  burst({
    particleCount: 55,
    spread: 110,
    startVelocity: 32,
    origin: { x: 0.72, y: 0.74 },
    angle: 125,
  });

  window.setTimeout(() => {
    burst({
      particleCount: 90,
      spread: 360,
      startVelocity: 24,
      ticks: 140,
      origin: { x: 0.5, y: 0.52 },
      scalar: 0.88,
    });
  }, 180);

  window.setTimeout(() => {
    burst({
      particleCount: 40,
      spread: 95,
      origin: { x: 0.5, y: 0.76 },
      scalar: 1.1,
    });
  }, 420);
}
