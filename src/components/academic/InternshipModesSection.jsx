import React, { useState } from 'react';
import { 
  Laptop, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Wifi, 
  MapPin 
} from 'lucide-react';
import { INTERNSHIP_MODES } from '../../data/academicInnovationData';

export default function InternshipModesSection({ onOpenContact }) {
  const [activeTab, setActiveTab] = useState('online');

  return (
    <section id="modes" className="py-16 lg:py-24 bg-[#FAFAFA] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>02 — PARTICIPATION MODES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            Flexible Ways to Learn and Experience.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Whether you need flexible remote engagement alongside semester exams or immersive in-office professional scrums, Jay Murlidhar Group supports structured learning across two distinct delivery formats.
          </p>
        </div>

        {/* Interactive Mode Toggle Bar on Tablet/Mobile */}
        <div className="flex sm:hidden items-center p-1 rounded-xl bg-slate-200/80 mb-6">
          <button
            onClick={() => setActiveTab('online')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'online' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Online Internship
          </button>
          <button
            onClick={() => setActiveTab('offline')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'offline' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Offline Internship
          </button>
        </div>

        {/* Split Editorial Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {INTERNSHIP_MODES.map((mode) => {
            const isOnline = mode.id === 'online';
            const isHiddenOnMobile = activeTab !== mode.id;

            return (
              <div
                key={mode.id}
                className={`bg-white rounded-2xl border transition-all duration-300 p-7 sm:p-9 shadow-sm hover:shadow-md flex flex-col justify-between ${
                  isOnline 
                    ? 'border-blue-200/90 hover:border-blue-400' 
                    : 'border-orange-200/90 hover:border-[#EA580C]'
                } ${isHiddenOnMobile ? 'hidden sm:flex' : 'flex'}`}
              >
                <div>
                  {/* Card Eyebrow */}
                  <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-xs ${
                        isOnline 
                          ? 'bg-blue-50 text-blue-600 border-blue-200' 
                          : 'bg-orange-50 text-[#EA580C] border-orange-200'
                      }`}>
                        {isOnline ? <Laptop className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
                      </div>
                      <div>
                        <span className={`text-[11px] font-mono font-bold uppercase tracking-wider block ${
                          isOnline ? 'text-blue-600' : 'text-[#EA580C]'
                        }`}>
                          MODE &bull; {mode.badge}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                          {mode.title}
                        </h3>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono font-medium text-slate-500">
                      {isOnline ? <Wifi className="w-3.5 h-3.5 text-blue-500" /> : <MapPin className="w-3.5 h-3.5 text-orange-500" />}
                      <span>{isOnline ? 'Virtual Hub' : 'On-Site Gujarat'}</span>
                    </div>
                  </div>

                  {/* Summary & Tagline */}
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 mb-2">
                    {mode.tagline}
                  </p>
                  <p className="text-sm text-slate-600 font-normal leading-relaxed mb-6">
                    {mode.description}
                  </p>

                  {/* Core Features List */}
                  <div className="space-y-3.5 mb-8">
                    {mode.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${
                          isOnline ? 'text-blue-600' : 'text-[#EA580C]'
                        }`} />
                        <div>
                          <div className="text-xs font-bold text-slate-900 mb-0.5">{feat.title}</div>
                          <div className="text-xs text-slate-600 leading-relaxed font-normal">{feat.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Note & Enquiry Action */}
                <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-xs font-mono text-slate-500 leading-normal max-w-xs">
                    {mode.modeNote}
                  </div>
                  <button
                    onClick={onOpenContact}
                    className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white transition-all shadow-xs ${
                      isOnline ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#EA580C] hover:bg-orange-700'
                    }`}
                  >
                    <span>Enquire for {isOnline ? 'Online' : 'Offline'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
