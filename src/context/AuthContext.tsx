import React, { useEffect, useState, createContext, useContext } from 'react';
import { UserRole } from '../types';
import { siteConfig } from '../config/siteConfig';
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  bio?: string;
  role: UserRole;
  emailVerified: boolean;
  phoneVerified: boolean;
  /** Estate Owner–granted trust badge (agents & members). */
  vertexVerified?: boolean;
  createdAt: number;
  savedProperties: string[];
  favoriteProperties: string[];
}
interface PendingVerification {
  type: 'email' | 'whatsapp';
  destination: string;
  code: string;
  userData: Partial<User> & {
    password?: string;
  };
  mode: 'login' | 'signup';
}
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  /** The official Vertex Estate platform owner — full control. */
  isEstateOwner: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  initialAuthMode: 'login' | 'signup';
  pendingVerification: PendingVerification | null;
  startSignup: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => string;
  startEmailLogin: (
  email: string,
  password: string)
  => {
    ok: boolean;
    error?: string;
    code?: string;
  };
  startWhatsAppLogin: (phone: string) => string;
  verifyCode: (code: string) => {
    ok: boolean;
    error?: string;
  };
  resendCode: () => string;
  cancelVerification: () => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  toggleSavedProperty: (id: string) => void;
  toggleFavoriteProperty: (id: string) => void;
  // Estate Owner controls
  allUsers: () => User[];
  setUserRole: (userId: string, role: 'user' | 'agent') => void;
  setVertexVerified: (userId: string, verified: boolean) => void;
  deleteUser: (userId: string) => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
const USER_STORAGE = 'vertex-user';
const USERS_DB = 'vertex-users-db';
interface StoredUser extends User {
  password?: string;
}
function loadUsersDB(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_DB) || '[]');
  } catch {
    return [];
  }
}
function saveUsersDB(users: StoredUser[]) {
  localStorage.setItem(USERS_DB, JSON.stringify(users));
}
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
function migrateLegacyRoles(db: StoredUser[]): boolean {
  let changed = false;
  for (const u of db) {
    const r = u.role as string;
    if (r === 'admin') {
      u.role = 'estate_owner';
      changed = true;
    }
  }
  return changed;
}

