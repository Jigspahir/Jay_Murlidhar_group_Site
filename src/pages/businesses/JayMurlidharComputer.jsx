import React, { useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  Building2,
  FileText,
  ShieldCheck,
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Clock,
  Layers,
  HelpCircle,
  Sparkles,
  ArrowDown
} from 'lucide-react';
import { useCanonical } from '../../utils/seo';

/**
 * Jay Murlidhar Computer Company Page
 * 
 * Canonical Ecosystem: JAN SUVIDHA (Domain 02)
 * Operating Entity: Jay Murlidhar Computer
 * Role: CSC / Jan Suvidha Kendra • Digital Public Service Centre • Neighbourhood Kiosk
 */

const G2C_SERVICES = [
  { name: 'Aadhaar Services', desc: 'Assistance with demographic updates, address correction, and portal retrieval.' },
  { name: 'Banking Services', desc: 'Basic financial inclusion assistance, micro-banking support, and portal transfers.' },
  { name: 'Bill Payments', desc: 'Electricity, water, utility, and municipal bill payments through authorized BBPS channels.' },
  { name: 'Government Schemes', desc: 'Information access, eligibility verification, and application submission for welfare schemes.' },
  { name: 'Online Documentation', desc: 'Assistance with digital affidavits, domicile certificates, caste certificates, and ration portals.' },
  { name: 'RTO Services', desc: 'Driving licence slot booking, renewal guidance, vehicle registration, and ownership transfer support.' }
];

const B2C_SERVICES = [
  { name: 'GST Registration & Filing', desc: 'New GSTIN application support, monthly/quarterly returns, and composition compliance.' },
  { name: 'MSME Registration', desc: 'Government MSME enterprise registration assistance for local businesses and traders.' },
  { name: 'PAN / TAN', desc: 'New PAN card applications, corrections, updates, and organizational TAN issuance.' },
  { name: 'Shop Act', desc: 'Gumastadhara / Shop and Establishment Act license registration and renewals.' },
  { name: 'FSSAI', desc: 'Food safety registration and state license assistance for food businesses.' },
  { name: 'Income Tax Filing', desc: 'Assisted electronic filing (ITR) for salaried individuals, professionals, and small businesses.' },
  { name: 'DSC', desc: 'Class 3 Digital Signature Certificate issuance for e-tendering, MCA filings, and tax submissions.' },
  { name: 'Udyam', desc: 'Official Udyam registration and certificate generation for micro, small, and medium businesses.' },
  { name: 'Business Registration', desc: 'Proprietorship setup, partnership deed guidance, and trade documentation support.' }
];

const ACADEMY_SERVICES = [
  { name: 'Computer Courses', desc: 'Basic to advanced computer literacy, operating systems, and office productivity tools.' },
  { name: 'Tally', desc: 'Practical accounting, GST ledger bookkeeping, inventory, and balance sheet training.' },
  { name: 'Basic IT', desc: 'Fundamental computer hardware awareness, internet navigation, and digital communication.' },
  { name: 'Digital Marketing Training', desc: 'Practical social media awareness, Google business listing, and online branding basics.' },
  { name: 'Web Development Course', desc: 'Introduction to HTML, CSS, JavaScript, and responsive website fundamentals.' },
  { name: 'Spoken English', desc: 'Confidence building, workplace vocabulary, and functional spoken English practice.' },
  { name: 'Government Exam Preparation', desc: 'Computer practical proficiency training for government competitive examinations.' }
];

const JOURNEY_STEPS = [
  {
    number: '01',
    title: 'Discover Service',
    description: 'Identify the exact government scheme, certificate, RTO application, or digital course you require.'
  },
  {
    number: '02',
    title: 'Document & Info Check',
    description: 'Review prerequisite identity proofs, required certificates, and portal guidelines with our staff.'
  },
  {
    number: '03',
    title: 'Digital Assistance',
    description: 'Our operator accurately enters details, scans documents, and navigates the official portal with you.'
  },
  {
    number: '04',
    title: 'Service Processing',
    description: 'Application submission via authorized channels with transparent reference acknowledgement.'
  },
  {
    number: '05',
    title: 'Completion & Delivery',
    description: 'Receive verified acknowledgement receipt, downloadable certificate, or completed statutory filing.'
  }
];

