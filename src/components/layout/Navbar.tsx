import React, { useEffect, useState, useRef } from 'react';
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
  ShieldIcon } from
'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { BrandMark } from './BrandMark';
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isEstateOwner, openAuthModal, logout } =
    useAuth();
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
      userMenuRef.current &&
      !userMenuRef.current.contains(e.target as Node))
      {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);
  const navLinks = [
  {
    path: '/',
    label: 'Home'
  },
  {
    path: '/listings',
    label: 'Listings'
  },
  {
    path: '/about',
    label: 'About'
  },
  {
    path: '/contact',
    label: 'Contact'
  }];

  const initials = user?.name ?
  user.name.
  split(' ').
  map((n) => n[0]).
  slice(0, 2).
  join('').
  toUpperCase() :
  'U';
  return (
    <motion.nav
      initial={{
        y: -100
      }}
      animate={{
        y: 0
      }}
      className={`fixed top-0 left-0 right-0 z-40 transition-[background-color,box-shadow] duration-200 ${isScrolled ? 'bg-white/92 dark:bg-navy-800/92 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <BrandMark size="nav" />

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) =>
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-semibold transition-colors ${location.pathname === link.path ? 'text-gold-500' : 'text-navy-700 dark:text-cream hover:text-gold-500'}`}>
              
                {link.label}
              </Link>
            )}
            {isAuthenticated && isEstateOwner &&
            <Link
              to="/dashboard/owner"
              className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${location.pathname === '/dashboard/owner' ? 'text-gold-500' : 'text-navy-700 dark:text-cream hover:text-gold-500'}`}>
              
                <ShieldIcon className="w-3.5 h-3.5" />
                Owner view
              </Link>
            }
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />

            {isAuthenticated && user ?
            <div className="relative" ref={userMenuRef}>
                <button
                onClick={() => setIsUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white dark:bg-navy-700 border border-navy-200 dark:border-navy-600 hover:border-gold-500 transition-colors">
                
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-navy-900 font-bold text-xs">
                    {initials}
                  </div>
                  <span className="text-sm font-semibold text-navy-900 dark:text-cream max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDownIcon
                  className={`w-4 h-4 text-navy-600 dark:text-navy-300 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                
                </button>

                <AnimatePresence>
                  {isUserMenuOpen &&
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -10,
                    scale: 0.95
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                  }}
                  exit={{
                    opacity: 0,
                    y: -10,
                    scale: 0.95
                  }}
                  transition={{
                    duration: 0.15
                  }}
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-navy-800 rounded-2xl shadow-2xl border border-navy-100 dark:border-navy-700 overflow-hidden">
                  
                      <div className="p-4 bg-gradient-to-br from-navy-700 to-navy-900 text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-navy-900 font-bold">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-display font-bold truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-navy-200 truncate">
                              {user.email || user.phone}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          {user.emailVerified &&
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-300 text-[10px] rounded-full">
                              ✓ Email
                            </span>
                      }
                          {user.phoneVerified &&
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-300 text-[10px] rounded-full">
                              ✓ WhatsApp
                            </span>
                      }
                        </div>
                      </div>

                      <div className="py-2">
                        {[
                    {
                      icon: LayoutDashboardIcon,
                      label: 'Dashboard',
                      path: '/dashboard'
                    },
                    {
                      icon: BookmarkIcon,
                      label: `Saved (${user.savedProperties.length})`,
                      path: '/dashboard'
                    },
                    {
                      icon: HeartIcon,
                      label: `Favorites (${user.favoriteProperties.length})`,
                      path: '/dashboard'
                    },
                    {
                      icon: UserIcon,
                      label: 'Profile',
                      path: '/dashboard'
                    }].
                    map((item) =>
                    <button
                      key={item.label}
                      onClick={() => {
                        navigate(item.path);
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-navy-700 dark:text-cream hover:bg-navy-50 dark:hover:bg-navy-700 transition-colors">
                      
                            <item.icon className="w-4 h-4 text-gold-500" />
                            {item.label}
                          </button>
                    )}
                        {isEstateOwner &&
                    <button
                      onClick={() => {
                        navigate('/dashboard/owner');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-navy-700 dark:text-cream hover:bg-navy-50 dark:hover:bg-navy-700 transition-colors">
                      
                          <ShieldIcon className="w-4 h-4 text-gold-500" />
                          Owner view
                        </button>
                    }
                        <div className="border-t border-navy-100 dark:border-navy-700 my-1" />
                        <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                      
                          <LogOutIcon className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                }
                </AnimatePresence>
              </div> :

            <>
                <button
                onClick={() => openAuthModal('login')}
                className="text-sm font-semibold text-navy-700 dark:text-cream hover:text-gold-500 transition-colors">
                
                  Sign In
                </button>
                <Button
                variant="primary"
                size="sm"
                onClick={() => openAuthModal('signup')}>
                
                  Sign Up
                </Button>
              </>
            }
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-700 transition-colors">
            
            {isMobileMenuOpen ?
            <XIcon className="w-6 h-6 text-navy-900 dark:text-cream" /> :

            <MenuIcon className="w-6 h-6 text-navy-900 dark:text-cream" />
            }
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen &&
        <motion.div
          initial={{
            opacity: 0,
            height: 0
          }}
          animate={{
            opacity: 1,
            height: 'auto'
          }}
          exit={{
            opacity: 0,
            height: 0
          }}
          className="md:hidden bg-white dark:bg-navy-800 border-t border-navy-200 dark:border-navy-700">
          
            <div className="px-4 py-6 space-y-4">
              {isAuthenticated && user &&
            <div className="flex items-center gap-3 pb-4 border-b border-navy-200 dark:border-navy-700">
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
            }

              {navLinks.map((link) =>
            <Link
              key={link.path}
              to={link.path}
              className={`block text-lg font-semibold transition-colors ${location.pathname === link.path ? 'text-gold-500' : 'text-navy-700 dark:text-cream'}`}>
              
                  {link.label}
                </Link>
            )}

              <div className="pt-4 border-t border-navy-200 dark:border-navy-700 flex items-center justify-between">
                <span className="text-sm font-medium text-navy-700 dark:text-cream">
                  Theme
                </span>
                <ThemeToggle />
              </div>

              {isAuthenticated ?
            <>
                  <Link to="/dashboard" className="block">
                    <Button variant="primary" className="w-full">
                      Go to Dashboard
                    </Button>
                  </Link>
                  {isEstateOwner &&
                  <Link to="/dashboard/owner" className="block">
                    <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
                      <ShieldIcon className="w-4 h-4" />
                      Owner view
                    </Button>
                  </Link>
                  }
                  <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 py-3 text-red-500 font-semibold">
                
                    <LogOutIcon className="w-4 h-4" />
                    Sign out
                  </button>
                </> :

            <div className="space-y-3">
                  <Button
                variant="secondary"
                className="w-full"
                onClick={() => openAuthModal('login')}>
                
                    Sign In
                  </Button>
                  <Button
                variant="primary"
                className="w-full"
                onClick={() => openAuthModal('signup')}>
                
                    Sign Up
                  </Button>
                </div>
            }
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </motion.nav>);

}