
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { supabase } from './lib/supabaseClient';
import { api } from './services/api';

// Shared Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
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
import AdminDashboard from './components/AdminDashboard';
import NewsDetail from './components/NewsDetail';
import EDTCorePage from './pages/EDTCorePage';
import TrainingList from './pages/training/TrainingList';
import TrainingDetail from './pages/training/TrainingDetail';

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
const MainLayout: React.FC<{ children: React.ReactNode, user: User | null, setUser: (u: User | null) => void }> = ({ children, user, setUser }) => {
  const [isAssessmentOpen, setIsAssessmentOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLeadCaptureOpen, setIsLeadCaptureOpen] = useState(false);
  const [leadCaptureMode, setLeadCaptureMode] = useState<'download' | 'consultation'>('download');
  const [leadCaptureContext, setLeadCaptureContext] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [chatTrigger, setChatTrigger] = useState<{ message: string; timestamp: number } | null>(null);

  const handleOpenContact = (service: string = '') => {
    setSelectedService(service);
    setIsContactOpen(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearchOpen(true);
  };

  const handleOpenLeadCapture = (mode: 'download' | 'consultation', context: string = '') => {
    setLeadCaptureMode(mode);
    setLeadCaptureContext(context);
    setIsLeadCaptureOpen(true);
  };

  const handleAskAI = (question: string) => {
    setChatTrigger({ message: question, timestamp: Date.now() });
  };

  const handleLogout = () => {
    setUser(null);
  };

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
        onLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        onContact={() => handleOpenContact('General Inquiry')}
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
              onStartAssessment: () => setIsAssessmentOpen(true)
            });
          }
          return child;
        })}
      </main>

      <Footer />
      <ChatWidget externalTrigger={chatTrigger} />

      <AssessmentModal
        isOpen={isAssessmentOpen}
        onClose={() => setIsAssessmentOpen(false)}
        onComplete={() => {
          setIsAssessmentOpen(false);
          handleOpenContact('Assessment Result');
        }}
      />
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        defaultService={selectedService}
      />
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(userData) => setUser(userData)}
      />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        initialQuery={searchQuery}
      />
      <LeadCaptureModal
        isOpen={isLeadCaptureOpen}
        onClose={() => setIsLeadCaptureOpen(false)}
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
  const [user, setUser] = useState<User | null>(null);

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
  }, []);

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ToastProvider>
          <Router>
            <Tracker />
            <Routes>
              {/* Public Routes with Layout */}
              <Route path="/" element={<MainLayout user={user} setUser={setUser}><HomePage /></MainLayout>} />
              <Route path="/edt-core" element={<MainLayout user={user} setUser={setUser}><EDTCorePage /></MainLayout>} />
              <Route path="/news/:id" element={<MainLayout user={user} setUser={setUser}><NewsDetail /></MainLayout>} />
              <Route path="/dao-tao" element={<MainLayout user={user} setUser={setUser}><TrainingList /></MainLayout>} />
              <Route path="/dao-tao/:slug" element={<MainLayout user={user} setUser={setUser}><TrainingDetail /></MainLayout>} />

              {/* Admin Route - No public layout */}
              <Route path="/admin" element={<AdminDashboard />} />

              {/* Fallback */}
              <Route path="*" element={<MainLayout user={user} setUser={setUser}><HomePage /></MainLayout>} />
            </Routes>
          </Router>
        </ToastProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;