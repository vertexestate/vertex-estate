import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserIcon,
  HeartIcon,
  HomeIcon,
  UploadIcon,
  SettingsIcon,
  EyeIcon,
  BookmarkIcon,
  CheckCircleIcon,
  CheckIcon,
  AlertCircleIcon,
  ClockIcon,
  LogOutIcon,
  LockIcon,
  ShieldIcon } from
'lucide-react';
import { PropertyCard } from '../components/ui/PropertyCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { UploadPropertyForm } from '../components/dashboard/UploadPropertyForm';
import { MyListings } from '../components/dashboard/MyListings';
import { EstateOwnerPanel } from '../components/dashboard/EstateOwnerPanel';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProperties } from '../context/PropertiesContext';
type Tab =
'profile' |
'saved' |
'favorites' |
'listings' |
'upload' |
'settings' |
'estate-control';
export function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    isAuthenticated,
    isEstateOwner,
    openAuthModal,
    logout,
    updateProfile
  } = useAuth();
  const { publicProperties, myListings, pendingProperties } = useProperties();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  /** After upload, show the same “Listing Submitted” message on Profile until dismissed. */
  const [profileSubmissionHighlight, setProfileSubmissionHighlight] = useState<
    'fresh' | 'none'
  >('none');
  const [profileDraft, setProfileDraft] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || ''
  });
  const [savedMessage, setSavedMessage] = useState('');
  useEffect(() => {
    const tab = (location.state as { dashboardTab?: Tab } | undefined)?.
      dashboardTab;
    if (!tab) return;
    const allowed: Tab[] = [
      'profile',
      'saved',
      'favorites',
      'listings',
      'upload',
      'settings',
      'estate-control'
    ];
    if (allowed.includes(tab)) {
      setActiveTab(tab);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate]);
  useEffect(() => {
    if (user) {
      setProfileDraft({
        name: user.name,
        email: user.email,
        phone: user.phone,
        bio: user.bio || ''
      });
    }
  }, [user]);
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-cream dark:bg-navy-900 pt-24 pb-20 flex items-center justify-center px-4">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="max-w-md w-full bg-white dark:bg-navy-800 rounded-3xl p-10 text-center shadow-2xl border border-gold-500/20">
          
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gold-500/10 flex items-center justify-center">
            <LockIcon className="w-10 h-10 text-gold-500" />
          </div>
          <h2 className="text-3xl font-display font-bold text-navy-900 dark:text-cream mb-3">
            Sign in to continue
          </h2>
          <p className="text-navy-600 dark:text-navy-400 mb-8">
            Vertex Estate is a members-only platform. Sign in to access your
            dashboard, saved properties, and listings.
          </p>
          <div className="space-y-3">
            <Button
              variant="primary"
              className="w-full"
              onClick={() => openAuthModal('login')}>
              
              Sign In
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => openAuthModal('signup')}>
              
              Create an Account
            </Button>
          </div>
        </motion.div>
      </div>);

  }
  const savedProperties = publicProperties.filter((p) =>
  user.savedProperties.includes(p.id)
  );
  const favoriteProperties = publicProperties.filter((p) =>
  user.favoriteProperties.includes(p.id)
  );
  const tabs: Array<{
    id: Tab;
    label: string;
    icon: typeof UserIcon;
    count?: number;
  }> = [
  {
    id: 'profile',
    label: 'Profile',
    icon: UserIcon
  },
  {
    id: 'saved',
    label: 'Saved',
    icon: BookmarkIcon,
    count: savedProperties.length
  },
  {
    id: 'favorites',
    label: 'Favorites',
    icon: HeartIcon,
    count: favoriteProperties.length
  },
  {
    id: 'listings',
    label: 'My Listings',
    icon: HomeIcon,
    count: myListings.length
  },
  {
    id: 'upload',
    label: 'List Property',
    icon: UploadIcon
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: SettingsIcon
  }];

  if (isEstateOwner) {
    tabs.push({
      id: 'estate-control',
      label: 'Estate Control',
      icon: ShieldIcon
    });
  }
  const stats = [
  {
    label: 'Profile Views',
    value: '1,234',
    icon: EyeIcon,
    color: 'from-blue-500 to-blue-600'
  },
  {
    label: 'My Listings',
    value: myListings.length.toString(),
    icon: HomeIcon,
    color: 'from-green-500 to-green-600'
  },
  {
    label: 'Saved',
    value: savedProperties.length.toString(),
    icon: BookmarkIcon,
    color: 'from-purple-500 to-purple-600'
  },
  {
    label: 'Favorites',
    value: favoriteProperties.length.toString(),
    icon: HeartIcon,
    color: 'from-red-500 to-red-600'
  }];

  const initials = user.name.
  split(' ').
  map((n) => n[0]).
  slice(0, 2).
  join('').
  toUpperCase();
  const handleSaveProfile = () => {
    updateProfile(profileDraft);
    setSavedMessage('Profile updated successfully');
    setTimeout(() => setSavedMessage(''), 2500);
  };
  const myPendingCount = myListings.filter(
    (p) => p.approvalStatus === 'pending'
  ).length;
  return (
    <div className="min-h-screen bg-cream dark:bg-navy-900 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="mb-12">
          
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-navy-900 dark:text-cream mb-2">
                Welcome back, {user.name.split(' ')[0]} 👋
              </h1>
              <p className="text-xl text-navy-600 dark:text-navy-400">
                {isEstateOwner ?
                'Estate Owner dashboard — curated control of Vertex Estate' :
                'Manage your properties and account'}
              </p>
            </div>
            {isEstateOwner &&
            <Button
              variant="primary"
              className="shrink-0 self-start sm:self-auto"
              onClick={() => navigate('/dashboard/owner')}>
              
              <ShieldIcon className="w-4 h-4 mr-2" />
              Owner view
            </Button>
            }
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) =>
          <motion.div
            key={index}
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: index * 0.1
            }}
            className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 text-white shadow-lg`}>
            
              <stat.icon className="w-8 h-8 mb-4 opacity-80" />
              <p className="text-3xl font-display font-bold mb-1">
                {stat.value}
              </p>
              <p className="text-sm opacity-90">{stat.label}</p>
            </motion.div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-navy-800 rounded-2xl p-6 shadow-xl sticky top-24">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full mx-auto mb-4 flex items-center justify-center text-navy-900 font-display font-bold text-3xl">
                    {initials}
                  </div>
                  {isEstateOwner &&
                  <span className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-navy-900 dark:bg-cream flex items-center justify-center">
                      <ShieldIcon className="w-4 h-4 text-gold-500" />
                    </span>
                  }
                </div>
                <h2 className="text-xl font-display font-bold text-navy-900 dark:text-cream truncate">
                  {user.name}
                </h2>
                <p className="text-navy-600 dark:text-navy-400 text-sm truncate">
                  {user.email || user.phone}
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                  {isEstateOwner &&
                  <span className="px-2 py-0.5 bg-gold-500/10 text-gold-600 dark:text-gold-400 text-[10px] font-semibold rounded-full">
                      ESTATE OWNER
                    </span>
                  }
                  {user.role === 'agent' &&
                  <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-semibold rounded-full">
                      AGENT
                    </span>
                  }
                  {user.emailVerified &&
                  <span className="px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-semibold rounded-full flex items-center gap-1">
                      <CheckCircleIcon className="w-3 h-3" />
                      Email
                    </span>
                  }
                  {user.phoneVerified &&
                  <span className="px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-semibold rounded-full flex items-center gap-1">
                      <CheckCircleIcon className="w-3 h-3" />
                      WhatsApp
                    </span>
                  }
                </div>
              </div>

              <nav className="space-y-1">
                {tabs.map((tab) =>
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-gold-500 text-navy-900' : 'text-navy-700 dark:text-cream hover:bg-navy-100 dark:hover:bg-navy-700'}`}>
                  
                    <span className="flex items-center gap-3">
                      <tab.icon className="w-4 h-4" />
                      <span className="font-semibold text-sm">{tab.label}</span>
                    </span>
                    {tab.count !== undefined && tab.count > 0 &&
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === tab.id ? 'bg-navy-900 text-gold-500' : 'bg-gold-500/20 text-gold-600 dark:text-gold-400'}`}>
                    
                        {tab.count}
                      </span>
                  }
                  </button>
                )}

                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors mt-4">
                  
                  <LogOutIcon className="w-4 h-4" />
                  <span className="font-semibold text-sm">Sign out</span>
                </button>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-navy-800 rounded-2xl p-8 shadow-xl">
              {activeTab === 'profile' &&
              <div>
                  {isEstateOwner && pendingProperties.length > 0 &&
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 8
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  className="mb-6 p-4 rounded-xl border border-gold-500/35 bg-gold-500/10 text-navy-800 dark:text-cream">
                  
                      <div className="flex items-start gap-3">
                        <ShieldIcon className="w-5 h-5 text-gold-600 dark:text-gold-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="font-display font-bold text-navy-900 dark:text-cream">
                            {pendingProperties.length}{' '}
                            {pendingProperties.length === 1 ? 'listing' : 'listings'}{' '}
                            in your review queue
                          </p>
                          <p className="text-sm text-navy-600 dark:text-navy-300 mt-1">
                            New submissions stay in Pending Review until you
                            approve them — they are not public yet.
                          </p>
                          <Button
                          variant="primary"
                          size="sm"
                          className="mt-3"
                          onClick={() => setActiveTab('estate-control')}>
                          
                            Open Estate Control
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                }

                  {profileSubmissionHighlight === 'fresh' &&
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 8
                  }}
                  animate={{
                    opacity: 1,
                    y: 0
                  }}
                  className="mb-6 p-5 rounded-xl border border-gold-500/35 bg-gold-500/10 text-navy-800 dark:text-cream">
                  
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                          <CheckIcon className="w-6 h-6 text-navy-900" />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="text-xl font-display font-bold text-navy-900 dark:text-cream mb-2">
                            Listing Submitted!
                          </h3>
                          <p className="text-sm text-navy-700 dark:text-navy-200 mb-4">
                            Your property is in{' '}
                            <strong>Pending Review</strong>. The Vertex Estate
                            Owner personally approves every listing — nothing is
                            published until then.
                          </p>
                          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                            <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setProfileSubmissionHighlight('none');
                              setActiveTab('listings');
                            }}>
                            
                              View My Listings
                            </Button>
                            <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setProfileSubmissionHighlight('none')}>
                            
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                }

                  {profileSubmissionHighlight === 'none' && myPendingCount > 0 &&
                <div className="mb-6 p-4 rounded-xl border border-gold-500/30 bg-gold-500/10 flex flex-wrap items-center gap-3 text-sm text-navy-800 dark:text-cream">
                      <ClockIcon className="w-5 h-5 text-gold-600 dark:text-gold-400 flex-shrink-0" />
                      <p className="flex-1 min-w-[200px]">
                        You have{' '}
                        <strong>
                          {myPendingCount}{' '}
                          {myPendingCount === 1 ? 'property' : 'properties'}
                        </strong>{' '}
                        in <strong>Pending Review</strong>. Track them under My
                        Listings.
                      </p>
                      <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setActiveTab('listings')}>
                    
                        My Listings
                      </Button>
                    </div>
                }

                  <h2 className="text-2xl font-display font-bold text-navy-900 dark:text-cream mb-6">
                    Profile Information
                  </h2>
                  <div className="space-y-4">
                    <Input
                    label="Full Name"
                    value={profileDraft.name}
                    onChange={(e) =>
                    setProfileDraft({
                      ...profileDraft,
                      name: e.target.value
                    })
                    } />
                  
                    <div>
                      <Input
                      label="Email"
                      type="email"
                      value={profileDraft.email}
                      onChange={(e) =>
                      setProfileDraft({
                        ...profileDraft,
                        email: e.target.value
                      })
                      } />
                    
                      {!user.emailVerified && profileDraft.email &&
                    <p className="text-xs text-gold-600 dark:text-gold-400 mt-1 flex items-center gap-1">
                          <AlertCircleIcon className="w-3.5 h-3.5" />
                          Email not verified
                        </p>
                    }
                    </div>
                    <div>
                      <Input
                      label="Phone / WhatsApp"
                      type="tel"
                      value={profileDraft.phone}
                      onChange={(e) =>
                      setProfileDraft({
                        ...profileDraft,
                        phone: e.target.value
                      })
                      } />
                    
                      {!user.phoneVerified && profileDraft.phone &&
                    <p className="text-xs text-gold-600 dark:text-gold-400 mt-1 flex items-center gap-1">
                          <AlertCircleIcon className="w-3.5 h-3.5" />
                          Phone not verified
                        </p>
                    }
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-700 dark:text-cream mb-2">
                        Bio
                      </label>
                      <textarea
                      rows={4}
                      value={profileDraft.bio}
                      onChange={(e) =>
                      setProfileDraft({
                        ...profileDraft,
                        bio: e.target.value
                      })
                      }
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-3 rounded-lg border-2 border-navy-200 dark:border-navy-600 bg-white dark:bg-navy-800 text-navy-900 dark:text-cream focus:border-gold-500 outline-none" />
                    
                    </div>
                    <div className="flex items-center gap-4">
                      <Button variant="primary" onClick={handleSaveProfile}>
                        Save Changes
                      </Button>
                      {savedMessage &&
                    <motion.span
                      initial={{
                        opacity: 0,
                        x: -10
                      }}
                      animate={{
                        opacity: 1,
                        x: 0
                      }}
                      className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                      
                          <CheckCircleIcon className="w-4 h-4" />
                          {savedMessage}
                        </motion.span>
                    }
                    </div>
                  </div>
                </div>
              }

              {activeTab === 'saved' &&
              <div>
                  <h2 className="text-2xl font-display font-bold text-navy-900 dark:text-cream mb-6">
                    Saved Properties ({savedProperties.length})
                  </h2>
                  {savedProperties.length > 0 ?
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {savedProperties.map((property) =>
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onClick={() => navigate(`/property/${property.id}`)} />

                  )}
                    </div> :

                <div className="text-center py-12">
                      <BookmarkIcon className="w-16 h-16 text-navy-400 mx-auto mb-4" />
                      <p className="text-xl text-navy-600 dark:text-navy-400 mb-4">
                        No saved properties yet
                      </p>
                      <Button
                    variant="primary"
                    onClick={() => navigate('/listings')}>
                    
                        Browse Properties
                      </Button>
                    </div>
                }
                </div>
              }

              {activeTab === 'favorites' &&
              <div>
                  <h2 className="text-2xl font-display font-bold text-navy-900 dark:text-cream mb-6">
                    Favorite Properties ({favoriteProperties.length})
                  </h2>
                  {favoriteProperties.length > 0 ?
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {favoriteProperties.map((property) =>
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onClick={() => navigate(`/property/${property.id}`)} />

                  )}
                    </div> :

                <div className="text-center py-12">
                      <HeartIcon className="w-16 h-16 text-navy-400 mx-auto mb-4" />
                      <p className="text-xl text-navy-600 dark:text-navy-400 mb-4">
                        No favorites yet — tap the heart on any property
                      </p>
                      <Button
                    variant="primary"
                    onClick={() => navigate('/listings')}>
                    
                        Browse Properties
                      </Button>
                    </div>
                }
                </div>
              }

              {activeTab === 'listings' &&
              <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-display font-bold text-navy-900 dark:text-cream">
                      My Listings
                    </h2>
                    <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setActiveTab('upload')}>
                    
                      <UploadIcon className="w-4 h-4 mr-2" />
                      New Listing
                    </Button>
                  </div>
                  <MyListings onCreateNew={() => setActiveTab('upload')} />
                </div>
              }

              {activeTab === 'upload' &&
              <div>
                  <h2 className="text-2xl font-display font-bold text-navy-900 dark:text-cream mb-2">
                    List Your Property
                  </h2>
                  <p className="text-sm text-navy-600 dark:text-navy-400 mb-6">
                    {isEstateOwner ?
                    <>
                          Even listings you add yourself go to{' '}
                          <strong>Pending Review</strong> first — same rule as
                          everyone else. Approve them in{' '}
                          <strong>Owner view</strong> or <strong>Estate Control</strong>{' '}
                          before they appear in public search.
                        </> :

                    <>
                          Every submission is reviewed by the Estate Owner before
                          it can appear in public search — members and agents
                          cannot self-publish.
                        </>
                    }
                  </p>
                  <UploadPropertyForm
                  onSuccess={() => {
                    setProfileSubmissionHighlight('none');
                    setActiveTab('listings');
                  }}
                  onListingCreated={() =>
                  setProfileSubmissionHighlight('fresh')
                  } />
                
                </div>
              }

              {activeTab === 'settings' &&
              <div>
                  <h2 className="text-2xl font-display font-bold text-navy-900 dark:text-cream mb-6">
                    Settings
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-navy-900 dark:text-cream mb-4">
                        Notifications
                      </h3>
                      <div className="space-y-3">
                        {[
                      'Email notifications',
                      'WhatsApp alerts',
                      'Push notifications',
                      'Marketing emails'].
                      map((setting) =>
                      <label
                        key={setting}
                        className="flex items-center gap-3 cursor-pointer">
                        
                            <input
                          type="checkbox"
                          defaultChecked
                          className="w-5 h-5 text-gold-500 rounded focus:ring-gold-500" />
                        
                            <span className="text-navy-700 dark:text-cream">
                              {setting}
                            </span>
                          </label>
                      )}
                      </div>
                    </div>
                    <div className="pt-6 border-t border-navy-200 dark:border-navy-700">
                      <h3 className="text-lg font-semibold text-navy-900 dark:text-cream mb-4">
                        Privacy
                      </h3>
                      <div className="space-y-3">
                        {[
                      'Show profile publicly',
                      'Allow contact from agents',
                      'Share activity'].
                      map((setting) =>
                      <label
                        key={setting}
                        className="flex items-center gap-3 cursor-pointer">
                        
                            <input
                          type="checkbox"
                          defaultChecked
                          className="w-5 h-5 text-gold-500 rounded focus:ring-gold-500" />
                        
                            <span className="text-navy-700 dark:text-cream">
                              {setting}
                            </span>
                          </label>
                      )}
                      </div>
                    </div>
                    <Button variant="primary">Save Settings</Button>
                  </div>
                </div>
              }

              {activeTab === 'estate-control' && isEstateOwner && <EstateOwnerPanel />}
            </div>
          </div>
        </div>
      </div>
    </div>);

}