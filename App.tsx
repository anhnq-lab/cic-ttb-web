
import React, { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { supabase } from './lib/supabaseClient';
import { api } from './services/api';
import { useAppStore } from './store/useAppStore';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';

// Shared Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { LazyChatWidget } from './components/LazyChatWidget';
import SEO from './components/SEO';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import CookieConsent from './components/CookieConsent';

// Modals
import AssessmentModal from './components/AssessmentModal';
import ContactModal from './components/ContactModal';
import LoginModal from './components/LoginModal';
import SearchModal from './components/SearchModal';
import LeadCaptureModal from './components/LeadCaptureModal';

// Pages/Sections
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import FeaturesSection from './components/FeaturesSection';
import ToolsSection from './components/ToolsSection';
import ServicesSection from './components/ServicesSection';
import ProductSection from './components/ProductSection';
import PricingSection from './components/PricingSection';
import LibrarySection from './components/LibrarySection';
import NewsSection from './components/NewsSection';
import TestimonialSection from './components/TestimonialSection';
import ToolsCTA from './components/ToolsCTA';
import PortfolioSection from './components/PortfolioSection';
import { LoadingSpinner, PageSkeleton } from './components/shared/Loading';

// Lazy load heavy components and pages
const SimpleAdminPanel = lazy(() => import('./components/SimpleAdminPanel'));
const NewsDetail = lazy(() => import('./components/NewsDetail'));
const CICPlatformPage = lazy(() => import('./pages/CICPlatformPage'));
const TrainingList = lazy(() => import('./pages/training/TrainingList'));
const TrainingDetail = lazy(() => import('./pages/training/TrainingDetail'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));

import { saveUTMParams } from './services/utm';
import './index.css';

// Capture UTM params on initial load
saveUTMParams();

interface User {
  name: string;
  email: string;
  role?: string;
}

function Tracker() {
  const location = useLocation();
  useEffect(() => {
    api.trackView(location.pathname).catch(console.error);
  }, [location]);
  return null;
}

// Layout component to wrap public pages
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Zustand store
  const { user, setUser } = useAppStore();
  const { modals, openModal, closeModal } = useAppStore();
  const { selectedService, setSelectedService } = useAppStore();
  const { searchQuery, setSearchQuery } = useAppStore();
  const { leadCaptureMode, leadCaptureContext, setLeadCaptureContext } = useAppStore();
  const { chatTrigger, triggerChat } = useAppStore();

  const handleOpenContact = useCallback((service: string = '') => {
    setSelectedService(service);
    openModal('contact');
  }, [setSelectedService, openModal]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    openModal('search');
  }, [setSearchQuery, openModal]);

  const handleOpenLeadCapture = useCallback((mode: 'download' | 'consultation', context: string = '') => {
    setLeadCaptureContext(mode, context);
    openModal('leadCapture');
  }, [setLeadCaptureContext, openModal]);

  const handleAskAI = useCallback((question: string) => {
    triggerChat(question);
  }, [triggerChat]);

  const handleLogout = useCallback(() => {
    setUser(null);
  }, [setUser]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    }, { threshold: 0.1 });

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [children]); // Re-run when children change (navigation)

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar
        onLogin={useCallback(() => openModal('login'), [openModal])}
        onLogout={handleLogout}
        onContact={useCallback(() => handleOpenContact('General Inquiry'), [handleOpenContact])}
        onSearch={handleSearch}
        user={user}
      />

      <main className="flex-grow">
        {/* Pass handlers to children if they are Home sections */}
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              onOpenContact: handleOpenContact,
              onOpenLeadCapture: handleOpenLeadCapture,
              onAskAI: handleAskAI,
              onStartAssessment: useCallback(() => openModal('assessment'), [openModal])
            });
          }
          return child;
        })}
      </main>

      <Footer />
      <LazyChatWidget externalTrigger={chatTrigger} />

      <AssessmentModal
        isOpen={modals.assessment}
        onClose={useCallback(() => closeModal('assessment'), [closeModal])}
        onComplete={useCallback(() => {
          closeModal('assessment');
          handleOpenContact('Assessment Result');
        }, [closeModal, handleOpenContact])}
      />
      <ContactModal
        isOpen={modals.contact}
        onClose={useCallback(() => closeModal('contact'), [closeModal])}
        defaultService={selectedService}
      />
      <LoginModal
        isOpen={modals.login}
        onClose={useCallback(() => closeModal('login'), [closeModal])}
        onLoginSuccess={useCallback((userData) => setUser(userData), [setUser])}
      />
      <SearchModal
        isOpen={modals.search}
        onClose={useCallback(() => closeModal('search'), [closeModal])}
        initialQuery={searchQuery}
      />
      <LeadCaptureModal
        isOpen={modals.leadCapture}
        onClose={useCallback(() => closeModal('leadCapture'), [closeModal])}
        resourceName={leadCaptureMode === 'download' ? leadCaptureContext : 'Tư vấn Dịch vụ'}
        mode={leadCaptureMode}
        defaultContext={leadCaptureContext}
      />
      <CookieConsent />
    </div>
  );
};

