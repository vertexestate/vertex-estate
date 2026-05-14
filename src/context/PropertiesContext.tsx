import React, { useEffect, useState, createContext, useContext } from 'react';
import { Property, ListingStatus } from '../types';
import { properties as seedProperties } from '../data/properties';
import { useAuth } from './AuthContext';
import { siteConfig } from '../config/siteConfig';
import { getClientApiBase, joinApiUrl } from '../lib/apiBase';
interface PropertiesContextType {
  /** All approved properties (seed + user-approved) visible publicly */
  publicProperties: Property[];
  /** All properties incl. pending (for Estate Owner or listing owners) */
  allProperties: Property[];
  /** Pending listings awaiting Estate Owner approval */
  pendingProperties: Property[];
  /** Current user's own listings */
  myListings: Property[];
  /** Get single property (respecting visibility rules for the current user) */
  getProperty: (id: string) => Property | undefined;
  /** Create a new listing (status: pending) */
  createListing: (
  data: Omit<
    Property,
    'id' | 'ownerId' | 'approvalStatus' | 'createdAt' | 'status' | 'agent'>)

  => string;
  /** Update an existing listing (owner only) */
  updateListing: (id: string, data: Partial<Property>) => void;
  /** Delete a listing (owner or Estate Owner) */
  deleteListing: (id: string) => void;
  /** Approve a pending listing (Estate Owner only) */
  approveListing: (id: string) => void;
  /** Reject a pending listing (Estate Owner only) */
  rejectListing: (id: string) => void;
  /** Live text search across publicProperties */
  searchProperties: (query: string) => Property[];
}
const PropertiesContext = createContext<PropertiesContextType | undefined>(
  undefined
);
const STORAGE_KEY = 'vertex-user-listings';

/** Normalize stored rows so pending queue and filters stay consistent. */
function normalizeListings(raw: Property[]): Property[] {
  return raw.map((p) => ({
    ...p,
    approvalStatus:
      p.approvalStatus ??
      (p.ownerId ? ('pending' as ListingStatus) : undefined),
  }));
}

function loadUserListings(): Property[] {
  try {
    const raw = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    ) as Property[];
    return normalizeListings(raw);
  } catch {
    return [];
  }
}

