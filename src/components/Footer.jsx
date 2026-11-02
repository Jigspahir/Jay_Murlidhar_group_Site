import React from 'react';
import { Link } from 'react-router-dom';

const FOOTER_SECTIONS = [
  {
    title: 'ABOUT',
    links: [
      { label: 'About US', href: '/about' },
      { label: 'Our Story', href: '/about' },
      { label: 'Leadership', href: '/about' },
    ],
  },
  {
    title: 'OUR COMPANIES',
    links: [
      { label: 'All Companies', href: '/ecosystem' },
      { label: 'Technology', href: '/technology' },
      { label: 'Jan Suvidha', href: '/jan-suvidha' },
      { label: 'Insurance', href: '/insurance' },
      { label: 'Business Services', href: '/business-services' },
      { label: 'Travel', href: '/travel' },
      { label: 'Retail', href: '/retail' },
    ],
  },
  {
    title: 'SOLUTIONS',
    links: [
      { label: 'Technology Solutions', href: '/technology/jay-murlidhar-tech-solutions' },
      { label: 'Education Solutions', href: '/solutions' },
      { label: 'Business Services', href: '/business-services/jay-murlidhar-business-services' },
    ],
  },
  {
    title: 'COMPANY',
    links: [
      { label: 'Careers', href: '/careers' },
      { label: 'Academic Innovation', href: '/academic-innovation' },
      { label: 'Contact', href: '/contact', isContactAction: true },
      { label: 'Privacy Policy', href: '/#privacy' },
      { label: 'Terms & Conditions', href: '/#terms' },
    ],
  },
];

const SOCIAL_CHANNELS = [
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    ariaLabel: 'Instagram',
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="jmg-social-icon"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="jmgInstagramGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f09433" />
            <stop offset="25%" stopColor="#e6683c" />
            <stop offset="50%" stopColor="#dc2743" />
            <stop offset="75%" stopColor="#cc2366" />
            <stop offset="100%" stopColor="#bc1888" />
          </linearGradient>
        </defs>
        <path
          fill="url(#jmgInstagramGradient)"
          d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
        />
      </svg>
    ),
  },
  {
    name: 'Facebook',
    href: '#facebook',
    ariaLabel: 'Facebook',
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="jmg-social-icon"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="#1877F2"
          d="M14 13.5h2.5l1-4H14v-2c0-1.03.37-1.75 1.95-1.75H17.5V2.22C16.89 2.14 15.68 2 14.37 2 11.3 2 9.2 3.88 9.2 7.3v2.2H6.5v4H9.2V22h4.8v-8.5z"
        />
      </svg>
    ),
  },
  {
    name: 'X',
    href: '#x',
    ariaLabel: 'X',
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="jmg-social-icon jmg-social-icon-x"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="#0F1419"
          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        />
      </svg>
    ),
  },
  {
    name: 'WhatsApp',
    href: '#whatsapp',
    ariaLabel: 'WhatsApp',
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="jmg-social-icon"
        aria-hidden="true"
        focusable="false"
      >
        <path
          fill="#25D366"
          d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.476-.15-.677.15-.201.3-.777.98-.953 1.18-.175.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.785-1.675-2.086-.176-.301-.019-.464.131-.614.136-.135.301-.351.452-.527.15-.176.2-.301.301-.502.1-.2.05-.376-.025-.526-.075-.15-.677-1.631-.928-2.233-.245-.587-.494-.507-.677-.517l-.578-.01c-.2 0-.527.075-.803.376-.276.3-1.054 1.03-1.054 2.512 0 1.482 1.079 2.912 1.23 3.113.15.201 2.122 3.24 5.141 4.544.718.31 1.279.495 1.716.634.721.23 1.378.197 1.897.12.579-.087 1.78-.727 2.03-1.43.251-.703.251-1.305.176-1.43-.075-.125-.276-.2-.577-.35zM12.05 21.785h-.008a9.835 9.835 0 0 1-5.015-1.373l-.36-.214-3.728.978.995-3.636-.235-.374a9.86 9.86 0 0 1-1.51-5.26c0-5.445 4.43-9.874 9.878-9.874a9.82 9.82 0 0 1 6.983 2.893A9.82 9.82 0 0 1 21.93 11.9c0 5.447-4.431 9.885-9.88 9.885zm0-18C6.96 3.785 2.81 7.934 2.81 13.024c0 1.745.485 3.447 1.405 4.93l-.034.053-.925 3.385 3.468-.91.05.03a9.208 9.208 0 0 0 4.886 1.373h.004c5.088 0 9.233-4.148 9.235-9.24a9.17 9.17 0 0 0-2.707-6.525 9.178 9.178 0 0 0-6.546-2.705z"
        />
      </svg>
    ),
  },
];

