import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckIcon,
  XIcon,
  ShieldIcon,
  UsersIcon,
  HomeIcon,
  TrashIcon,
  ClockIcon,
  BarChart2Icon,
  FileTextIcon,
  BadgeCheckIcon,
  UserMinusIcon,
  DatabaseIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useProperties } from '../../context/PropertiesContext';
import { useAuth } from '../../context/AuthContext';
import { useSiteContent } from '../../context/SiteContentContext';
import { useNavigate } from 'react-router-dom';
import type { UserRole } from '../../types';
import { fetchLaunchSignupCount } from '../../lib/leadStats';
import { fetchApiHealth, type ApiHealthResponse } from '../../lib/apiHealth';

type OwnerTab =
  | 'pending'
  | 'all'
  | 'people'
  | 'analytics'
  | 'content';

function roleBadgeClass(role: UserRole) {
  if (role === 'estate_owner')
    return 'bg-gold-500/15 text-gold-600 dark:text-gold-400';
  if (role === 'agent')
    return 'bg-blue-500/15 text-blue-600 dark:text-blue-400';
  return 'bg-navy-200 dark:bg-navy-700 text-navy-700 dark:text-navy-300';
}

function roleLabel(role: UserRole) {
  if (role === 'estate_owner') return 'Estate Owner';
  if (role === 'agent') return 'Agent';
  return 'Member';
}

