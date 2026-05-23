import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MenuIcon,
  XIcon,
  UserIcon,
  HeartIcon,
  BookmarkIcon,
  LogOutIcon,
  LayoutDashboardIcon,
  ChevronDownIcon,
  ShieldIcon,
} from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { BrandMark } from './BrandMark';
import {
  primaryNavLinks,
  navItemHref,
  isNavItemActive,
  type NavLinkItem,
} from '../../config/navLinks';
import { MARGALLA_PROJECT_PATH } from '../../data/margallaOrchardsContent';
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock';

const navStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.035, delayChildren: 0.12 },
  },
};

const navItemMotion = {
  hidden: { opacity: 0, y: -10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
  },
};

const mobileListStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.06 },
  },
};

const mobileItemMotion = {
  hidden: { opacity: 0, x: -16 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  },
};

function scrollToHash(hash: string) {
  const id = hash.replace(/^#/, '');
  if (!id) return;
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function AnimatedNavLink({
  item,
  active,
  onNavigate,
  className = '',
}: {
  item: NavLinkItem;
  active: boolean;
  onNavigate: (item: NavLinkItem, e: React.MouseEvent) => void;
  className?: string;
}) {
  const href = navItemHref(item);
  const idleClass =
    'text-navy-800 hover:text-gold-600 dark:text-cream/90 dark:hover:text-gold-400';
  const activeClass = 'text-gold-600 dark:text-gold-400';

  return (
    <motion.div variants={navItemMotion} className="shrink-0">
      <Link
        to={href}
        onClick={(e) => onNavigate(item, e)}
        className={`group relative block whitespace-nowrap px-1 py-2 text-[11px] font-semibold uppercase tracking-wide transition-colors xl:text-xs xl:tracking-wider ${active ? activeClass : idleClass} ${className}`}
      >
        <motion.span
          className="relative z-[1] inline-block"
          whileHover={{ y: -1 }}
          transition={{ type: 'spring', stiffness: 420, damping: 24 }}
        >
          {item.label}
        </motion.span>
        <span
          className={`pointer-events-none absolute -bottom-0.5 left-0 right-0 h-px origin-left bg-gold-500 transition-transform duration-300 ease-out ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
          aria-hidden
        />
        {active && (
          <motion.span
            layoutId="navbar-active-glow"
            className="pointer-events-none absolute -inset-x-2 -inset-y-1 rounded-lg bg-gold-500/10 dark:bg-gold-500/15"
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </Link>
    </motion.div>
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isEstateOwner, openAuthModal, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  useBodyScrollLock(isMobileMenuOpen);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleNavClick = useCallback(
    (item: NavLinkItem, e: React.MouseEvent) => {
      if (!item.hash) return;

      if (item.path === MARGALLA_PROJECT_PATH) {
        e.preventDefault();
        const target = `${MARGALLA_PROJECT_PATH}#${item.hash}`;
        if (location.pathname !== MARGALLA_PROJECT_PATH) {
          navigate(target);
          return;
        }
        navigate(target, { replace: false });
        scrollToHash(item.hash);
        return;
      }

      if (item.path === '/') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    [location.pathname, navigate]
  );

  const onHomeTop =
    (location.pathname === '/' || location.pathname === MARGALLA_PROJECT_PATH) && !isScrolled;

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-40 pt-[env(safe-area-inset-top,0px)] transition-[background-color,box-shadow] duration-200 ${
        isScrolled || onHomeTop
          ? 'border-b border-navy-100/80 bg-white/95 shadow-sm backdrop-blur-md dark:border-navy-700/80 dark:bg-navy-900 dark:shadow-black/20'
          : 'bg-transparent dark:bg-transparent'
      }`}
    >
      <div className="max-w-[100rem] mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex h-16 items-center justify-between gap-2 sm:h-20 sm:gap-3">
          <BrandMark size="nav" className="min-w-0 shrink" />

          <motion.nav
            aria-label="Primary"
            className="hidden lg:flex flex-1 min-w-0 justify-center px-2"
            variants={navStagger}
            initial="hidden"
            animate="show"
          >
            <div className="flex max-w-full items-center gap-x-3 overflow-x-auto scrollbar-none py-1 xl:gap-x-4 [mask-image:linear-gradient(90deg,transparent,black_12px,black_calc(100%-12px),transparent)]">
              {primaryNavLinks.map((link) => (
                <AnimatedNavLink
                  key={link.label}
                  item={link}
                  active={isNavItemActive(link, location.pathname, location.hash)}
                  onNavigate={handleNavClick}
                />
              ))}
            </div>
          </motion.nav>

          <div className="hidden lg:flex items-center shrink-0 space-x-3">
            <ThemeToggle />

            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white dark:bg-navy-700 border border-navy-200 dark:border-navy-600 hover:border-gold-500 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-navy-900 font-bold text-xs">
                    {initials}
                  </div>
                  <span className="text-sm font-semibold text-navy-900 dark:text-cream max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDownIcon
                    className={`w-4 h-4 text-navy-600 dark:text-navy-300 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-navy-800 rounded-2xl shadow-2xl border border-navy-100 dark:border-navy-700 overflow-hidden"
                    >
                      <div className="p-4 bg-gradient-to-br from-navy-700 to-navy-900 text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-navy-900 font-bold">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-display font-bold truncate">{user.name}</p>
                            <p className="text-xs text-navy-200 truncate">
                              {user.email || user.phone}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          {user.emailVerified && (
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-300 text-[10px] rounded-full">
                              ✓ Email
                            </span>
                          )}
                          {user.phoneVerified && (
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-300 text-[10px] rounded-full">
                              ✓ WhatsApp
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="py-2">
                        {[
                          {
                            icon: LayoutDashboardIcon,
                            label: 'Dashboard',
                            path: '/dashboard',
                          },
                          {
                            icon: BookmarkIcon,
                            label: `Saved (${user.savedProperties.length})`,
                            path: '/dashboard',
                          },
                          {
                            icon: HeartIcon,
                            label: `Favorites (${user.favoriteProperties.length})`,
                            path: '/dashboard',
                          },
                          { icon: UserIcon, label: 'Profile', path: '/dashboard' },
                        ].map((menuItem) => (
                          <button
                            key={menuItem.label}
                            onClick={() => {
                              navigate(menuItem.path);
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-navy-700 dark:text-cream hover:bg-navy-50 dark:hover:bg-navy-700 transition-colors"
                          >
                            <menuItem.icon className="w-4 h-4 text-gold-500" />
                            {menuItem.label}
                          </button>
                        ))}
                        {isEstateOwner && (
                          <button
                            onClick={() => {
                              navigate('/dashboard/owner');
                              setIsUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-navy-700 dark:text-cream hover:bg-navy-50 dark:hover:bg-navy-700 transition-colors"
                          >
                            <ShieldIcon className="w-4 h-4 text-gold-500" />
                            Owner view
                          </button>
                        )}
                        <div className="border-t border-navy-100 dark:border-navy-700 my-1" />
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        >
                          <LogOutIcon className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => openAuthModal('login')}>
                  Sign In
                </Button>
                <Button variant="primary" size="sm" onClick={() => openAuthModal('signup')}>
                  Sign Up
                </Button>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="touch-target flex items-center justify-center rounded-lg p-2 transition-colors hover:bg-navy-100 dark:hover:bg-navy-700"
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
            {isMobileMenuOpen ? (
              <XIcon className="w-6 h-6 text-navy-900 dark:text-cream" />
            ) : (
              <MenuIcon className="w-6 h-6 text-navy-900 dark:text-cream" />
            )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden overflow-hidden border-t border-navy-200 bg-white dark:border-navy-700 dark:bg-navy-800"
          >
            <motion.div
              className="max-h-[min(72dvh,520px)] space-y-1 overflow-y-auto overscroll-contain px-4 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]"
              variants={mobileListStagger}
              initial="hidden"
              animate="show"
            >
              {isAuthenticated && user && (
                <div className="flex items-center gap-3 pb-4 mb-2 border-b border-navy-200 dark:border-navy-700">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-navy-900 font-bold text-sm">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="font-display font-bold text-navy-900 dark:text-cream truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-navy-500 dark:text-navy-400 truncate">
                      {user.email || user.phone}
                    </p>
                  </div>
                </div>
              )}

              {primaryNavLinks.map((link) => {
                const active = isNavItemActive(link, location.pathname, location.hash);
                return (
                  <motion.div key={link.label} variants={mobileItemMotion}>
                    <Link
                      to={navItemHref(link)}
                      onClick={(e) => handleNavClick(link, e)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-base font-semibold transition-colors ${active ? 'bg-gold-500/12 text-gold-600 dark:text-gold-400' : 'text-navy-700 dark:text-cream hover:bg-navy-50 dark:hover:bg-navy-700/80'}`}
                    >
                      <motion.span
                        className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-gold-500' : 'bg-navy-300 dark:bg-navy-600'}`}
                        animate={active ? { scale: [1, 1.35, 1] } : { scale: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              {isAuthenticated && isEstateOwner && (
                <motion.div variants={mobileItemMotion}>
                  <Link
                    to="/dashboard/owner"
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-base font-semibold text-navy-700 dark:text-cream hover:bg-navy-50 dark:hover:bg-navy-700/80"
                  >
                    <ShieldIcon className="w-4 h-4 text-gold-500" />
                    Owner view
                  </Link>
                </motion.div>
              )}

              <div className="pt-4 mt-2 border-t border-navy-200 dark:border-navy-700 flex items-center justify-between">
                <span className="text-sm font-medium text-navy-700 dark:text-cream">Theme</span>
                <ThemeToggle />
              </div>

              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="block pt-2">
                    <Button variant="primary" className="w-full">
                      Go to Dashboard
                    </Button>
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 py-3 text-red-500 font-semibold"
                  >
                    <LogOutIcon className="w-4 h-4" />
                    Sign out
                  </button>
                </>
              ) : (
                <div className="space-y-3 pt-2">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => openAuthModal('login')}
                  >
                    Sign In
                  </Button>
                  <Button variant="primary" className="w-full" onClick={() => openAuthModal('signup')}>
                    Sign Up
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