export default function JayMurlidharComputer() {
  const context = useOutletContext();
  const onOpenContact = context?.onOpenContact;

  // SEO Canonical & Metadata
  useCanonical('/jan-suvidha/jay-murlidhar-computer');

  useEffect(() => {
    const prevTitle = document.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc ? metaDesc.getAttribute('content') : '';

    document.title = "Jay Murlidhar Computer | CSC & Jan Suvidha Kendra";
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        "Jay Murlidhar Computer is a neighbourhood digital service centre providing access and assistance for Government-to-Citizen (G2C), Business-to-Citizen (B2C), documentation, RTO, business registration and digital services."
      );
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      document.title = prevTitle;
      if (metaDesc && prevDesc) {
        metaDesc.setAttribute('content', prevDesc);
      }
    };
  }, []);

  return (
    <div className="pt-28 sm:pt-36 pb-20 bg-[#FAFAFA] text-[#111827]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ========================================================================= */}
        {/* BREADCRUMB                                                                */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 font-mono text-xs text-[#94A3B8] mb-8 flex-wrap">
          <Link to="/" className="hover:text-[#111827] transition-colors">JMG</Link>
          <span>/</span>
          <Link to="/ecosystem" className="hover:text-[#111827] transition-colors">Our Companies</Link>
          <span>/</span>
          <Link to="/jan-suvidha" className="hover:text-[#111827] transition-colors">Jan Suvidha</Link>
          <span>/</span>
          <span className="text-[#10B981] font-semibold">Jay Murlidhar Computer</span>
        </div>

        {/* ========================================================================= */}
        {/* 01 — HERO SECTION                                                         */}
        {/* ========================================================================= */}
        <div className="max-w-4xl mb-16 lg:mb-20">
          
          {/* Identity Tag */}
          <div className="flex items-center gap-2 mb-4 font-mono text-xs font-semibold uppercase tracking-[0.2em] flex-wrap">
            <span className="px-2.5 py-0.5 rounded text-white font-mono text-[11px] bg-[#10B981]">
              DOMAIN 02 &bull; JAN SUVIDHA
            </span>
            <span className="text-[#94A3B8]">&bull;</span>
            <span className="text-[#1E293B]">CSC &amp; JAN SUVIDHA KENDRA</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-bold text-[#111827] tracking-[-0.03em] leading-[1.08] mb-6 break-words">
            Your Trusted Neighbourhood Kiosk for All Digital Services.
          </h1>

          <p className="text-lg sm:text-xl text-[#64748B] leading-relaxed font-normal max-w-3xl mb-8">
            Common Services Centres (CSCs) provide Government-to-Citizen (G2C) and Business-to-Citizen (B2C) e-Services, helping people access essential digital and public services through a trusted local service centre.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onOpenContact}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[10px] bg-[#111827] hover:bg-[#10B981] text-white text-xs sm:text-sm font-semibold transition-colors duration-200 shadow-sm"
            >
              <span>Visit Centre / Inquire</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#services"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-[10px] bg-white border border-[#E2E8F0] hover:border-[#111827] text-[#111827] text-xs sm:text-sm font-semibold transition-colors duration-200"
            >
              <span>Explore Verified Services</span>
              <ArrowDown className="w-4 h-4 text-[#64748B]" />
            </a>
          </div>

          {/* Telemetry pill badges */}
          <div className="mt-10 pt-6 border-t border-[#E2E8F0] grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-xl font-mono text-xs">
            <div>
              <span className="text-[#94A3B8] block text-[11px] uppercase tracking-wider">Service Channels</span>
              <span className="font-bold text-[#111827] text-sm mt-0.5 block">G2C &amp; B2C e-Services</span>
            </div>
            <div>
              <span className="text-[#94A3B8] block text-[11px] uppercase tracking-wider">Access Model</span>
              <span className="font-bold text-[#111827] text-sm mt-0.5 block">Neighbourhood Kiosk</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[#94A3B8] block text-[11px] uppercase tracking-wider">Assistance</span>
              <span className="font-bold text-[#10B981] text-sm mt-0.5 block">Guided Digital Help</span>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 02 — ABOUT (CSC / JAN SUVIDHA KENDRA POSITIONING)                         */}
        {/* ========================================================================= */}
        <section className="mb-20">
          <div className="p-8 sm:p-10 lg:p-12 rounded-[20px] bg-white border border-[#E2E8F0] shadow-[0_2px_16px_rgba(0,0,0,0.02)]">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 mb-3 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#10B981]">
                <span>02 &mdash;</span>
                <span>EDITORIAL POSITIONING</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111827] tracking-tight mb-4">
                "Digital access, closer to home."
              </h2>

              <p className="text-base sm:text-lg text-[#64748B] leading-relaxed mb-6 font-normal">
                Jay Murlidhar Computer helps bridge the gap between people and essential digital, government and business services through a convenient neighbourhood service centre.
              </p>

              <div className="p-4 sm:p-5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs sm:text-sm text-[#475569] leading-relaxed">
                <p className="font-medium text-[#1E293B] mb-1">
                  Public Transparency &amp; Operating Role:
                </p>
                <p>
                  Jay Murlidhar Computer operates as an independent digital facilitation and citizen assistance kiosk within Jay Murlidhar Group. We guide residents and small businesses through digital portal submissions, fee payments, and documentation without bureaucratic friction. We do not claim official government ownership or public employment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 03 — HOW WE SERVE (G2C & B2C CLASSIFICATION)                             */}
        {/* ========================================================================= */}
        <section className="mb-20">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#10B981]">
              <span>03 &mdash;</span>
              <span>SERVICE MODEL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
              How We Serve
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] mt-1 max-w-2xl">
              Structured service delivery channels ensuring clear assistance for both individual citizens and commercial enterprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* G2C Box */}
            <div className="p-8 rounded-[16px] bg-white border border-[#E2E8F0] shadow-sm hover:border-[#10B981] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-[#10B981] px-2.5 py-1 rounded bg-emerald-50 border border-emerald-100">
                    CHANNEL 01
                  </span>
                  <span className="font-mono text-xs text-[#94A3B8]">CITIZEN FOCUS</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#111827] mb-2">
                  Government to Citizen Services (G2C)
                </h3>

                <p className="text-sm sm:text-base text-[#64748B] leading-relaxed mb-6 font-normal">
                  Services delivered to citizens through government and digital service channels. We assist everyday people in submitting official forms, verifying documents, and accessing welfare initiatives.
                </p>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap gap-2">
                <span className="text-xs font-mono font-medium px-2.5 py-1 rounded bg-[#FAFAFA] border border-[#E2E8F0] text-[#1E293B]">
                  Aadhaar Assistance
                </span>
                <span className="text-xs font-mono font-medium px-2.5 py-1 rounded bg-[#FAFAFA] border border-[#E2E8F0] text-[#1E293B]">
                  RTO Services
                </span>
                <span className="text-xs font-mono font-medium px-2.5 py-1 rounded bg-[#FAFAFA] border border-[#E2E8F0] text-[#1E293B]">
                  Welfare Schemes
                </span>
                <span className="text-xs font-mono font-medium px-2.5 py-1 rounded bg-[#FAFAFA] border border-[#E2E8F0] text-[#1E293B]">
                  Utility Payments
                </span>
              </div>
            </div>

            {/* B2C Box */}
            <div className="p-8 rounded-[16px] bg-white border border-[#E2E8F0] shadow-sm hover:border-[#2563EB] transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-[#2563EB] px-2.5 py-1 rounded bg-blue-50 border border-blue-100">
                    CHANNEL 02
                  </span>
                  <span className="font-mono text-xs text-[#94A3B8]">BUSINESS &amp; TRADE FOCUS</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-[#111827] mb-2">
                  Business to Citizen Services (B2C)
                </h3>

                <p className="text-sm sm:text-base text-[#64748B] leading-relaxed mb-6 font-normal">
                  Digital and business services that help individuals and micro-enterprises access useful products, statutory registrations, licensing, and commercial documentation.
                </p>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap gap-2">
                <span className="text-xs font-mono font-medium px-2.5 py-1 rounded bg-[#FAFAFA] border border-[#E2E8F0] text-[#1E293B]">
                  GST &amp; MSME
                </span>
                <span className="text-xs font-mono font-medium px-2.5 py-1 rounded bg-[#FAFAFA] border border-[#E2E8F0] text-[#1E293B]">
                  Shop Act &amp; FSSAI
                </span>
                <span className="text-xs font-mono font-medium px-2.5 py-1 rounded bg-[#FAFAFA] border border-[#E2E8F0] text-[#1E293B]">
                  PAN / TAN Cards
                </span>
                <span className="text-xs font-mono font-medium px-2.5 py-1 rounded bg-[#FAFAFA] border border-[#E2E8F0] text-[#1E293B]">
                  Digital Academy
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 04 — ORGANIZED SERVICE DIRECTORY (VERIFIED SERVICES ONLY)                 */}
        {/* ========================================================================= */}
        <section id="services" className="mb-20 scroll-mt-24">
          <div className="flex items-center justify-between pb-4 mb-8 border-b border-[#E2E8F0]">
            <div>
              <div className="flex items-center gap-2 mb-1 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#10B981]">
                <span>04 &mdash;</span>
                <span>SERVICES</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
                Verified Services Directory
              </h2>
            </div>
            <span className="text-xs font-mono text-[#94A3B8] hidden sm:inline">
              3 Specialized Categories
            </span>
          </div>

          <div className="space-y-12">
            
            {/* Category 1: Government / Citizen Services (G2C) */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#111827]">
                  Government / Citizen Services (G2C)
                </h3>
              </div>

              <div className="divide-y divide-[#E2E8F0] border-y border-[#E2E8F0] bg-white rounded-[16px] border shadow-sm overflow-hidden">
                {G2C_SERVICES.map((srv, idx) => (
                  <div 
                    key={idx} 
                    className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F8FAFC] transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      <span className="font-mono text-xs font-bold text-[#10B981] w-6">
                        0{idx + 1}
                      </span>
                      <div>
                        <h4 className="text-base font-bold text-[#111827]">
                          {srv.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
                          {srv.desc}
                        </p>
                      </div>
                    </div>

                    <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-[#FAFAFA] border border-[#E2E8F0] text-[#475569] self-start sm:self-center">
                      G2C Verified
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category 2: Business & Documentation Services (B2C) */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#111827]">
                  Business &amp; Documentation Services (B2C)
                </h3>
              </div>

              <div className="divide-y divide-[#E2E8F0] border-y border-[#E2E8F0] bg-white rounded-[16px] border shadow-sm overflow-hidden">
                {B2C_SERVICES.map((srv, idx) => (
                  <div 
                    key={idx} 
                    className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F8FAFC] transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      <span className="font-mono text-xs font-bold text-[#2563EB] w-6">
                        0{idx + 1}
                      </span>
                      <div>
                        <h4 className="text-base font-bold text-[#111827]">
                          {srv.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
                          {srv.desc}
                        </p>
                      </div>
                    </div>

                    <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-[#FAFAFA] border border-[#E2E8F0] text-[#475569] self-start sm:self-center">
                      B2C Business Support
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category 3: Academy / Digital Skills */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#111827]">
                  Academy / Digital Skills
                </h3>
              </div>

              <div className="divide-y divide-[#E2E8F0] border-y border-[#E2E8F0] bg-white rounded-[16px] border shadow-sm overflow-hidden">
                {ACADEMY_SERVICES.map((srv, idx) => (
                  <div 
                    key={idx} 
                    className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F8FAFC] transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      <span className="font-mono text-xs font-bold text-[#D97706] w-6">
                        0{idx + 1}
                      </span>
                      <div>
                        <h4 className="text-base font-bold text-[#111827]">
                          {srv.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
                          {srv.desc}
                        </p>
                      </div>
                    </div>

                    <span className="font-mono text-[11px] px-2.5 py-1 rounded bg-[#FAFAFA] border border-[#E2E8F0] text-[#475569] self-start sm:self-center">
                      Skill Academy
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 05 — WHY JAY MURLIDHAR COMPUTER                                           */}
        {/* ========================================================================= */}
        <section className="mb-20">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#10B981]">
              <span>05 &mdash;</span>
              <span>ADVANTAGE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
              Why Jay Murlidhar Computer
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] mt-1 max-w-2xl">
              Reliable neighbourhood service delivery designed to make digital procedures simple, accessible, and error-free.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-[16px] bg-white border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-[#10B981] block mb-3">01</span>
                <h3 className="text-lg font-bold text-[#111827] mb-2">
                  Convenient Local Access
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  Easily accessible neighbourhood location saving you lengthy travel, queues, and repeated visits for common digital tasks.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-[16px] bg-white border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-[#10B981] block mb-3">02</span>
                <h3 className="text-lg font-bold text-[#111827] mb-2">
                  Digital Assistance
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  Patient, guided operator assistance navigating complex online portals, document upload parameters, and fee gateways.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-[16px] bg-white border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-[#10B981] block mb-3">03</span>
                <h3 className="text-lg font-bold text-[#111827] mb-2">
                  Multiple Services in One Place
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  Comprehensive coverage spanning RTO, utility bills, business licenses, GST, and computer academy under a single roof.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-[16px] bg-white border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-[#10B981] block mb-3">04</span>
                <h3 className="text-lg font-bold text-[#111827] mb-2">
                  Simple Service Experience
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  Transparent procedural steps without technical jargon or unexpected surprises, giving you clarity at every stage.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 06 — SERVICE JOURNEY (STEP-BY-STEP PROCESS)                                */}
        {/* ========================================================================= */}
        <section className="mb-20">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#10B981]">
              <span>06 &mdash;</span>
              <span>SERVICE JOURNEY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight">
              A Clear, Step-by-Step Experience
            </h2>
            <p className="text-sm sm:text-base text-[#64748B] mt-1 max-w-2xl">
              From inquiry to final document delivery, our structured workflow ensures complete procedural clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {JOURNEY_STEPS.map((step, idx) => (
              <div 
                key={idx} 
                className="p-5 rounded-[14px] bg-white border border-[#E2E8F0] relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-[#10B981]">
                      {step.number}
                    </span>
                    {idx < JOURNEY_STEPS.length - 1 && (
                      <span className="font-mono text-xs text-[#94A3B8] hidden lg:inline">&rarr;</span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-[#111827] mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 07 — CONTACT / VISIT CENTRE (VERIFIED JMG DETAILS)                        */}
        {/* ========================================================================= */}
        <section className="mb-20">
          <div className="p-8 sm:p-10 lg:p-12 rounded-[20px] bg-white border border-[#E2E8F0] shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7">
                <div className="flex items-center gap-2 mb-2 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-[#10B981]">
                  <span>07 &mdash;</span>
                  <span>VISIT &amp; INQUIRE</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] tracking-tight mb-4">
                  Visit Our Local Service Centre
                </h2>

                <p className="text-sm sm:text-base text-[#64748B] leading-relaxed mb-6 font-normal">
                  Drop by our centre or reach out with your requirements. We are ready to assist you with all government, citizen, business documentation, and academy programs.
                </p>

                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-start gap-2.5 text-[#475569]">
                    <MapPin className="w-4 h-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                    <span>Jay Murlidhar Group, Near Motibagh, Junagadh - 362001, Junagadh District, Gujarat, India.</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-[#475569]">
                    <Phone className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                    <a href="tel:+919909461768" className="hover:text-[#10B981] hover:underline font-semibold">
                      +91 9909461768
                    </a>
                  </div>

                  <div className="flex items-center gap-2.5 text-[#475569]">
                    <Mail className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                    <a href="mailto:info.jaymurlidhargroup@gmail.com" className="hover:text-[#10B981] hover:underline">
                      info.jaymurlidhargroup@gmail.com
                    </a>
                  </div>

                  <div className="flex items-center gap-2.5 text-[#475569]">
                    <Clock className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                    <span>Mon–Sat, 10:00 AM – 6:00 PM IST</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-center">
                <button
                  onClick={onOpenContact}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-[12px] bg-[#111827] hover:bg-[#10B981] text-white text-sm font-semibold transition-all duration-200 shadow-md"
                >
                  <span>Connect with Service Desk</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-[#94A3B8] mt-3">
                  Neighbourhood Service Kiosk &bull; Gujarat, India
                </span>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* CONNECTED JMG ECOSYSTEM NAV                                               */}
        {/* ========================================================================= */}
        <div className="pt-10 border-t border-[#E2E8F0]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-[#94A3B8] block">
                Integrated JMG Entity
              </span>
              <span className="text-sm font-bold text-[#111827]">
                Part of Jay Murlidhar Group Companies
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono font-semibold">
              <Link to="/jan-suvidha" className="text-[#10B981] hover:underline">
                &larr; Jan Suvidha Domain
              </Link>
              <span>&bull;</span>
              <Link to="/ecosystem" className="text-[#2563EB] hover:underline">
                Group Companies Directory &rarr;
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
