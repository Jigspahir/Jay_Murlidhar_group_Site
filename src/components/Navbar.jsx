import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight, ChevronDown, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import MegaMenu from './MegaMenu';
import { JMG_BUSINESS_DOMAINS } from '../data/businessesData';

export default function Navbar({ onOpenContact }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [businessesDropdownOpen, setBusinessesDropdownOpen] = useState(false);
  const [mobileBusinessesOpen, setMobileBusinessesOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setBusinessesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change or Escape key
  useEffect(() => {
    setBusinessesDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setBusinessesDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const isBusinessesActive = 
    location.pathname === '/businesses' || 
    location.pathname.startsWith('/ecosystem') || 
    location.pathname.startsWith('/technology') ||
    location.pathname.startsWith('/jan-suvidha') ||
    location.pathname.startsWith('/insurance') ||
    location.pathname.startsWith('/business-services') ||
    location.pathname.startsWith('/travel') ||
    location.pathname.startsWith('/retail') ||
    location.pathname.startsWith('/jay-murlidhar-');

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] transition-all duration-300 ${
          scrolled ? 'py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]' : 'py-3.5'
        }`}
      >
        <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex items-center justify-between">
          
          {/* Official Jay Murlidhar Group Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 focus:outline-none"
            aria-label="Jay Murlidhar Group Home"
          >
            <img 
              src="/assets/jay-murlidhar-group-logo.png" 
              alt="Jay Murlidhar Group" 
              className="h-8 xs:h-9 sm:h-10 w-auto object-contain"
              loading="eager"
            />
          </Link>

          {/* Desktop Navigation Links — Unified Structure: About, Our Businesses, Solutions, Careers, Contact */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors py-1 ${
                location.pathname === '/about'
                  ? 'text-[#2563EB] font-semibold'
                  : 'text-[#64748B] hover:text-[#111827]'
              }`}
            >
              About
            </Link>

            {/* Unified Our Businesses with Two-Panel Mega Menu */}
            <div 
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setBusinessesDropdownOpen(true)}
              onMouseLeave={() => setBusinessesDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setBusinessesDropdownOpen(!businessesDropdownOpen)}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors py-1 cursor-pointer ${
                  businessesDropdownOpen || isBusinessesActive
                    ? 'text-[#2563EB] font-semibold'
                    : 'text-[#64748B] hover:text-[#111827]'
                }`}
                aria-expanded={businessesDropdownOpen}
              >
                <span>Our Businesses</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  businessesDropdownOpen 
                    ? 'rotate-180 text-[#2563EB]' 
                    : 'text-[#94A3B8]'
                }`} />
              </button>

              {/* Two-Panel Mega Menu Component */}
              <MegaMenu 
                isOpen={businessesDropdownOpen} 
                onClose={() => setBusinessesDropdownOpen(false)} 
                onOpenContact={onOpenContact}
              />
            </div>

            <Link
              to="/solutions"
              className={`text-sm font-medium transition-colors py-1 ${
                location.pathname === '/solutions'
                  ? 'text-[#2563EB] font-semibold'
                  : 'text-[#64748B] hover:text-[#111827]'
              }`}
            >
              Solutions
            </Link>

            <Link
              to="/careers"
              className={`text-sm font-medium transition-colors py-1 ${
                location.pathname.startsWith('/careers')
                  ? 'text-[#2563EB] font-semibold'
                  : 'text-[#64748B] hover:text-[#111827]'
              }`}
            >
              Careers
            </Link>

            <Link
              to="/contact"
              className={`text-sm font-medium transition-colors py-1 ${
                location.pathname === '/contact'
                  ? 'text-[#2563EB] font-semibold'
                  : 'text-[#64748B] hover:text-[#111827]'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-3 sm:gap-4 w-fit shrink-0">
            {/* Compact Right Action Group: Let's Talk + Shield */}
            <div className="hidden sm:flex items-center gap-5 w-fit shrink-0">
              <button
                type="button"
                onClick={onOpenContact}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-xs sm:text-sm font-medium transition-colors duration-200 bg-[#111827] hover:bg-[#2563EB] text-white cursor-pointer"
              >
                <span>Let's Talk</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-200" />
              </button>

              {/* Discreet Secure Access / Admin Portal Icon */}
              <div className="relative group/access flex items-center">
                <Link
                  to="/admin/login"
                  aria-label="Secure Access"
                  title="Secure Access"
                  className="flex items-center justify-center p-2 rounded-md text-[#64748B] hover:text-[#111827] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:text-[#111827] transition-colors duration-150"
                >
                  <ShieldCheck className="w-[19px] h-[19px]" aria-hidden="true" />
                </Link>
                <div className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-1 hidden group-hover/access:flex group-focus-within/access:flex flex-col items-center z-50 animate-in fade-in duration-150">
                  <span className="w-1.5 h-1.5 -mb-0.5 rotate-45 bg-[#0F172A]"></span>
                  <span className="bg-[#0F172A] text-white text-[10px] font-mono font-medium py-1 px-2.5 rounded whitespace-nowrap shadow-lg">
                    Admin Portal
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-md transition-colors text-[#111827] hover:bg-slate-100"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </header>

      {/* Clean Full-Screen Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#FAFAFA] flex flex-col justify-between p-5 sm:p-8 overflow-y-auto animate-in fade-in duration-200">
          <div>
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 mb-5">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <img 
                  src="/assets/jay-murlidhar-group-logo.png" 
                  alt="Jay Murlidhar Group" 
                  className="h-9 w-auto object-contain"
                />
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-md text-[#111827] hover:bg-slate-200 transition-colors"
                aria-label="Close Menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Nav Links — Consolidated 5 items */}
            <nav className="space-y-3">
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xl font-bold text-[#111827] hover:text-[#2563EB] py-2 min-h-[44px] flex items-center"
              >
                About
              </Link>

              {/* Mobile Our Businesses Accordion */}
              <div className="py-2 border-y border-[#E2E8F0]">
                <div className="flex items-center justify-between py-1">
                  <Link
                    to="/businesses"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xl font-bold text-[#2563EB] flex items-center min-h-[44px]"
                  >
                    Our Businesses
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMobileBusinessesOpen(!mobileBusinessesOpen)}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-[#64748B] hover:text-[#111827]"
                    aria-label="Toggle Businesses Directory"
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform ${mobileBusinessesOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {mobileBusinessesOpen && (
                  <div className="mt-3 pl-3 space-y-4 pb-2">
                    {JMG_BUSINESS_DOMAINS.map((domain) => (
                      <div key={domain.id} className="space-y-1.5 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#2563EB]">
                            {domain.number}
                          </span>
                          <span className="font-mono text-xs font-semibold text-[#94A3B8] uppercase">
                            {domain.name}
                          </span>
                        </div>
                        <div className="space-y-1 pl-4">
                          <Link
                            to={domain.company.route}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-sm font-semibold text-[#111827] hover:text-[#2563EB] py-1"
                          >
                            {domain.company.name} &rarr;
                          </Link>
                          <span className="text-xs text-[#64748B] block">
                            {domain.services.length} Verified Services
                          </span>
                        </div>
                      </div>
                    ))}
                    <Link
                      to="/businesses"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-bold text-[#2563EB] pt-1"
                    >
                      Explore Complete Businesses Directory &rarr;
                    </Link>
                  </div>
                )}
              </div>

              <Link
                to="/solutions"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xl font-bold text-[#111827] hover:text-[#2563EB] py-2 min-h-[44px] flex items-center"
              >
                Solutions
              </Link>

              <Link
                to="/careers"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xl font-bold text-[#111827] hover:text-[#2563EB] py-2 min-h-[44px] flex items-center"
              >
                Careers
              </Link>

              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xl font-bold text-[#111827] hover:text-[#2563EB] py-2 min-h-[44px] flex items-center text-left w-full"
              >
                Contact
              </Link>

              {/* Admin Panel & Secure Access Link */}
              <div className="pt-2 border-t border-[#E2E8F0]/80">
                <Link
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 text-base font-semibold text-[#64748B] hover:text-[#111827] py-2 min-h-[44px]"
                >
                  <ShieldCheck className="w-5 h-5 text-[#2563EB]" aria-hidden="true" />
                  <span>Admin Portal / Secure Access</span>
                </Link>
              </div>
            </nav>
          </div>

          <div className="pt-6 border-t border-[#E2E8F0] space-y-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenContact) onOpenContact();
              }}
              className="w-full min-h-[48px] py-3.5 rounded-[10px] bg-[#111827] hover:bg-[#2563EB] active:bg-[#1E40AF] text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Let's Talk &bull; Get a Quote</span>
              <ArrowRight className="w-4 h-4 text-blue-300" />
            </button>
            <div className="text-center font-mono text-xs text-[#94A3B8]">
              One Group. Six Business Domains. Connected Solutions.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
