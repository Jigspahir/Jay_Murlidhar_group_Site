import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight, ChevronDown, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { JMG_CATEGORIES, JMG_COMPANIES, getCompanyById } from '../data/jmgEcosystem';
import { JMGDomainGlyph } from './ecosystem/glyphs';

export default function Navbar({ onOpenContact }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [ecosystemDropdownOpen, setEcosystemDropdownOpen] = useState(false);
  const [mobileEcosystemOpen, setMobileEcosystemOpen] = useState(false);
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
        setEcosystemDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change or Escape key
  useEffect(() => {
    setEcosystemDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setEcosystemDropdownOpen(false);
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

  const isLightHeader = true;

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] transition-all duration-300 ${
          scrolled ? 'py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]' : 'py-3.5'
        }`}
      >
        <div className="max-w-[1240px] mx-auto px-5 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex items-center justify-between">
          
          {/* Official Jay Murlidhar Group Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 focus:outline-none"
            aria-label="Jay Murlidhar Group Home"
          >
            <img 
              src="/assets/jay-murlidhar-group-logo.png" 
              alt="Jay Murlidhar Group" 
              className="h-9 sm:h-10 w-auto object-contain"
              loading="eager"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors py-1 ${
                location.pathname === '/about'
                  ? isLightHeader ? 'text-[#2563EB] font-semibold' : 'text-[#38BDF8] font-semibold'
                  : isLightHeader ? 'text-[#64748B] hover:text-[#111827]' : 'text-slate-300 hover:text-white'
              }`}
            >
              About
            </Link>

            {/* Ecosystem with Mega-Menu Dropdown */}
            <div 
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setEcosystemDropdownOpen(true)}
              onMouseLeave={() => setEcosystemDropdownOpen(false)}
            >
              <button
                onClick={() => setEcosystemDropdownOpen(!ecosystemDropdownOpen)}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors py-1 ${
                  ecosystemDropdownOpen || location.pathname.startsWith('/ecosystem') || location.pathname.startsWith('/jay-murlidhar-')
                    ? isLightHeader ? 'text-[#2563EB] font-semibold' : 'text-[#38BDF8] font-semibold'
                    : isLightHeader ? 'text-[#64748B] hover:text-[#111827]' : 'text-slate-300 hover:text-white'
                }`}
                aria-expanded={ecosystemDropdownOpen}
              >
                <span>Ecosystem</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  ecosystemDropdownOpen 
                    ? 'rotate-180 text-[#2563EB]' 
                    : isLightHeader ? 'text-[#94A3B8]' : 'text-slate-400'
                }`} />
              </button>

              {/* Clean Structured Mega-Menu (Not Overly Large) */}
              {ecosystemDropdownOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[880px] max-w-[calc(100vw-48px)] pt-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-white border border-[#E2E8F0] rounded-[16px] shadow-[0_12px_36px_rgba(0,0,0,0.08)] overflow-hidden p-6 text-[#111827]">
                    
                    {/* Top Header of Menu */}
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E2E8F0]">
                      <div>
                        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#2563EB] block">
                          Parent Group Directory
                        </span>
                        <span className="text-xs text-[#64748B]">
                          6 Companies operating under one unified ecosystem
                        </span>
                      </div>
                      <Link
                        to="/ecosystem"
                        className="text-xs font-semibold text-[#111827] hover:text-[#2563EB] inline-flex items-center gap-1"
                      >
                        <span>Ecosystem Overview</span>
                        <span>&rarr;</span>
                      </Link>
                    </div>

                    {/* 6 Grouped Columns */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      {JMG_CATEGORIES.map((cat) => {
                        const companies = cat.companyIds
                          .map((id) => getCompanyById(id))
                          .filter(Boolean);

                        return (
                          <div key={cat.id} className="space-y-2">
                            <Link 
                              to={cat.domainRoute} 
                              className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-[#111827] hover:text-[#2563EB] pb-1.5 border-b border-[#E2E8F0]/70 transition-colors group"
                            >
                              <div 
                                className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border"
                                style={{
                                  backgroundColor: `${cat.accent || '#2563EB'}0F`,
                                  borderColor: `${cat.accent || '#2563EB'}30`,
                                  color: cat.accent || '#2563EB'
                                }}
                                aria-hidden="true"
                              >
                                <JMGDomainGlyph domainId={cat.id} className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-[#2563EB]">{cat.number}</span>
                              <span className="text-[#94A3B8]">&mdash;</span>
                              <span className="tracking-wider truncate">{cat.shortName}</span>
                            </Link>

                            <div className="space-y-1">
                              {companies.map((comp) => (
                                <Link
                                  key={comp.id}
                                  to={comp.route || comp.path}
                                  className="block p-1.5 rounded-md hover:bg-slate-50 transition-colors group"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-[#111827] group-hover:text-[#2563EB] transition-colors line-clamp-1">
                                      {comp.name}
                                    </span>
                                    <span className="text-[10px] text-[#94A3B8] group-hover:text-[#2563EB] font-mono pl-1">
                                      &rarr;
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-[#64748B] block truncate">
                                    {comp.subtitle}
                                  </span>
                                  {comp.services && comp.services[0]?.items && (
                                    <div className="mt-1.5 pt-1 border-t border-slate-100 space-y-0.5">
                                      {comp.services.map((s) => (
                                        <div key={s.id || s.title} className="text-[10px] text-slate-500 font-medium flex items-center gap-1 truncate">
                                          <span className="text-[#2563EB] text-[8px]">&bull;</span>
                                          <span>{s.title}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </Link>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom strip */}
                    <div className="mt-5 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
                      <span className="font-mono">Central Ecosystem &bull; Jay Murlidhar Group</span>
                      <Link to="/ecosystem" className="font-semibold text-[#2563EB] hover:underline">
                        Explore Full Architecture Page &rarr;
                      </Link>
                    </div>

                  </div>
                </div>
              )}
            </div>

            <Link
              to="/solutions"
              className={`text-sm font-medium transition-colors py-1 ${
                location.pathname === '/solutions'
                  ? isLightHeader ? 'text-[#2563EB] font-semibold' : 'text-[#38BDF8] font-semibold'
                  : isLightHeader ? 'text-[#64748B] hover:text-[#111827]' : 'text-slate-300 hover:text-white'
              }`}
            >
              Solutions
            </Link>

            <Link
              to="/projects"
              className={`text-sm font-medium transition-colors py-1 ${
                location.pathname === '/projects'
                  ? isLightHeader ? 'text-[#2563EB] font-semibold' : 'text-[#38BDF8] font-semibold'
                  : isLightHeader ? 'text-[#64748B] hover:text-[#111827]' : 'text-slate-300 hover:text-white'
              }`}
            >
              Projects
            </Link>

            <Link
              to="/careers"
              className={`text-sm font-medium transition-colors py-1 ${
                location.pathname.startsWith('/careers')
                  ? isLightHeader ? 'text-[#2563EB] font-semibold' : 'text-[#38BDF8] font-semibold'
                  : isLightHeader ? 'text-[#64748B] hover:text-[#111827]' : 'text-slate-300 hover:text-white'
              }`}
            >
              Careers
            </Link>

            <Link
              to="/contact"
              className={`text-sm font-medium transition-colors py-1 ${
                location.pathname === '/contact'
                  ? isLightHeader ? 'text-[#2563EB] font-semibold' : 'text-[#38BDF8] font-semibold'
                  : isLightHeader ? 'text-[#64748B] hover:text-[#111827]' : 'text-slate-300 hover:text-white'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-3 sm:gap-4 w-fit shrink-0">
            {/* Compact Right Action Group: Let's Talk + Shield (20px gap) */}
            <div className="hidden sm:flex items-center gap-5 w-fit shrink-0">
              <button
                onClick={onOpenContact}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-[10px] text-xs sm:text-sm font-medium transition-colors duration-200 ${
                  isLightHeader
                    ? 'bg-[#111827] hover:bg-[#2563EB] text-white'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
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
                  <span className="whitespace-nowrap px-2 py-1 text-[11px] font-medium text-white bg-[#0F172A] rounded shadow-md">
                    Secure Access
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button (Min 44px touch target) */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className={`lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-md transition-colors ${
                isLightHeader ? 'text-[#111827] hover:bg-slate-100' : 'text-white hover:bg-white/10'
              }`}
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
                onClick={() => setMobileMenuOpen(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-md text-[#111827] hover:bg-slate-200 transition-colors"
                aria-label="Close Menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="space-y-3">
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xl font-bold text-[#111827] hover:text-[#2563EB] py-2 min-h-[44px] flex items-center"
              >
                About
              </Link>

              {/* Mobile Ecosystem Accordion */}
              <div className="py-2 border-y border-[#E2E8F0]">
                <div className="flex items-center justify-between py-1">
                  <Link
                    to="/ecosystem"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xl font-bold text-[#2563EB] flex items-center min-h-[44px]"
                  >
                    Ecosystem &amp; Services
                  </Link>
                  <button
                    onClick={() => setMobileEcosystemOpen(!mobileEcosystemOpen)}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-[#64748B] hover:text-[#111827]"
                    aria-label="Toggle Ecosystem Companies"
                  >
                    <ChevronDown className={`w-5 h-5 transition-transform ${mobileEcosystemOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {mobileEcosystemOpen && (
                  <div className="mt-3 pl-3 space-y-4 pb-2">
                    {JMG_CATEGORIES.map((cat) => {
                      const companies = cat.companyIds
                        .map((id) => getCompanyById(id))
                        .filter(Boolean);

                      return (
                        <div key={cat.id} className="space-y-1.5">
                          <span className="font-mono text-xs font-semibold text-[#94A3B8] uppercase">
                            {cat.name}
                          </span>
                          <div className="space-y-1">
                            {companies.map((comp) => (
                              <Link
                                key={comp.id}
                                to={comp.route || comp.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block text-sm font-semibold text-[#111827] hover:text-[#2563EB] py-1.5 min-h-[36px]"
                              >
                                {comp.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    })}
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
                to="/projects"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xl font-bold text-[#111827] hover:text-[#2563EB] py-2 min-h-[44px] flex items-center"
              >
                Projects
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

              {/* Admin Panel & Secure Access Link with accessible text and touch target */}
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
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="w-full min-h-[48px] py-3.5 rounded-[10px] bg-[#111827] hover:bg-[#2563EB] active:bg-[#1E40AF] text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Let's Talk &bull; Get a Quote</span>
              <ArrowRight className="w-4 h-4 text-blue-300" />
            </button>
            <div className="text-center font-mono text-xs text-[#94A3B8]">
              One Group. Multiple Businesses. One Ecosystem.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
