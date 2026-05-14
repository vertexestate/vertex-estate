import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { AssistantProvider } from './context/AssistantContext';
import { AuthProvider } from './context/AuthContext';
import { SiteContentProvider } from './context/SiteContentContext';
import { PropertiesProvider } from './context/PropertiesContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { PageTransition } from './components/layout/PageTransition';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { ParticlesBackground } from './components/ui/ParticlesBackground';
import { VertexAssistant } from './components/assistant/VertexAssistant';
import { AuthModal } from './components/auth/AuthModal';
import { Home } from './pages/Home';
import { Listings } from './pages/Listings';
import { PropertyDetails } from './pages/PropertyDetails';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Dashboard } from './pages/Dashboard';
import { EstateOwnerView } from './pages/EstateOwnerView';
import { siteConfig } from './config/siteConfig';
import { resolveComingSoonDeadlineMs } from './lib/comingSoonDeadline';
import { ComingSoonOverlay } from './components/layout/ComingSoonOverlay';

function computeComingSoonBoot(): { deadlineMs: number; showSplash: boolean } {
  if (typeof window === 'undefined') {
    return { deadlineMs: 0, showSplash: true };
  }
  if (!siteConfig.showComingSoon) {
    return { deadlineMs: 0, showSplash: true };
  }
  const deadlineMs = resolveComingSoonDeadlineMs({
    fixedUntilMs: siteConfig.comingSoonFixedUntilMs,
    slidingDays: siteConfig.comingSoonSlidingDays,
  });
  const gateOn = deadlineMs > 0 && Date.now() < deadlineMs;
  return { deadlineMs, showSplash: !gateOn };
}
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
          <PageTransition>
              <Home />
            </PageTransition>
          } />
        
        <Route
          path="/listings"
          element={
          <PageTransition>
              <Listings />
            </PageTransition>
          } />
        
        <Route
          path="/property/:id"
          element={
          <PageTransition>
              <PropertyDetails />
            </PageTransition>
          } />
        
        <Route
          path="/about"
          element={
          <PageTransition>
              <About />
            </PageTransition>
          } />
        
        <Route
          path="/contact"
          element={
          <PageTransition>
              <Contact />
            </PageTransition>
          } />
        
        <Route
          path="/dashboard"
          element={
          <PageTransition>
              <Dashboard />
            </PageTransition>
          } />
        
        <Route
          path="/dashboard/owner"
          element={
          <PageTransition>
              <EstateOwnerView />
            </PageTransition>
          } />
        
      </Routes>
    </AnimatePresence>);

}
export function App() {
  const [boot] = useState(() => computeComingSoonBoot());
  const [deadlineMs] = useState(boot.deadlineMs);
  const [isLoading, setIsLoading] = useState(boot.showSplash);
  const [nowTick, setNowTick] = useState(() => Date.now());

  useEffect(() => {
    if (!siteConfig.showComingSoon || deadlineMs <= 0) return;
    if (Date.now() >= deadlineMs) return;
    const id = window.setInterval(() => setNowTick(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [siteConfig.showComingSoon, deadlineMs]);

  const comingSoonActive =
    siteConfig.showComingSoon && deadlineMs > 0 && nowTick < deadlineMs;

  useEffect(() => {
    document.title = siteConfig.documentTitle;
  }, []);

  useEffect(() => {
    if (
      import.meta.env.DEV &&
      siteConfig.showComingSoon &&
      siteConfig.comingSoonFixedUntilMs <= 0 &&
      deadlineMs <= 0
    ) {
      console.warn(
        '[Vertex] Coming soon is on but no deadline is active (sliding window already ended, or storage issue).'
      );
    }
  }, [deadlineMs]);

  return (
    <ThemeProvider>
      <AuthProvider>
        <SiteContentProvider>
        <PropertiesProvider>
          <AssistantProvider>
            <BrowserRouter>
              {isLoading && !comingSoonActive && (
                <LoadingScreen onComplete={() => setIsLoading(false)} />
              )}
              <div className="relative min-h-screen bg-cream dark:bg-navy-900 transition-colors duration-200">
                <ParticlesBackground />
                <div className="relative z-10">
                  <Navbar />
                  <AnimatedRoutes />
                  <Footer />
                </div>
                {!isLoading && <VertexAssistant />}
                <AuthModal />
                {comingSoonActive && <ComingSoonOverlay targetMs={deadlineMs} />}
              </div>
            </BrowserRouter>
          </AssistantProvider>
        </PropertiesProvider>
        </SiteContentProvider>
      </AuthProvider>
    </ThemeProvider>);

}