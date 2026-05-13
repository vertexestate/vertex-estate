/**
 * GPU-friendly ambient layer: CSS animations only (no per-particle Framer subscriptions).
 * Keeps a lively background without scroll / layout thrash.
 */
export function ParticlesBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <div className="animate-ambient-breathe absolute -left-1/4 top-0 h-[70vh] w-[70vh] rounded-full bg-gold-500/15 blur-[100px] will-change-transform" />
      <div className="animate-ambient-breathe-alt absolute -right-1/4 bottom-0 h-[60vh] w-[60vh] rounded-full bg-navy-400/20 blur-[90px] will-change-transform dark:bg-gold-600/10" />
      <div
        className="animate-starfield absolute inset-0 opacity-[0.22] mix-blend-soft-light dark:opacity-[0.14]"
        style={{
          backgroundImage:
            'radial-gradient(1.5px 1.5px at 12% 18%, rgba(255,255,255,0.55), transparent), radial-gradient(1.5px 1.5px at 72% 64%, rgba(255,255,255,0.45), transparent), radial-gradient(1.5px 1.5px at 40% 88%, rgba(255,255,255,0.4), transparent), radial-gradient(1.5px 1.5px at 88% 32%, rgba(255,255,255,0.5), transparent)',
          backgroundSize: '180% 180%',
        }}
      />
    </div>
  );
}
