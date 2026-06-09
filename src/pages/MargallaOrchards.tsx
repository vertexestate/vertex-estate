import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRightIcon, MapPinIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { MargallaSectionNav, MargallaSection } from '../components/margalla/MargallaSectionNav';
import { MargallaFaqAccordion } from '../components/margalla/MargallaFaqAccordion';
import { MargallaMasterPlanMap } from '../components/margalla/MargallaMasterPlanMap';
import { MargallaPromoShowcase } from '../components/margalla/MargallaPromoShowcase';
import { WhatsAppInquiryCard } from '../components/contact/WhatsAppInquiryCard';
import { WhatsAppContactButton } from '../components/ui/WhatsAppContactButton';
import { whatsAppMessageForPlot } from '../lib/whatsapp';
import {
  margallaHero,
  margallaOverview,
  margallaDevelopers,
  margallaLocation,
  margallaNoc,
  margallaMasterPlan,
  margallaAmenities,
  margallaCommercial,
  margallaPlotInquiry,
  margallaInvestmentReasons,
  margallaSamplePlots,
  margallaNavItems,
  type MargallaSectionId,
} from '../data/margallaOrchardsContent';
import { MARGALLA_HERO_IMAGE, MARGALLA_HERO_FALLBACK } from '../config/margallaAssets';
import { siteConfig } from '../config/siteConfig';
import { useTheme } from '../context/ThemeContext';
import { usePageSeo } from '../hooks/usePageSeo';