function MongoConnectionBanner() {
  const [health, setHealth] = useState<ApiHealthResponse | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    fetchApiHealth().then((h) => {
      if (!cancelled) setHealth(h);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (health === undefined) {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-navy-200 bg-navy-50 px-4 py-3 text-sm text-navy-600 dark:border-navy-600 dark:bg-navy-900/80 dark:text-navy-300">
        <DatabaseIcon className="h-5 w-5 shrink-0 animate-pulse text-gold-500" aria-hidden />
        Checking MongoDB connection…
      </div>
    );
  }

  const connected = health.ok === true && health.mongoConnected === true;

  if (connected) {
    return (
      <div className="mb-6 flex flex-col gap-2 rounded-xl border border-emerald-500/35 bg-emerald-500/10 px-4 py-3 text-sm text-navy-800 dark:text-emerald-100/95 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <CheckCircle2Icon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden />
          <div>
            <p className="font-semibold text-navy-900 dark:text-cream">MongoDB connected</p>
            <p className="mt-0.5 text-xs leading-relaxed text-navy-600 dark:text-navy-300">
              Database <span className="font-mono text-navy-800 dark:text-cream">{health.db}</span>
              {' · '}
              leads: <span className="font-mono">{health.leadsCollection}</span>
              {typeof health.launchWaitlistCount === 'number' ? (
                <>
                  {' · '}
                  coming-soon signups in MongoDB:{' '}
                  <span className="font-semibold text-navy-900 dark:text-cream">
                    {health.launchWaitlistCount}
                  </span>
                </>
              ) : null}
            </p>
          </div>
        </div>
        {typeof health.leadDocumentEstimate === 'number' ? (
          <p className="shrink-0 text-xs text-navy-500 dark:text-navy-400 sm:text-right">
            ~{health.leadDocumentEstimate} lead doc
            {health.leadDocumentEstimate === 1 ? '' : 's'} (estimate)
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100/90">
      <AlertCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
      <div>
        <p className="font-semibold text-navy-900 dark:text-cream">MongoDB not ready from this browser</p>
        <p className="mt-1 text-xs leading-relaxed text-navy-700 dark:text-navy-300">
          {health.error ||
            'Set MONGODB_URI in the project `.env`, run `npm run dev` (starts Vite + API), and ensure the API port matches your proxy.'}{' '}
          Waitlist and contact forms only reach MongoDB when the API returns HTTP 201 — otherwise they
          are queued in <span className="font-mono">localStorage</span> key{' '}
          <span className="font-mono">vertex-lead-queue</span>.
        </p>
      </div>
    </div>
  );
}

export function EstateOwnerPanel() {
  const navigate = useNavigate();
  const {
    pendingProperties,
    allProperties,
    publicProperties,
    approveListing,
    rejectListing,
    deleteListing,
  } = useProperties();
  const {
    allUsers,
    setUserRole,
    deleteUser,
    setVertexVerified,
    user: currentUser,
  } = useAuth();
  const {
    heroHeadlineLead,
    heroHeadlineAccent,
    heroSubheading,
    updateHero,
    resetHero,
  } = useSiteContent();
  const [tab, setTab] = useState<OwnerTab>('pending');
  const [launchSignupCount, setLaunchSignupCount] = useState<number | null>(null);
  const users = allUsers();
  const rejectedCount = allProperties.filter(
    (p) => p.approvalStatus === 'rejected'
  ).length;
  const verifiedMembers = users.filter((u) => u.vertexVerified).length;

  useEffect(() => {
    if (tab !== 'analytics') return;
    let cancelled = false;
    fetchLaunchSignupCount().then((n) => {
      if (!cancelled) setLaunchSignupCount(n);
    });
    return () => {
      cancelled = true;
    };
  }, [tab]);

  const tabs: Array<{
    id: OwnerTab;
    label: string;
    icon: typeof ShieldIcon;
    count?: number;
  }> = [
    {
      id: 'pending',
      label: 'Pending Review',
      icon: ClockIcon,
      count: pendingProperties.length,
    },
    {
      id: 'all',
      label: 'All Listings',
      icon: HomeIcon,
      count: allProperties.length,
    },
    {
      id: 'people',
      label: 'People & verification',
      icon: UsersIcon,
      count: users.length,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart2Icon,
    },
    {
      id: 'content',
      label: 'Site content',
      icon: FileTextIcon,
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
          <ShieldIcon className="w-5 h-5 text-navy-900" />
        </div>
        <div>
          <h2 className="text-2xl font-display font-bold text-navy-900 dark:text-cream">
            Estate Owner Control
          </h2>
          <p className="text-xs text-navy-500 dark:text-navy-400">
            Vertex Estate is curator-led: you approve every listing, verify
            people, and shape public messaging.
          </p>
        </div>
      </div>

      <MongoConnectionBanner />

      <div className="flex gap-2 p-1 bg-navy-100 dark:bg-navy-900 rounded-xl mb-6 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold whitespace-nowrap transition-all min-w-[120px] ${
              tab === t.id
                ? 'bg-white dark:bg-navy-700 text-navy-900 dark:text-cream shadow-sm'
                : 'text-navy-600 dark:text-navy-400'
            }`}
          >
            <t.icon className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">{t.label}</span>
            <span className="sm:hidden">{t.label.split(' ')[0]}</span>
            {t.count !== undefined && (
              <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-gold-500/20 text-gold-600 dark:text-gold-400 font-bold">
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'pending' && (
        <div className="space-y-3">
          {pendingProperties.length === 0 ? (
            <div className="text-center py-12 bg-cream dark:bg-navy-900 rounded-xl">
              <CheckIcon className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-navy-700 dark:text-cream font-semibold">
                Queue clear
              </p>
              <p className="text-sm text-navy-500 dark:text-navy-400 max-w-md mx-auto">
                No properties are waiting for your review.
              </p>
              <p className="text-xs text-navy-500 dark:text-navy-400 max-w-lg mx-auto mt-3 leading-relaxed">
                In this demo, listings are saved in this browser only. If you
                just submitted one from <strong>List Property</strong>, open{' '}
                <strong>Pending Review</strong> here again — or use{' '}
                <strong>Open review queue</strong> on the confirmation screen.
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-5"
                onClick={() =>
                navigate('/dashboard', { state: { dashboardTab: 'upload' } })
                }>
                
                Go to List Property
              </Button>
            </div>
          ) : (
            pendingProperties.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row gap-4 p-4 bg-cream dark:bg-navy-900 rounded-xl border border-gold-500/30"
              >
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="w-full sm:w-32 h-32 object-cover rounded-lg cursor-pointer"
                  onClick={() => navigate(`/property/${p.id}`)}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-navy-900 dark:text-cream truncate">
                    {p.title}
                  </h3>
                  <p className="text-sm text-navy-600 dark:text-navy-400">
                    {p.location.city}, {p.location.state} · {p.category}
                  </p>
                  <p className="text-gold-500 font-bold mt-1">
                    ${p.price.toLocaleString()}
                    {p.type === 'rent' ? '/mo' : ''}
                  </p>
                  <p className="text-xs text-navy-500 dark:text-navy-400 mt-1">
                    {p.bedrooms} BR · {p.bathrooms} BA ·{' '}
                    {p.sqft.toLocaleString()} sqft · Pending Review
                  </p>
                </div>
                <div className="flex sm:flex-col gap-2 sm:w-36">
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => approveListing(p.id)}
                  >
                    <CheckIcon className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => rejectListing(p.id)}
                  >
                    <XIcon className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {tab === 'all' && (
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
          {allProperties.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 p-3 bg-cream dark:bg-navy-900 rounded-lg"
            >
              <img
                src={p.images[0]}
                alt=""
                className="w-14 h-14 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-navy-900 dark:text-cream truncate text-sm">
                  {p.title}
                </p>
                <p className="text-xs text-navy-500 dark:text-navy-400">
                  {p.location.city} · ${p.price.toLocaleString()}
                </p>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                  p.approvalStatus === 'pending'
                    ? 'bg-gold-500/10 text-gold-700 dark:text-gold-400'
                    : p.approvalStatus === 'rejected'
                      ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                      : 'bg-green-500/10 text-green-600 dark:text-green-400'
                }`}
              >
                {p.approvalStatus === 'approved' || !p.approvalStatus
                  ? 'live'
                  : p.approvalStatus}
              </span>
              <button
                onClick={() => navigate(`/property/${p.id}`)}
                className="text-xs text-gold-500 hover:underline font-semibold"
              >
                View
              </button>
              {p.ownerId && (
                <button
                  onClick={() => {
                    if (confirm(`Remove listing “${p.title}” from the platform?`))
                      deleteListing(p.id);
                  }}
                  className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg"
                  title="Remove spam or fraudulent listing"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'people' && (
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
          {users.map((u) => (
            <div
              key={u.id}
              className="flex flex-wrap items-center gap-3 p-3 bg-cream dark:bg-navy-900 rounded-lg"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-navy-900 font-bold text-xs flex-shrink-0">
                {u.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                  .toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-navy-900 dark:text-cream truncate text-sm">
                  {u.name}
                </p>
                <p className="text-xs text-navy-500 dark:text-navy-400 truncate">
                  {u.email || u.phone}
                </p>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${roleBadgeClass(u.role)}`}
              >
                {roleLabel(u.role)}
              </span>
              {u.vertexVerified && (
                <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <BadgeCheckIcon className="w-3 h-3" />
                  Verified
                </span>
              )}
              {u.id !== currentUser?.id && u.role !== 'estate_owner' && (
                <>
                  <button
                    onClick={() =>
                      setUserRole(u.id, u.role === 'agent' ? 'user' : 'agent')
                    }
                    className="text-xs text-gold-500 hover:underline font-semibold whitespace-nowrap"
                  >
                    {u.role === 'agent' ? 'Remove agent' : 'Make agent'}
                  </button>
                  <button
                    onClick={() => setVertexVerified(u.id, !u.vertexVerified)}
                    className="text-xs text-navy-600 dark:text-navy-300 hover:underline font-semibold whitespace-nowrap"
                  >
                    {u.vertexVerified ? 'Unverify' : 'Verify account'}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Permanently remove ${u.name} from Vertex Estate?`))
                        deleteUser(u.id);
                    }}
                    className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg"
                    title="Delete user"
                  >
                    <UserMinusIcon className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'analytics' && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {(
            [
              { label: 'Live listings', value: publicProperties.length },
              { label: 'Pending review', value: pendingProperties.length },
              { label: 'Rejected', value: rejectedCount },
              { label: 'Total in system', value: allProperties.length },
              { label: 'Registered people', value: users.length },
              { label: 'Platform-verified', value: verifiedMembers },
              {
                label: 'Coming soon signups',
                value: launchSignupCount ?? '—',
                hint:
                  launchSignupCount === null
                    ? 'Connect MongoDB and open the site with the API running to load this count.'
                    : 'Waitlist registrations from the coming-soon page (MongoDB `leads`, source `coming_soon_launch`).',
              },
            ] as const satisfies readonly { label: string; value: number | string; hint?: string }[]
          ).map((row) => (
            <div
              key={row.label}
              className="p-4 rounded-xl bg-cream dark:bg-navy-900 border border-navy-200/60 dark:border-navy-700"
            >
              <p className="text-2xl font-display font-bold text-navy-900 dark:text-cream">
                {row.value}
              </p>
              <p className="text-xs text-navy-500 dark:text-navy-400 mt-1 uppercase tracking-wide font-semibold">
                {row.label}
              </p>
              {row.hint ? (
                <p className="mt-2 text-[11px] leading-snug text-navy-500 dark:text-navy-400 normal-case font-normal">
                  {row.hint}
                </p>
              ) : null}
            </div>
          ))}
          <div className="col-span-2 md:col-span-3 p-4 rounded-xl bg-gold-500/10 border border-gold-500/25 text-sm text-navy-700 dark:text-cream">
            You are the only role that can publish listings, verify accounts, or
            remove content. Members and agents always submit to{' '}
            <strong>Pending Review</strong> first — nothing goes public without
            your approval.
          </div>
        </div>
      )}

      {tab === 'content' && (
        <div className="space-y-4 max-w-xl">
          <p className="text-sm text-navy-600 dark:text-navy-400">
            These fields power the main hero on the home page. Use them to keep
            the brand voice aligned with a professionally managed marketplace.
          </p>
          <Input
            label="Headline (first line)"
            value={heroHeadlineLead}
            onChange={(e) => updateHero({ heroHeadlineLead: e.target.value })}
          />
          <Input
            label="Headline accent (gold word)"
            value={heroHeadlineAccent}
            onChange={(e) => updateHero({ heroHeadlineAccent: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-navy-700 dark:text-cream mb-2">
              Subheading
            </label>
            <textarea
              rows={3}
              value={heroSubheading}
              onChange={(e) => updateHero({ heroSubheading: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border-2 border-navy-200 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-900 dark:text-cream focus:border-gold-500 outline-none"
            />
          </div>
          <Button variant="secondary" size="sm" onClick={resetHero}>
            Reset to defaults
          </Button>
        </div>
      )}
    </div>
  );
}
