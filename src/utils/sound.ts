// Subtle premium notification sound using Web Audio API
// Plays a soft two-tone chime - no external assets needed

let audioContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return audioContext;
}

export function playNotificationSound() {
  const ctx = getContext();
  if (!ctx) return;

  const playTone = (freq: number, startTime: number, duration: number) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

    // Soft attack and decay envelope - premium feel
    gainNode.gain.setValueAtTime(0, ctx.currentTime + startTime);
    gainNode.gain.linearRampToValueAtTime(
      0.08,
      ctx.currentTime + startTime + 0.02
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + startTime + duration
    );

    oscillator.start(ctx.currentTime + startTime);
    oscillator.stop(ctx.currentTime + startTime + duration);
  };

  // Two-tone soft chime (C6 -> E6)
  playTone(1046.5, 0, 0.3);
  playTone(1318.5, 0.1, 0.4);
}