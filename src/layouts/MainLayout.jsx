import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ContactModal from '../components/ContactModal';
import ScrollToTop from '../components/ScrollToTop';

export default function MainLayout() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#111827] font-sans flex flex-col selection:bg-[#2563EB]/15 selection:text-[#2563EB]">
      <ScrollToTop />
      
      {/* Global Navigation */}
      <Navbar onOpenContact={() => setContactOpen(true)} />

      {/* Main Page Content */}
      <main className="flex-1">
        <Outlet context={{ onOpenContact: () => setContactOpen(true) }} />
      </main>

      {/* Global Footer */}
      <Footer onOpenContact={() => setContactOpen(true)} />

      {/* Direct Contact Modal */}
      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
      />
    </div>
  );
}