/** One curated super-admin; listings cannot go live without this account class. */
function seedEstateOwner() {
  const db = loadUsersDB();
  migrateLegacyRoles(db);
  const legacy = db.find((u) => u.email === 'admin@vertex.com');
  if (legacy) {
    legacy.role = 'estate_owner';
    legacy.vertexVerified = true;
    if (legacy.name === 'Vertex Admin') legacy.name = 'Vertex Estate Owner';
  }
  if (!db.some((u) => u.role === 'estate_owner')) {
    db.push({
      id: 'estate-owner-vertex',
      name: siteConfig.estateOwnerName,
      email: siteConfig.estateOwnerEmail,
      phone: siteConfig.estateOwnerPhone,
      role: 'estate_owner',
      emailVerified: true,
      phoneVerified: true,
      vertexVerified: true,
      createdAt: Date.now(),
      savedProperties: [],
      favoriteProperties: [],
      password: siteConfig.estateOwnerPassword,
    });
  }
  saveUsersDB(db);
}
export function AuthProvider({ children }: {children: React.ReactNode;}) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [initialAuthMode, setInitialAuthMode] = useState<'login' | 'signup'>(
    'login'
  );
  const [pendingVerification, setPendingVerification] =
  useState<PendingVerification | null>(null);
  useEffect(() => {
    seedEstateOwner();
    const stored = localStorage.getItem(USER_STORAGE);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as User & { role?: string };
        if (parsed.role === 'admin') parsed.role = 'estate_owner';
        if (!parsed.role) parsed.role = 'user';
        setUser(parsed);
      } catch {

        /* noop */}
    }
  }, []);
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE, JSON.stringify(user));
      const db = loadUsersDB();
      const idx = db.findIndex((u) => u.id === user.id);
      if (idx >= 0) {
        db[idx] = {
          ...db[idx],
          ...user
        };
        saveUsersDB(db);
      }
    }
  }, [user]);
  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setInitialAuthMode(mode);
    setIsAuthModalOpen(true);
  };
  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingVerification(null);
  };
  const startSignup = (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    const code = generateCode();
    setPendingVerification({
      type: 'email',
      destination: data.email,
      code,
      userData: {
        ...data,
        role: 'user'
      },
      mode: 'signup'
    });
    return code;
  };
  const startEmailLogin = (email: string, password: string) => {
    const db = loadUsersDB();
    const found = db.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found)
    return {
      ok: false,
      error: 'No account found with this email.'
    };
    if (found.password !== password)
    return {
      ok: false,
      error: 'Incorrect password.'
    };
    const code = generateCode();
    setPendingVerification({
      type: 'email',
      destination: email,
      code,
      userData: found,
      mode: 'login'
    });
    return {
      ok: true,
      code
    };
  };
  const startWhatsAppLogin = (phone: string) => {
    const code = generateCode();
    const db = loadUsersDB();
    const existing = db.find((u) => u.phone === phone);
    setPendingVerification({
      type: 'whatsapp',
      destination: phone,
      code,
      userData: existing || {
        phone,
        name: '',
        email: '',
        role: 'user'
      },
      mode: existing ? 'login' : 'signup'
    });
    return code;
  };
  const verifyCode = (code: string) => {
    if (!pendingVerification)
    return {
      ok: false,
      error: 'No verification pending.'
    };
    if (code !== pendingVerification.code) {
      return {
        ok: false,
        error: 'Invalid verification code. Try again.'
      };
    }
    const db = loadUsersDB();
    const { userData, type, mode } = pendingVerification;
    let activeUser: User;
    if (mode === 'signup' && type === 'email') {
      const newUser: StoredUser = {
        id: `user-${Date.now()}`,
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        role: 'user',
        emailVerified: true,
        phoneVerified: false,
        vertexVerified: false,
        createdAt: Date.now(),
        savedProperties: [],
        favoriteProperties: [],
        password: userData.password
      };
      db.push(newUser);
      saveUsersDB(db);
      const { password, ...publicUser } = newUser;
      activeUser = publicUser;
    } else if (mode === 'signup' && type === 'whatsapp') {
      const newUser: StoredUser = {
        id: `user-${Date.now()}`,
        name: userData.name || `User ${userData.phone?.slice(-4) || ''}`,
        email: userData.email || '',
        phone: userData.phone || '',
        role: 'user',
        emailVerified: false,
        phoneVerified: true,
        vertexVerified: false,
        createdAt: Date.now(),
        savedProperties: [],
        favoriteProperties: []
      };
      db.push(newUser);
      saveUsersDB(db);
      activeUser = newUser;
    } else {
      const existing = db.find(
        (u) =>
        u.id === userData.id ||
        u.email === userData.email ||
        u.phone === userData.phone
      );
      if (!existing)
      return {
        ok: false,
        error: 'Account not found.'
      };
      if (type === 'email') existing.emailVerified = true;
      if (type === 'whatsapp') existing.phoneVerified = true;
      if (!existing.role) existing.role = 'user';
      if ((existing.role as string) === 'admin') existing.role = 'estate_owner';
      saveUsersDB(db);
      const { password, ...publicUser } = existing;
      activeUser = publicUser;
    }
    setUser(activeUser);
    setPendingVerification(null);
    setIsAuthModalOpen(false);
    return {
      ok: true
    };
  };
  const resendCode = () => {
    if (!pendingVerification) return '';
    const code = generateCode();
    setPendingVerification({
      ...pendingVerification,
      code
    });
    return code;
  };
  const cancelVerification = () => setPendingVerification(null);
  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE);
  };
  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    setUser({
      ...user,
      ...updates
    });
  };
  const toggleSavedProperty = (id: string) => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    setUser({
      ...user,
      savedProperties: user.savedProperties.includes(id) ?
      user.savedProperties.filter((p) => p !== id) :
      [...user.savedProperties, id]
    });
  };
  const toggleFavoriteProperty = (id: string) => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    setUser({
      ...user,
      favoriteProperties: user.favoriteProperties.includes(id) ?
      user.favoriteProperties.filter((p) => p !== id) :
      [...user.favoriteProperties, id]
    });
  };
  const allUsers = (): User[] => {
    return loadUsersDB().map(({ password, ...u }) => u);
  };
  const setUserRole = (userId: string, role: 'user' | 'agent') => {
    if (user?.role !== 'estate_owner') return;
    const db = loadUsersDB();
    const idx = db.findIndex((u) => u.id === userId);
    if (idx < 0 || db[idx].role === 'estate_owner') return;
    db[idx].role = role;
    saveUsersDB(db);
    if (user?.id === userId)
      setUser({
        ...user,
        role,
      });
  };
  const setVertexVerified = (userId: string, verified: boolean) => {
    if (user?.role !== 'estate_owner') return;
    const db = loadUsersDB();
    const idx = db.findIndex((u) => u.id === userId);
    if (idx < 0 || db[idx].role === 'estate_owner') return;
    db[idx].vertexVerified = verified;
    saveUsersDB(db);
    if (user?.id === userId)
      setUser({
        ...user,
        vertexVerified: verified,
      });
  };
  const deleteUser = (userId: string) => {
    if (user?.role !== 'estate_owner') return;
    const db = loadUsersDB();
    const target = db.find((u) => u.id === userId);
    if (!target || target.role === 'estate_owner') return;
    saveUsersDB(db.filter((u) => u.id !== userId));
    if (user?.id === userId) logout();
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isEstateOwner: user?.role === 'estate_owner',
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        initialAuthMode,
        pendingVerification,
        startSignup,
        startEmailLogin,
        startWhatsAppLogin,
        verifyCode,
        resendCode,
        cancelVerification,
        logout,
        updateProfile,
        toggleSavedProperty,
        toggleFavoriteProperty,
        allUsers,
        setUserRole,
        setVertexVerified,
        deleteUser
      }}>
      
      {children}
    </AuthContext.Provider>);

}
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}