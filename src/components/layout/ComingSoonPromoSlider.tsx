import { useEffect, useMemo, useRef, useState } from 'react';
import { TagIcon } from 'lucide-react';

type ComingSoonPromoSliderProps = {
  slides: readonly string[];
};

const SCROLL_PX_PER_SEC = 55;

function MarqueeItem({ text }: { text: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2.5 px-10 sm:gap-3 sm:px-12">
      <TagIcon className="h-4 w-4 shrink-0 text-gold-400 sm:h-5 sm:w-5" aria-hidden />
      <span className="whitespace-nowrap text-sm font-semibold text-gold-100 sm:text-base">{text}</span>
      <span className="text-gold-500/45" aria-hidden>
        ✦
      </span>
    </span>
  );
}

function buildMarqueeHalf(items: readonly string[]): string[] {
  const half: string[] = [];
  const targetLen = Math.max(6, Math.ceil(10 / items.length) * items.length);
  while (half.length < targetLen) {
    half.push(...items);
  }
  return half;
}

/** JS-driven marquee — scrolls even when CSS animation / reduce-motion is blocked. */
const DEFAULT_SLIDES = ['Join the waitlist for an exclusive launch discount'] as const;

export function ComingSoonPromoSlider({ slides }: ComingSoonPromoSliderProps) {
  const items = slides.length > 0 ? slides : DEFAULT_SLIDES;
  const half = useMemo(() => buildMarqueeHalf(items), [slides]);
  const label = items.join(', ');

  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);
  const [hoverPaused, setHoverPaused] = useState(false);

  useEffect(() => {
    pausedRef.current = hoverPaused;
  }, [hoverPaused]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    let last = performance.now();

    const getHalfWidth = () => {
      const first = track.firstElementChild as HTMLElement | null;
      return first?.offsetWidth ?? track.scrollWidth / 2;
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (!pausedRef.current) {
        const halfWidth = getHalfWidth();
        if (halfWidth > 0) {
          offsetRef.current -= SCROLL_PX_PER_SEC * dt;
          if (-offsetRef.current >= halfWidth) {
            offsetRef.current += halfWidth;
          }
          track.style.transform = `translate3d(${offsetRef.current}px,0,0)`;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [half]);

  return (
    <div
      className="promo-marquee-bar relative z-20 w-full shrink-0 overflow-hidden border-b border-gold-500/25 bg-[#030a0c]/95 py-3 backdrop-blur-md sm:py-3.5"
      role="marquee"
      aria-label={label}
      onMouseEnter={() => setHoverPaused(true)}
      onMouseLeave={() => setHoverPaused(false)}
      onFocusCapture={() => setHoverPaused(true)}
      onBlurCapture={() => setHoverPaused(false)}
    >
      <span className="pointer-events-none absolute left-0 top-0 z-20 flex h-full items-center bg-gradient-to-r from-[#030a0c] via-[#030a0c] to-transparent pl-3 pr-10 sm:pl-4 sm:pr-12">
        <span className="rounded-md bg-gold-500 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-navy-900 shadow-sm sm:text-[10px]">
          Promo
        </span>
      </span>
      <span className="pointer-events-none absolute right-0 top-0 z-20 h-full w-14 bg-gradient-to-l from-[#030a0c] to-transparent sm:w-20" />

      <div
        ref={trackRef}
        className="flex w-max will-change-transform"
        style={{ transform: 'translate3d(0,0,0)' }}
      >
        <div className="flex shrink-0 items-center">
          {half.map((text, i) => (
            <MarqueeItem key={`a-${text}-${i}`} text={text} />
          ))}
        </div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {half.map((text, i) => (
            <MarqueeItem key={`b-${text}-${i}`} text={text} />
          ))}
        </div>
      </div>
    </div>
  );
}