function saveUserListings(list: Property[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function PropertiesProvider({
  children


}: {children: React.ReactNode;}) {
  const { user, isEstateOwner } = useAuth();
  const [userListings, setUserListings] = useState<Property[]>(() =>
    loadUserListings()
  );
  const [remoteCatalog, setRemoteCatalog] = useState<Property[] | null>(null);
  const [remoteReady, setRemoteReady] = useState(() => !siteConfig.propertiesJsonUrl);
  /** Loaded from Express `GET /properties` when API base is configured (e.g. /api in dev). */
  const [mongoList, setMongoList] = useState<Property[] | undefined>(undefined);
  const [mongoLoadDone, setMongoLoadDone] = useState(false);

  useEffect(() => {
    const base = getClientApiBase();
    if (!base) {
      setMongoLoadDone(true);
      return;
    }
    let cancelled = false;
    fetch(joinApiUrl(base, '/properties'))
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: unknown) => {
        if (cancelled) return;
        if (Array.isArray(data)) setMongoList(data as Property[]);
        else setMongoList([]);
      })
      .catch(() => {
        if (!cancelled) setMongoList(undefined);
      })
      .finally(() => {
        if (!cancelled) setMongoLoadDone(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!siteConfig.propertiesJsonUrl) return;
    let cancelled = false;
    fetch(siteConfig.propertiesJsonUrl)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: unknown) => {
        if (cancelled) return;
        if (Array.isArray(data)) setRemoteCatalog(data as Property[]);
        else setRemoteCatalog([]);
      })
      .catch(() => {
        if (!cancelled) setRemoteCatalog([]);
      })
      .finally(() => {
        if (!cancelled) setRemoteReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);
  // Initial sync from disk (single load — do not reload on user?.id or we can
  // overwrite RAM with stale LS before async save effects run after create).
  useEffect(() => {
    setUserListings(loadUserListings());
  }, []);

  // Cross-tab: another window/tab saved listings → refresh this tab for the owner.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || e.newValue == null) return;
      try {
        const parsed = JSON.parse(e.newValue) as Property[];
        setUserListings(normalizeListings(parsed));
      } catch {
        /* noop */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    saveUserListings(userListings);
  }, [userListings]);
  // Seed + optional remote JSON catalog + user-uploaded rows
  const seedAsApproved: Property[] = seedProperties.map((p) => ({
    ...p,
    approvalStatus: 'approved' as ListingStatus
  }));
  const seedPart = siteConfig.includeSeedProperties ? seedAsApproved : [];
  const remotePart =
    siteConfig.propertiesJsonUrl && remoteReady ? remoteCatalog ?? [] : [];

  const apiBase = getClientApiBase();
  const mongoLayerReady = Boolean(apiBase) && mongoLoadDone && mongoList !== undefined;
  const mongoPart = mongoLayerReady ? mongoList! : [];

  let catalogApproved: Property[];
  if (siteConfig.propertiesJsonUrl && remoteReady) {
    catalogApproved = [...seedPart, ...remotePart];
  } else if (mongoLayerReady) {
    catalogApproved =
      mongoPart.length > 0 ? [...seedPart, ...mongoPart] : [...seedPart];
  } else {
    catalogApproved = siteConfig.includeSeedProperties ? seedAsApproved : [];
  }
  const allProperties = [...catalogApproved, ...userListings];
  const publicProperties = allProperties.filter((p) => {
    const st =
      p.approvalStatus ?? (p.ownerId ? ('pending' as ListingStatus) : 'approved');
    return st === 'approved';
  });
  const pendingProperties = allProperties.filter((p) => {
    const st =
      p.approvalStatus ?? (p.ownerId ? ('pending' as ListingStatus) : 'approved');
    return st === 'pending';
  });
  const myListings = user ?
  userListings.filter((p) => p.ownerId === user.id) :
  [];
  const getProperty = (id: string): Property | undefined => {
    const found = allProperties.find((p) => p.id === id);
    if (!found) return undefined;
    const status: ListingStatus | undefined =
      found.approvalStatus ??
      (found.ownerId ? 'pending' : 'approved');
    if (status === 'approved') return found;
    if (isEstateOwner) return found;
    if (user && found.ownerId === user.id) return found;
    return undefined;
  };
  const createListing: PropertiesContextType['createListing'] = (data) => {
    if (!user) throw new Error('Not authenticated');
    const id = `user-listing-${Date.now()}`;
    const newProperty: Property = {
      ...data,
      priceCurrency: data.priceCurrency ?? 'PKR',
      id,
      ownerId: user.id,
      approvalStatus: 'pending',
      createdAt: Date.now(),
      status: 'available',
      agent: {
        id: user.id,
        name: user.name,
        photo:
        user.avatar ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`,
        phone: user.phone,
        email: user.email,
        rating: 5,
        specialization: 'Property Owner'
      }
    };
    setUserListings((prev) => {
      const next = [newProperty, ...prev];
      saveUserListings(next);
      return next;
    });
    return id;
  };
  const updateListing = (id: string, data: Partial<Property>) => {
    setUserListings((prev) => {
      const next = prev.map((p) => {
        if (p.id !== id) return p;
        if (p.ownerId !== user?.id && !isEstateOwner) return p;
        return {
          ...p,
          ...data
        };
      });
      saveUserListings(next);
      return next;
    });
  };
  const deleteListing = (id: string) => {
    setUserListings((prev) => {
      const next = prev.filter((p) => {
        if (p.id !== id) return true;
        if (p.ownerId === user?.id || isEstateOwner) return false;
        return true;
      });
      saveUserListings(next);
      return next;
    });
  };
  const approveListing = (id: string) => {
    if (!isEstateOwner) return;
    setUserListings((prev) => {
      const next = prev.map((p) =>
        p.id === id ?
          {
            ...p,
            approvalStatus: 'approved' as ListingStatus
          } :
          p
      );
      saveUserListings(next);
      return next;
    });
  };
  const rejectListing = (id: string) => {
    if (!isEstateOwner) return;
    setUserListings((prev) => {
      const next = prev.map((p) =>
        p.id === id ?
          {
            ...p,
            approvalStatus: 'rejected' as ListingStatus
          } :
          p
      );
      saveUserListings(next);
      return next;
    });
  };
  const searchProperties = (query: string): Property[] => {
    if (!query.trim()) return publicProperties;
    const q = query.toLowerCase().trim();
    return publicProperties.filter(
      (p) =>
      p.title.toLowerCase().includes(q) ||
      p.location.city.toLowerCase().includes(q) ||
      p.location.state.toLowerCase().includes(q) ||
      p.location.country.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  };
  return (
    <PropertiesContext.Provider
      value={{
        publicProperties,
        allProperties,
        pendingProperties,
        myListings,
        getProperty,
        createListing,
        updateListing,
        deleteListing,
        approveListing,
        rejectListing,
        searchProperties
      }}>
      
      {children}
    </PropertiesContext.Provider>);

}
export function useProperties() {
  const ctx = useContext(PropertiesContext);
  if (!ctx)
  throw new Error('useProperties must be used within PropertiesProvider');
  return ctx;
}