const HomePage: React.FC<any> = ({ onOpenContact, onOpenLeadCapture, onAskAI, onStartAssessment }) => {

  return (
    <>
      <SEO />
      <div className="reveal-on-scroll"><HeroSection onStartAssessment={onStartAssessment} /></div>
      <div className="reveal-on-scroll"><ToolsSection
        onStartAssessment={onStartAssessment}
        onAskAI={onAskAI}
        onDownloadToolkit={() => onOpenLeadCapture('download', 'Bộ công cụ Chuyển đổi số BIM')}
      /></div>
      <div className="reveal-on-scroll"><ServicesSection onConsultation={(service) => onOpenLeadCapture('consultation', service)} /></div>
      <div className="reveal-on-scroll"><PortfolioSection /></div>
      <div className="reveal-on-scroll"><StatsSection /></div>
      <div className="reveal-on-scroll"><ProductSection onContact={() => onOpenContact('CIC-PM')} /></div>
      <div className="reveal-on-scroll"><PricingSection onContact={onOpenContact} /></div>
      <div className="reveal-on-scroll"><LibrarySection onContact={() => onOpenContact('Library')} /></div>
      <div className="reveal-on-scroll"><FeaturesSection /></div>
      <div className="reveal-on-scroll"><TestimonialSection /></div>
      <div className="reveal-on-scroll"><ToolsCTA /></div>
      <div className="reveal-on-scroll"><NewsSection /></div>
    </>
  );
};

function App() {
  const { setUser } = useAppStore();

  // Google OAuth Callback Handler
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const backendUser = await api.verifyGoogleLogin(session.access_token, session.user);
          if (backendUser) {
            setUser({
              name: backendUser.full_name || backendUser.username,
              email: backendUser.email,
              role: backendUser.role
            });
          }
        } catch (err) {
          console.error('Google Auth Sync Error:', err);
        }
      }
      if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ErrorBoundary>
          <ToastProvider>
            <Router>
              <Tracker />
              <Suspense fallback={<PageSkeleton />}>
                <Routes>
                  {/* Public Routes with Layout */}
                  <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
                  <Route path="/cic-platform" element={<MainLayout><CICPlatformPage /></MainLayout>} />
                  <Route path="/news/:id" element={<MainLayout><NewsDetail /></MainLayout>} />
                  <Route path="/dao-tao" element={<MainLayout><TrainingList /></MainLayout>} />
                  <Route path="/dao-tao/:slug" element={<MainLayout><TrainingDetail /></MainLayout>} />
                  <Route path="/du-an" element={<MainLayout><ProjectsPage /></MainLayout>} />

                  {/* Admin Route - No public layout */}
                  <Route path="/admin" element={<SimpleAdminPanel />} />

                  {/* Fallback */}
                  <Route path="*" element={<MainLayout><HomePage /></MainLayout>} />
                </Routes>
              </Suspense>
            </Router>
          </ToastProvider>
        </ErrorBoundary>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;