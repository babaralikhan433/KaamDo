import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ServicesSection } from './components/ServicesSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { WorkerProfilesSection } from './components/WorkerProfilesSection';
import { VerificationSection } from './components/VerificationSection';
import { CitiesSection } from './components/CitiesSection';
import { ReviewsSection } from './components/ReviewsSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { BecomeWorkerModal } from './components/BecomeWorkerModal';
import { CustomerAuthModal } from './components/CustomerAuthModal';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { CustomerDashboard } from './components/CustomerDashboard';
import { WorkerDashboard } from './components/WorkerDashboard';
import { AdminPanel } from './components/AdminPanel';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeView, toast } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-emerald-200 selection:text-emerald-950">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'home' && (
          <>
            <HeroSection />
            <ServicesSection />
            <HowItWorksSection />
            <WorkerProfilesSection />
            <VerificationSection />
            <CitiesSection />
            <ReviewsSection />
            <FAQSection />
          </>
        )}

        {activeView === 'customer_dashboard' && <CustomerDashboard />}
        {activeView === 'worker_dashboard' && <WorkerDashboard />}
        {activeView === 'admin_panel' && <AdminPanel />}
      </main>

      {/* Global Modals & Floating Tools */}
      <BookingModal />
      <BecomeWorkerModal />
      <CustomerAuthModal />
      <ServiceDetailModal />
      <WhatsAppButton />

      {/* Footer */}
      <Footer />

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-60 max-w-sm bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-stone-800 flex items-center gap-3 animate-in slide-in-from-bottom-5">
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
          <p className="text-xs font-medium leading-snug">{toast.message}</p>
        </div>
      )}

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
