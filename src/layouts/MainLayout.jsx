import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import ScrollToTop from '../components/ScrollToTop';

export default function MainLayout() {
  const [contactOpen, setContactOpen] = useState(false);
  const [contactInitialData, setContactInitialData] = useState(null);

  const handleOpenContact = (data) => {
    if (data && typeof data === 'object') {
      setContactInitialData(data);
    } else {
      setContactInitialData(null);
    }
    setContactOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827] font-sans flex flex-col selection:bg-[#2563EB]/15 selection:text-[#2563EB]">
      <ScrollToTop />
      
      {/* Global Navigation */}
      <Navbar onOpenContact={handleOpenContact} />

      {/* Main Page Content */}
      <main className="flex-1">
        <Outlet context={{ onOpenContact: handleOpenContact }} />
      </main>

      {/* Global Footer */}
      <Footer onOpenContact={handleOpenContact} />

      {/* Direct Contact Modal */}
      <ContactModal
        key={contactInitialData ? `${contactInitialData.interest || ''}-${contactInitialData.message || ''}-${contactOpen}` : `modal-${contactOpen}`}
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        initialData={contactInitialData}
      />
    </div>
  );
}
