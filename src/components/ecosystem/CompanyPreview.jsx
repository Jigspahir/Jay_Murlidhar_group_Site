import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CompanyPreview({ currentCompany, activeDomain }) {
  if (!currentCompany) return null;

  return (
    <div className="w-full rounded-2xl bg-[#09111E] border border-slate-800 shadow-[0_16px_50px_rgba(0,0,0,0.6)] overflow-hidden">
      
      {/* Header Preview Bar */}
      <div className="px-5 py-3.5 bg-[#0C1728] border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span 
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: activeDomain.accent }}
          />
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
            Live Operational Telemetry
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          {currentCompany.id}
        </span>
      </div>

      {/* Dynamic Company Visualization Body (Section 14) */}
      <div className="p-6">
        
        {/* Visual Representation Graphic */}
        <div className="mb-6 rounded-xl bg-[#050B14] border border-slate-800/80 p-5 relative overflow-hidden">
          
          {/* Subtle Grid overlay */}
          <div 
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#38BDF8 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }}
          />

          {/* Company Domain Visual Content */}
          {currentCompany.slug === 'jay-murlidhar-tech-solutions' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <span>CLUSTER: PROD-CENTRAL-01</span>
                <span className="text-emerald-400">99.99% HEALTHY</span>
              </div>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">POSTGRES MASTER</span>
                  <span className="text-[#38BDF8]">12ms Latency</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">ACADEMIC ERP GATEWAY</span>
                  <span className="text-emerald-400">Active (45k Sessions)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">DISPATCH QUEUE</span>
                  <span className="text-purple-400">0 Overflows</span>
                </div>
              </div>
            </div>
          )}

          {currentCompany.slug === 'jay-murlidhar-computer' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <span>HARDWARE LAB DIAGNOSTICS</span>
                <span className="text-emerald-400">CALIBRATED</span>
              </div>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">COMPONENT REPAIRS</span>
                  <span className="text-[#38BDF8]">12,500+ Lifetime</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">INSTITUTIONAL AMCS</span>
                  <span className="text-emerald-400">45 Active Campus Labs</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">SLA DISPATCH</span>
                  <span className="text-emerald-400">&lt; 24h Turnaround</span>
                </div>
              </div>
            </div>
          )}

          {currentCompany.slug === 'jay-murlidhar-finance' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <span>CAPITAL ALLOCATION LEDGER</span>
                <span className="text-emerald-400">AUDITED</span>
              </div>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">CAPITAL FACILITATED</span>
                  <span className="text-[#10B981] font-bold">₹50 Cr+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">COMMERCIAL ENTITIES</span>
                  <span className="text-slate-200">250+ Advised</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">DISBURSAL RATE</span>
                  <span className="text-emerald-400">100% Verified</span>
                </div>
              </div>
            </div>
          )}

          {currentCompany.slug === 'jay-murlidhar-insurance' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <span>RISK MITIGATION MATRIX</span>
                <span className="text-cyan-400">ACTIVE SHIELD</span>
              </div>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">UNDERWRITING BASE</span>
                  <span className="text-[#06B6D4] font-bold">₹120 Cr+ Assets</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">CAMPUS COHORTS</span>
                  <span className="text-slate-200">5,000+ Protected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">CLAIM SETTLEMENT</span>
                  <span className="text-emerald-400">98.4% Efficiency</span>
                </div>
              </div>
            </div>
          )}

          {currentCompany.slug === 'jay-murlidhar-business-services' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <span>STATUTORY REGULATORY DESK</span>
                <span className="text-orange-400">CERTIFIED</span>
              </div>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">ENTITY GOVERNANCE</span>
                  <span className="text-[#F97316]">500+ Clients</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">ISO 9001:2015</span>
                  <span className="text-emerald-400">Compliance Maintained</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">FILING ACCURACY</span>
                  <span className="text-emerald-400">100% Timely</span>
                </div>
              </div>
            </div>
          )}

          {currentCompany.slug === 'jay-murlidhar-infra' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <span>CAMPUS ENGINEERING BIM</span>
                <span className="text-indigo-400">PLANNED</span>
              </div>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">TOTAL BUILT AREA</span>
                  <span className="text-[#6366F1] font-bold">500,000+ Sq.Ft</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">ACADEMIC SITES</span>
                  <span className="text-slate-200">15 Facilities</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">SEISMIC RATING</span>
                  <span className="text-emerald-400">Zone IV Certified</span>
                </div>
              </div>
            </div>
          )}

          {currentCompany.slug === 'jay-murlidhar-tours' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <span>ACADEMIC EXPEDITION LOG</span>
                <span className="text-amber-400">COORDINATED</span>
              </div>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">COMPLETED TOURS</span>
                  <span className="text-[#F59E0B] font-bold">85+ Expeditions</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">TRAVELING COHORTS</span>
                  <span className="text-slate-200">3,500+ Students</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">VISA CLEARANCE</span>
                  <span className="text-emerald-400">100% Success</span>
                </div>
              </div>
            </div>
          )}

          {currentCompany.slug === 'jay-murlidhar-trade' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <span>DOMESTIC SUPPLY DISPATCH</span>
                <span className="text-purple-400">IN TRANSIT</span>
              </div>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">MONTHLY ORDERS</span>
                  <span className="text-[#8B5CF6] font-bold">1,200+ Wholesale</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">WAREHOUSE HUBS</span>
                  <span className="text-slate-200">Western Corridor</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">FULFILLMENT RATE</span>
                  <span className="text-emerald-400">99.4% On-Schedule</span>
                </div>
              </div>
            </div>
          )}

          {currentCompany.slug === 'jay-murlidhar-exports' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <span>GLOBAL MARITIME FREIGHT</span>
                <span className="text-purple-400">PORT CLEARED</span>
              </div>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">DESTINATIONS</span>
                  <span className="text-[#8B5CF6] font-bold">18 Global Ports</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">EXPORT MANIFEST</span>
                  <span className="text-slate-200">Commodity Certified</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">CUSTOMS TRANSIT</span>
                  <span className="text-emerald-400">100% Compliant</span>
                </div>
              </div>
            </div>
          )}

          {currentCompany.slug === 'jay-murlidhar-mobile' && (
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                <span>DEVICE PROCUREMENT REGISTRY</span>
                <span className="text-pink-400">AUTHENTIC</span>
              </div>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">DEVICES SOURCED</span>
                  <span className="text-[#EC4899] font-bold">25,000+ Units</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">INSTITUTIONAL BATCHES</span>
                  <span className="text-slate-200">Tablets &amp; Workstations</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">OEM WARRANTY</span>
                  <span className="text-emerald-400">100% Verified</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Company Details */}
        <h4 className="text-xl font-bold text-white tracking-tight mb-1">
          {currentCompany.name}
        </h4>

        <p className="text-xs text-[#38BDF8] font-mono uppercase mb-3">
          {currentCompany.subtitle}
        </p>

        <p className="text-xs text-slate-400 leading-relaxed mb-6 font-normal">
          {currentCompany.shortDescription}
        </p>

        {/* Services / Focus Tags */}
        <div className="space-y-2 mb-6">
          <div className="text-[11px] font-mono text-slate-400 uppercase">
            Primary Operational Capabilities
          </div>
          <div className="flex flex-wrap gap-1.5">
            {currentCompany.services.slice(0, 3).map((srv, sIdx) => (
              <span 
                key={sIdx}
                className="text-[11px] font-mono px-2 py-1 rounded bg-[#0F1D33] text-slate-300 border border-slate-800"
              >
                {srv.title}
              </span>
            ))}
          </div>
        </div>

        {/* Action Link: Navigate to Dedicated Page */}
        <Link
          to={currentCompany.route || currentCompany.path}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white hover:bg-slate-100 text-[#07111F] font-semibold text-sm transition-all duration-200 shadow-md group focus:outline-none focus:ring-2 focus:ring-[#38BDF8]"
        >
          <span>Explore Business Page</span>
          <ArrowRight className="w-4 h-4 text-[#07111F] transition-transform group-hover:translate-x-1" />
        </Link>

      </div>

    </div>
  );
}
