import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export interface SiteHeroContent {
  heroHeadlineLead: string;
  heroHeadlineAccent: string;
  heroSubheading: string;
}

const STORAGE_KEY = 'vertex-site-hero';

const DEFAULT_HERO: SiteHeroContent = {
  heroHeadlineLead: 'Pakistan’s most trusted',
  heroHeadlineAccent: 'premium addresses',
  heroSubheading:
    'From Bahria Town to DHA — curated villas, penthouses, and offices in Karachi, Lahore, and Islamabad. Every listing is owner-reviewed before it goes live.',
};

function loadHero(): SiteHeroContent {
  try {
    const raw = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || 'null'
    ) as Partial<SiteHeroContent> | null;
    if (!raw || typeof raw !== 'object') return DEFAULT_HERO;
    return {
      heroHeadlineLead:
        typeof raw.heroHeadlineLead === 'string' && raw.heroHeadlineLead.trim()
          ? raw.heroHeadlineLead
          : DEFAULT_HERO.heroHeadlineLead,
      heroHeadlineAccent:
        typeof raw.heroHeadlineAccent === 'string' &&
        raw.heroHeadlineAccent.trim()
          ? raw.heroHeadlineAccent
          : DEFAULT_HERO.heroHeadlineAccent,
      heroSubheading:
        typeof raw.heroSubheading === 'string' && raw.heroSubheading.trim()
          ? raw.heroSubheading
          : DEFAULT_HERO.heroSubheading,
    };
  } catch {
    return DEFAULT_HERO;
  }
}

interface SiteContentContextType extends SiteHeroContent {
  updateHero: (next: Partial<SiteHeroContent>) => void;
  resetHero: () => void;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(
  undefined
);

export function SiteContentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [hero, setHero] = useState<SiteHeroContent>(loadHero);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hero));
  }, [hero]);

  const updateHero = useCallback((next: Partial<SiteHeroContent>) => {
    setHero((prev) => ({ ...prev, ...next }));
  }, []);

  const resetHero = useCallback(() => {
    setHero(DEFAULT_HERO);
  }, []);

  const value = useMemo(
    () => ({
      ...hero,
      updateHero,
      resetHero,
    }),
    [hero, updateHero, resetHero]
  );

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const ctx = useContext(SiteContentContext);
  if (!ctx)
    throw new Error('useSiteContent must be used within SiteContentProvider');
  return ctx;
}
