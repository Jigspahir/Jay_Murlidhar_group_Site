import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { JMG_CATEGORIES, JMG_COMPANIES, JMG_ECOSYSTEM_NAV, getCompanyById } from '../data/jmgEcosystem';

export default function Footer({ onOpenContact }) {
  const [expandedSection, setExpandedSection] = useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <footer id="contact" className="bg-white text-[#64748B] pt-12 sm:pt-16 pb-14 border-t border-[#E2E8F0]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* JMG ECOSYSTEM IN FOOTER (DATA-DRIVEN, ZERO CARDS, GROUPED LISTS)          */}
        {/* ========================================================================= */}
        <div className="pb-16 sm:pb-20 border-b border-[#E2E8F0]">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#2563EB] mb-2">
                JMG ECOSYSTEM
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
                Operating Companies &amp; Business Verticals
              </h3>
            </div>

            <Link
              to="/ecosystem"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#111827] hover:text-[#2563EB] transition-colors group"
            >
              <span>View Interactive Ecosystem Map</span>
              <span className="text-[#2563EB] group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </div>

          {/* Clean 5-Column Grouped Lists with Subtle Hover Interactions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {JMG_CATEGORIES.map((cat) => {
              const companies = cat.companyIds
                .map((id) => getCompanyById(id))
                .filter(Boolean);

              return (
                <div key={cat.id} className="space-y-4">
                  {/* Category Header */}
                  <div className="pb-2.5 border-b border-[#E2E8F0]">
                    <Link
                      to={cat.domainRoute}
                      className="font-mono text-xs font-semibold text-[#111827] hover:text-[#2563EB] uppercase tracking-wider transition-colors inline-block"
                    >
                      {cat.name} &rarr;
                    </Link>
                  </div>

                  {/* Grouped Company List with Arrow Interaction */}
                  <ul className="space-y-2">
                    {companies.map((comp) => (
                      <li key={comp.id}>
                        <Link
                          to={comp.route || comp.path}
                          className="group flex items-center justify-between py-1 text-sm font-medium text-[#1E293B] hover:text-[#2563EB] transition-colors"
                        >
                          <span className="group-hover:underline underline-offset-4 decoration-[#2563EB]/40">
                            {comp.name}
                          </span>
                          <span className="text-xs text-[#94A3B8] font-mono group-hover:text-[#2563EB] group-hover:translate-x-1 transition-all pl-2">
                            &rarr;
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE ACCORDION NAVIGATION (Section 17 Requirement)                     */}
        {/* ========================================================================= */}
        <div className="sm:hidden border-b border-[#E2E8F0] divide-y divide-[#E2E8F0] my-8">
          
          {/* ECOSYSTEM ACCORDION */}
          <div className="py-1">
            <button
              onClick={() => toggleSection('ecosystem')}
              className="w-full min-h-[48px] py-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#111827]"
            >
              <span>Ecosystem</span>
              <span className="font-mono text-base text-[#2563EB]">
                {expandedSection === 'ecosystem' ? '−' : '+'}
              </span>
            </button>
            {expandedSection === 'ecosystem' && (
              <ul className="pb-4 pl-2 space-y-2.5 text-sm animate-in fade-in duration-150">
                {JMG_ECOSYSTEM_NAV.ecosystem.map((item, idx) => (
                  <li key={idx}>
                    <Link to={item.href} className="text-[#64748B] hover:text-[#111827] block py-1">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* SOLUTIONS ACCORDION */}
          <div className="py-1">
            <button
              onClick={() => toggleSection('solutions')}
              className="w-full min-h-[48px] py-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#111827]"
            >
              <span>Solutions</span>
              <span className="font-mono text-base text-[#2563EB]">
                {expandedSection === 'solutions' ? '−' : '+'}
              </span>
            </button>
            {expandedSection === 'solutions' && (
              <ul className="pb-4 pl-2 space-y-2.5 text-sm animate-in fade-in duration-150">
                {JMG_ECOSYSTEM_NAV.solutions.map((item, idx) => (
                  <li key={idx}>
                    <Link to={item.href} className="text-[#64748B] hover:text-[#111827] block py-1">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* COMPANY ACCORDION */}
          <div className="py-1">
            <button
              onClick={() => toggleSection('company')}
              className="w-full min-h-[48px] py-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#111827]"
            >
              <span>Company</span>
              <span className="font-mono text-base text-[#2563EB]">
                {expandedSection === 'company' ? '−' : '+'}
              </span>
            </button>
            {expandedSection === 'company' && (
              <ul className="pb-4 pl-2 space-y-2.5 text-sm animate-in fade-in duration-150">
                {JMG_ECOSYSTEM_NAV.company.map((item, idx) => (
                  <li key={idx}>
                    <Link to={item.href} className="text-[#64748B] hover:text-[#111827] block py-1">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* SOCIAL ACCORDION */}
          <div className="py-1">
            <button
              onClick={() => toggleSection('social')}
              className="w-full min-h-[48px] py-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#111827]"
            >
              <span>Social</span>
              <span className="font-mono text-base text-[#2563EB]">
                {expandedSection === 'social' ? '−' : '+'}
              </span>
            </button>
            {expandedSection === 'social' && (
              <ul className="pb-4 pl-2 space-y-2.5 text-sm animate-in fade-in duration-150">
                {JMG_ECOSYSTEM_NAV.social.map((item, idx) => (
                  <li key={idx}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#64748B] hover:text-[#111827] block py-1"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. FOOTER NAVIGATION (Desktop & Tablet)                                   */}
        {/* ========================================================================= */}
        <div className="hidden sm:grid py-16 grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 border-b border-[#E2E8F0]">
          
          {/* ABOUT */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#111827] mb-4">
              About
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {JMG_ECOSYSTEM_NAV.about.map((item, idx) => (
                <li key={idx}>
                  <a href={item.href} className="text-[#64748B] hover:text-[#111827] transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ECOSYSTEM */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#111827] mb-4">
              Ecosystem
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {JMG_ECOSYSTEM_NAV.ecosystem.map((item, idx) => (
                <li key={idx}>
                  <Link to={item.href} className="text-[#64748B] hover:text-[#111827] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SOLUTIONS */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#111827] mb-4">
              Solutions
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {JMG_ECOSYSTEM_NAV.solutions.map((item, idx) => (
                <li key={idx}>
                  <Link to={item.href} className="text-[#64748B] hover:text-[#111827] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#111827] mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {JMG_ECOSYSTEM_NAV.company.map((item, idx) => (
                <li key={idx}>
                  {item.href.startsWith('#') ? (
                    <button
                      onClick={onOpenContact}
                      className="text-[#64748B] hover:text-[#111827] transition-colors text-left"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <a href={item.href} className="text-[#64748B] hover:text-[#111827] transition-colors">
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#111827] mb-4">
              Social
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {JMG_ECOSYSTEM_NAV.social.map((item, idx) => (
                <li key={idx}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#64748B] hover:text-[#111827] transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 5. FOOTER BOTTOM (MINIMAL, COPYRIGHT, PRIVACY, TERMS)                     */}
        {/* ========================================================================= */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#94A3B8]">
          <div>
            &copy; 2026 Jay Murlidhar Group. All Rights Reserved.
          </div>

          <div className="flex items-center gap-6">
            <a href="/#privacy" className="hover:text-[#111827] transition-colors">Privacy Policy</a>
            <a href="/#terms" className="hover:text-[#111827] transition-colors">Terms &amp; Conditions</a>
          </div>
        </div>

      </div>
    </footer>
  );
}

