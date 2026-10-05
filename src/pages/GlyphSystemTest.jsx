import React from 'react';
import { 
  TechnologyGlyph, 
  JanSuvidhaGlyph, 
  InsuranceGlyph, 
  BusinessServicesGlyph, 
  TravelGlyph, 
  RetailGlyph 
} from '../components/ecosystem/glyphs';
import { JMG_DOMAINS } from '../data/jmgEcosystem';

const GLYPH_ITEMS = [
  { id: 'technology', name: 'TECHNOLOGY', num: '01', Component: TechnologyGlyph, desc: 'Microchip & J-Circuit Trace', accent: '#38BDF8' },
  { id: 'jan-suvidha', name: 'JAN SUVIDHA', num: '02', Component: JanSuvidhaGlyph, desc: 'Civic Gateway & Digital Uplink', accent: '#10B981' },
  { id: 'insurance', name: 'INSURANCE', num: '03', Component: InsuranceGlyph, desc: 'Protection Shield & Security Core', accent: '#06B6D4' },
  { id: 'business-services', name: 'BUSINESS SERVICES', num: '04', Component: BusinessServicesGlyph, desc: 'Corporate Folio & Workflow Nexus', accent: '#F97316' },
  { id: 'travel', name: 'TRAVEL', num: '05', Component: TravelGlyph, desc: 'Supersonic Vector & Journey Orbit', accent: '#F59E0B' },
  { id: 'retail', name: 'RETAIL', num: '06', Component: RetailGlyph, desc: 'Smart Device & Wireless Interface', accent: '#EC4899' },
];

export default function GlyphSystemTest() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-16 px-6 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-6">
          <span className="font-mono text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">
            JMG Visual Identity
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Custom JMG Domain Glyph System — QA Test Grid
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Evaluating optical weight, geometric DNA, silhouette recognizability, monochrome harmony, and micro-interactions.
          </p>
        </div>

        {/* 1. MONOCHROME TEST (Black on Crisp White) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-700">
              1. Strict Monochrome Test (Black on White — Shape Integrity)
            </h2>
            <span className="text-xs font-mono text-slate-400">All 6 must feel like one font/family</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {GLYPH_ITEMS.map((item) => (
              <div 
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col items-center text-center shadow-sm group hover:border-slate-400 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-900 mb-3 group-hover:scale-105 transition-transform">
                  <item.Component className="w-6 h-6" strokeWidth={1.75} />
                </div>
                <span className="font-mono text-[10px] text-slate-400">{item.num}</span>
                <span className="text-xs font-bold tracking-tight text-slate-800">{item.name}</span>
                <span className="text-[10px] text-slate-400 mt-1">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 2. REVERSE MONOCHROME TEST (White on Corporate Dark) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-700">
              2. Dark Monochrome Test (Corporate Dark Ground)
            </h2>
            <span className="text-xs font-mono text-slate-400">Night mode silhouette check</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {GLYPH_ITEMS.map((item) => (
              <div 
                key={item.id}
                className="bg-[#0B1424] border border-slate-800 rounded-xl p-5 flex flex-col items-center text-center shadow-sm group hover:border-slate-700 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white mb-3 group-hover:scale-105 transition-transform">
                  <item.Component className="w-6 h-6" strokeWidth={1.75} />
                </div>
                <span className="font-mono text-[10px] text-slate-500">{item.num}</span>
                <span className="text-xs font-bold tracking-tight text-white">{item.name}</span>
                <span className="text-[10px] text-slate-400 mt-1">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. JMG ACCENT COLOR SYSTEM TEST */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-700">
              3. JMG Domain Accent System (Restrained 34px Containers)
            </h2>
            <span className="text-xs font-mono text-slate-400">1px border + subtle translucent tint</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {GLYPH_ITEMS.map((item) => (
              <div 
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col items-center text-center shadow-sm group hover:shadow-md transition-all cursor-pointer"
              >
                <div 
                  className="w-[34px] h-[34px] rounded-full flex items-center justify-center mb-3 border transition-all duration-200"
                  style={{
                    backgroundColor: `${item.accent}0E`,
                    borderColor: `${item.accent}30`,
                    color: item.accent
                  }}
                >
                  <item.Component className="w-[18px] h-[18px]" strokeWidth={1.85} />
                </div>
                <span className="font-mono text-[10px] text-slate-400">{item.num}</span>
                <span className="text-xs font-bold tracking-tight text-slate-800">{item.name}</span>
                <span className="text-[10px] font-mono mt-1" style={{ color: item.accent }}>
                  {item.accent}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. ACTUAL SIZES COMPARISON (14px, 18px, 24px, 32px) */}
        <div className="space-y-4">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-700">
            4. Optical Scale Fidelity (14px → 18px → 24px → 32px)
          </h2>
          <div className="bg-white border border-slate-200 rounded-xl p-6 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-mono text-slate-400 pb-2">
                  <th className="pb-3">Domain</th>
                  <th className="pb-3 text-center">14px (Dense)</th>
                  <th className="pb-3 text-center">18px (Ecosystem)</th>
                  <th className="pb-3 text-center">24px (Standard)</th>
                  <th className="pb-3 text-center">32px (Hero/Display)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {GLYPH_ITEMS.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-400">{item.num}</span>
                        <span className="text-xs font-bold">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="inline-flex items-center justify-center" style={{ color: item.accent }}>
                        <item.Component className="w-3.5 h-3.5" strokeWidth={1.75} />
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="inline-flex items-center justify-center" style={{ color: item.accent }}>
                        <item.Component className="w-[18px] h-[18px]" strokeWidth={1.85} />
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="inline-flex items-center justify-center" style={{ color: item.accent }}>
                        <item.Component className="w-6 h-6" strokeWidth={1.75} />
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="inline-flex items-center justify-center" style={{ color: item.accent }}>
                        <item.Component className="w-8 h-8" strokeWidth={1.65} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