function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-navy-100 dark:border-navy-600">
      <table className="w-full min-w-[280px] text-left text-xs sm:min-w-[32rem] sm:text-sm">
        <thead>
          <tr className="border-b border-navy-100 bg-navy-50 dark:border-navy-600 dark:bg-navy-900/80">
            {headers.map((h) => (
              <th
                key={h}
                className="px-3 py-2.5 font-bold uppercase tracking-wide text-navy-800 dark:text-gold-300 sm:px-4 sm:py-3"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-navy-100/80 last:border-0 dark:border-navy-700/80"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`px-4 py-3 text-navy-700 dark:text-cream/85 ${j === 0 ? 'font-semibold' : ''} ${i === rows.length - 1 ? 'font-bold text-navy-900 dark:text-cream' : ''}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MargallaOrchards() {
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState<MargallaSectionId>('overview');

  usePageSeo({
    title: 'DHA Margalla Orchards: plots, NOC and location | Vertex Estate',
    description: margallaHero.summary,
    path: '/dha-margalla-orchards',
  });

  const scrollToSection = useCallback((id: MargallaSectionId) => {
    setActiveId(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    const hash = location.hash.replace(/^#/, '') as MargallaSectionId;
    if (hash && margallaNavItems.some((n) => n.id === hash)) {
      const t = window.setTimeout(() => scrollToSection(hash), 80);
      return () => window.clearTimeout(t);
    }
  }, [location.hash, scrollToSection]);

  useEffect(() => {
    const ids = margallaNavItems.map((n) => n.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id as MargallaSectionId);
        }
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-cream pt-page pb-page text-navy-900 dark:bg-navy-950 dark:text-cream sm:pt-28">
      {/* Hero */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-2xl dark:border-navy-700 dark:bg-navy-900 sm:rounded-[2rem]">
          <div className="grid lg:grid-cols-2">
            <div className="order-2 flex flex-col justify-center p-5 sm:order-1 sm:p-10 lg:p-12">
              <p className="text-xs font-bold uppercase tracking-[0.32em] text-gold-600 dark:text-gold-400">
                {siteConfig.siteName} project guide
              </p>
              <h1
                className={`mt-3 font-display text-2xl font-bold leading-tight text-balance sm:text-4xl lg:text-[2.75rem] ${
                  isDark ? 'text-gold-300' : 'text-navy-900'
                }`}
              >
                {margallaHero.title}
              </h1>
              <p className="mt-2 text-xl font-semibold text-emerald-800 dark:text-gold-300">
                {margallaHero.subtitle}
              </p>
              <p className="mt-5 text-base leading-relaxed text-navy-600 dark:text-cream/80">
                {margallaHero.summary}
              </p>
              <div className="mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => scrollToSection('plots')}
                >
                  Explore plots
                  <ArrowRightIcon className="h-5 w-5" />
                </Button>
                <WhatsAppContactButton
                  size="lg"
                  variant="outline"
                  label="Chat on WhatsApp"
                  className="w-full sm:w-auto"
                />
              </div>
            </div>
            <div className="relative order-1 min-h-[200px] sm:min-h-[240px] lg:order-2 lg:min-h-full">
              <img
                src={MARGALLA_HERO_IMAGE}
                alt={margallaHero.imageAlt}
                className="h-full w-full object-contain bg-navy-950"
                onError={(e) => {
                  if (e.currentTarget.src !== MARGALLA_HERO_FALLBACK) {
                    e.currentTarget.src = MARGALLA_HERO_FALLBACK;
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-navy-950/20" />
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-navy-500 dark:text-cream/55">
          Tap a section below to jump straight to plots, pricing, NOC, location, and more.
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <MargallaPromoShowcase />
      </div>

      {/* Content + nav */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="lg:grid lg:grid-cols-[minmax(200px,240px)_minmax(0,1fr)] lg:items-start lg:gap-10 xl:gap-12">
          <aside className="hidden lg:block">
            <MargallaSectionNav
              variant="sidebar"
              activeId={activeId}
              onSelect={scrollToSection}
            />
          </aside>

          <div className="min-w-0">
            <div className="sticky top-[calc(4rem+env(safe-area-inset-top,0px))] z-30 -mx-4 mb-5 border-b border-navy-200/80 bg-cream/95 px-4 py-2.5 backdrop-blur-md dark:border-navy-700 dark:bg-navy-950/95 sm:top-[4.75rem] lg:hidden">
              <MargallaSectionNav
                variant="pills"
                activeId={activeId}
                onSelect={scrollToSection}
              />
            </div>

            <div className="space-y-8">
            <MargallaSection
              id="overview"
              eyebrow={margallaOverview.eyebrow}
              title={margallaOverview.title}
            >
              {margallaOverview.paragraphs.map((p) => (
                <p
                  key={p.slice(0, 40)}
                  className="mb-4 text-base leading-relaxed text-navy-600 last:mb-0 dark:text-cream/80"
                >
                  {p}
                </p>
              ))}
              <div className="mt-6 flex flex-wrap gap-2">
                {margallaOverview.plotSizes.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-navy-200 bg-cream px-4 py-2 text-sm font-bold dark:border-navy-600 dark:bg-navy-900 dark:text-cream"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </MargallaSection>

            <MargallaSection id="developers" title={margallaDevelopers.title}>
              <p className="text-base leading-relaxed text-navy-600 dark:text-cream/80">
                {margallaDevelopers.body}
              </p>
              <ul className="mt-6 grid gap-4 sm:grid-cols-3">
                {margallaDevelopers.partners.map((p) => (
                  <li
                    key={p.name}
                    className="rounded-xl border border-navy-100 bg-cream/80 p-4 dark:border-navy-600 dark:bg-navy-900/50"
                  >
                    <p className="font-bold text-navy-900 dark:text-cream">{p.name}</p>
                    <p className="mt-1 text-sm text-navy-600 dark:text-cream/70">{p.role}</p>
                  </li>
                ))}
              </ul>
            </MargallaSection>

            <MargallaSection
              id="location"
              title={margallaLocation.title}
              subtitle={margallaLocation.subtitle}
            >
              <p className="mb-6 text-base leading-relaxed text-navy-600 dark:text-cream/80">
                {margallaLocation.description}
              </p>
              <ul className="mb-8 grid gap-2 sm:grid-cols-2">
                {margallaLocation.advantages.map((a) => (
                  <li
                    key={a.text}
                    className="flex gap-2 rounded-lg bg-navy-50/80 px-3 py-2 text-sm dark:bg-navy-900/40"
                  >
                    <span aria-hidden>{a.icon}</span>
                    <span className="text-navy-800 dark:text-cream/85">{a.text}</span>
                  </li>
                ))}
              </ul>
              <h3 className="mb-3 font-display text-lg font-bold">Nearby landmarks</h3>
              <DataTable
                headers={['Landmark', 'Drive time', 'Notes']}
                rows={margallaLocation.landmarks.map((l) => [l.place, l.time, l.notes])}
              />
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    window.open(siteConfig.vertexOfficeMapsOpenUrl, '_blank')
                  }
                >
                  <MapPinIcon className="h-4 w-4" />
                  View on map
                </Button>
              </div>
            </MargallaSection>

            <MargallaSection
              id="noc"
              title={margallaNoc.title}
              subtitle={margallaNoc.subtitle}
            >
              <div className="grid gap-4 sm:grid-cols-3">
                {margallaNoc.items.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-gold-500/25 bg-gold-500/5 p-5 dark:bg-gold-500/10"
                  >
                    <h3 className="font-bold text-navy-900 dark:text-gold-300">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy-600 dark:text-cream/75">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </MargallaSection>

            <MargallaSection
              id="master-plan"
              title={margallaMasterPlan.title}
              subtitle={margallaMasterPlan.subtitle}
            >
              <MargallaMasterPlanMap showProjectLink={false} className="mb-10" />

              <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {margallaMasterPlan.stats.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-navy-100 bg-cream p-4 text-center dark:border-navy-600 dark:bg-navy-900"
                  >
                    <p className="font-display text-2xl font-bold text-gold-600 dark:text-gold-400">
                      {s.value}
                    </p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-navy-500 dark:text-cream/60">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
              <ul className="mb-8 grid gap-2 sm:grid-cols-2">
                {margallaMasterPlan.features.map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-navy-700 dark:text-cream/80">
                    <span className="text-gold-600 dark:text-gold-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <h3 className="mb-3 font-display text-lg font-bold">Plot distribution</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                {margallaMasterPlan.plotDistribution.map((p) => (
                  <div
                    key={p.size}
                    className="rounded-xl border border-navy-100 p-4 dark:border-navy-600"
                  >
                    <p className="font-bold">{p.size}</p>
                    <p className="text-2xl font-display font-bold text-gold-600 dark:text-gold-400">
                      {p.count}
                    </p>
                    <p className="text-sm text-navy-500 dark:text-cream/55">{p.pct} of total</p>
                  </div>
                ))}
              </div>
            </MargallaSection>

            <MargallaSection id="amenities" title="Facilities & amenities">
              <div className="grid gap-4 sm:grid-cols-2">
                {margallaAmenities.map((a) => (
                  <div
                    key={a.title}
                    className="rounded-xl border border-navy-100 p-5 dark:border-navy-600"
                  >
                    <h3 className="font-bold text-navy-900 dark:text-cream">{a.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy-600 dark:text-cream/75">
                      {a.body}
                    </p>
                  </div>
                ))}
              </div>
            </MargallaSection>

            <MargallaSection id="commercial" title={margallaCommercial.title}>
              <p className="text-base leading-relaxed text-navy-600 dark:text-cream/80">
                {margallaCommercial.body}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {margallaCommercial.highlights.map((h) => (
                  <span
                    key={h}
                    className="rounded-full bg-gold-500/15 px-3 py-1 text-xs font-bold text-navy-800 dark:text-gold-300"
                  >
                    ✓ {h}
                  </span>
                ))}
              </ul>
              <Button
                variant="primary"
                className="mt-6"
                onClick={() => navigate('/listings?type=commercial')}
              >
                View commercial listings
              </Button>
            </MargallaSection>

            <MargallaSection id="pricing" title={margallaPlotInquiry.title}>
              <p className="mb-6 text-sm text-navy-600 dark:text-cream/70">
                {margallaPlotInquiry.note}
              </p>
              <DataTable
                headers={['Plot size', 'Dimensions', 'Payment']}
                rows={margallaPlotInquiry.rows.map((r) => [r.size, r.dimensions, r.payment])}
              />
              <div className="mt-8">
                <WhatsAppInquiryCard
                  title="Get rates on WhatsApp"
                  subtitle="Tell us your budget and preferred block. We will send available plots, maps, and a clear quote with no spam."
                />
              </div>
            </MargallaSection>

            <MargallaSection id="investment" title="Why invest in Margalla Orchards?">
              <div className="grid gap-4 sm:grid-cols-2">
                {margallaInvestmentReasons.map((r, i) => (
                  <div
                    key={r.title}
                    className="flex gap-4 rounded-xl border border-navy-100 p-4 dark:border-navy-600"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-500/20 text-sm font-bold text-gold-700 dark:text-gold-300">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-navy-900 dark:text-cream">{r.title}</h3>
                      <p className="mt-1 text-sm text-navy-600 dark:text-cream/75">{r.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </MargallaSection>

            <MargallaSection id="plots" title="Plots for sale">
              <p className="mb-6 text-sm text-navy-600 dark:text-cream/70">
                Sample plots only. Contact Vertex Estate for live availability and block-wise pricing.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {margallaSamplePlots.map((plot) => (
                  <article
                    key={plot.title}
                    className="flex flex-col rounded-2xl border border-navy-100 overflow-hidden dark:border-navy-600"
                  >
                    <div className="bg-gradient-to-br from-navy-800 to-navy-950 p-5 text-cream">
                      <p className="text-xs font-bold uppercase tracking-wider text-gold-400">
                        {plot.block}
                      </p>
                      <h3 className="mt-1 font-display text-lg font-bold">{plot.title}</h3>
                      <p className="mt-2 text-sm font-medium text-cream/85">
                        Rates on request via WhatsApp
                      </p>
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <p className="text-sm text-navy-600 dark:text-cream/75">{plot.detail}</p>
                      <WhatsAppContactButton
                        message={whatsAppMessageForPlot(plot.plotSize)}
                        label="Ask on WhatsApp"
                        size="sm"
                        variant="soft"
                        className="mt-4 w-full"
                      />
                    </div>
                  </article>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="primary" onClick={() => navigate('/listings')}>
                  View all listings
                </Button>
                <WhatsAppContactButton variant="outline" label="Message on WhatsApp" />
              </div>
            </MargallaSection>

            <MargallaSection
              id="faq"
              eyebrow="FAQ"
              title="Frequently asked questions"
              subtitle="Everything you need to know about DHA Margalla Orchards"
            >
              <MargallaFaqAccordion />
            </MargallaSection>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-navy-100 bg-white py-12 dark:border-navy-700 dark:bg-navy-900">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Ready to invest?</h2>
          <p className="mt-3 text-navy-600 dark:text-cream/75">
            Contact {siteConfig.siteName} for available plots, site visits, and current pricing.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button variant="primary" size="lg" onClick={() => navigate('/listings')}>
              View available plots
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate('/contact')}>
              Contact us
            </Button>
          </div>
          <p className="mt-6">
            <Link
              to="/"
              className="text-sm font-semibold text-gold-600 hover:underline dark:text-gold-400"
            >
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