export default function Footer({ onOpenContact }) {
  return (
    <footer id="footer" className="bg-white text-[#64748B] pt-12 sm:pt-14 lg:pt-16 pb-6 sm:pb-8 border-t border-[#E2E8F0]">
      {/* Centered Main Container */}
      <div className="max-w-[1320px] mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Main Footer Layout: Left Branding Block + Right Navigation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 xl:gap-14">
          
          {/* LEFT: JMG Branding Block (occupies 4 cols on desktop, full width on mobile) */}
          <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left pr-0 lg:pr-4">
            
            {/* Official JMG Logo */}
            <Link to="/" aria-label="Jay Murlidhar Group Home" className="inline-block mb-3.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded">
              <img 
                src="/assets/jay-murlidhar-group-logo.png" 
                alt="Jay Murlidhar Group" 
                className="h-10 sm:h-11 w-auto max-w-[155px] object-contain"
                loading="lazy"
              />
            </Link>

            {/* Parent Brand Title */}
            <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight mb-2">
              JAY MURLIDHAR GROUP
            </h3>

            {/* Tagline */}
            <div className="text-[14px] sm:text-[15px] font-semibold text-[#1E293B] mb-2 sm:mb-2.5 leading-snug">
              Technology. Business. Innovation.
            </div>

            {/* Supporting Statement */}
            <p className="text-[13px] sm:text-[14px] text-[#64748B] font-normal leading-relaxed max-w-sm mb-4 sm:mb-5">
              One Group. Multiple Companies.
            </p>

            {/* Social Media Channels */}
            <div className="w-full flex items-center justify-center sm:justify-start gap-[12px] xs:gap-[14px] sm:gap-4 md:gap-[18px] lg:gap-5 pt-1 sm:pt-2 flex-wrap sm:flex-nowrap">
              {SOCIAL_CHANNELS.map((channel) => (
                <a
                  key={channel.name}
                  href={channel.href}
                  target={channel.href.startsWith('http') ? '_blank' : undefined}
                  rel={channel.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={channel.ariaLabel || channel.name}
                  title={channel.name}
                  className="jmg-social-btn"
                >
                  {channel.icon}
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT: Navigation Columns (occupies 8 cols on desktop, 2 cols on mobile, 4 columns across on desktop) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-6 xl:gap-8">
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title} className="flex flex-col">
                {/* Column Heading: 14px, semibold, dark navy, subtle tracking */}
                <h4 className="text-[14px] font-semibold uppercase tracking-wider text-[#0F172A] mb-4 sm:mb-5">
                  {section.title}
                </h4>

                {/* Navigation Links: 15px, 12px vertical spacing (space-y-3), 1.5 line-height */}
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      {link.isContactAction && onOpenContact ? (
                        <button
                          type="button"
                          onClick={onOpenContact}
                          className="text-[15px] text-[#64748B] hover:text-[#0F172A] transition-colors leading-[1.5] text-left inline-block focus:outline-none cursor-pointer"
                        >
                          {link.label}
                        </button>
                      ) : link.isExternal ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[15px] text-[#64748B] hover:text-[#0F172A] transition-colors leading-[1.5] inline-block"
                        >
                          {link.label}
                        </a>
                      ) : link.href.startsWith('/#') || link.href.startsWith('#') ? (
                        <a
                          href={link.href}
                          className="text-[15px] text-[#64748B] hover:text-[#0F172A] transition-colors leading-[1.5] inline-block"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          className="text-[15px] text-[#64748B] hover:text-[#0F172A] transition-colors leading-[1.5] inline-block"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Subtle Divider & Compact Bottom Copyright Row */}
        <div className="mt-10 sm:mt-12 pt-5 sm:pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] sm:text-sm text-[#94A3B8]">
          <div className="text-center sm:text-left">
            &copy; 2026 Jay Murlidhar Group. All Rights Reserved.
          </div>

          <div className="flex items-center gap-5 sm:gap-6">
            <a href="/#privacy" className="hover:text-[#0F172A] transition-colors">
              Privacy Policy
            </a>
            <a href="/#terms" className="hover:text-[#0F172A] transition-colors">
              Terms &amp; Conditions
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
