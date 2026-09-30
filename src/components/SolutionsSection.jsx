import React, { useState } from 'react';
import { 
  Users, 
  UserCheck, 
  CalendarCheck, 
  CreditCard, 
  FileSpreadsheet, 
  Clock, 
  BarChart2, 
  Search, 
  Filter, 
  Download, 
  Check, 
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building
} from 'lucide-react';

export default function SolutionsSection({ onOpenContact }) {
  const [activeModule, setActiveModule] = useState('attendance');
  const [searchQuery, setSearchQuery] = useState('');

  const modules = [
    { id: 'students', label: 'Students', icon: Users, badge: '2,840 Active' },
    { id: 'faculty', label: 'Faculty', icon: UserCheck, badge: '142 Staff' },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck, badge: 'Live Today' },
    { id: 'fees', label: 'Fees', icon: CreditCard, badge: 'Reconciled' },
    { id: 'examination', label: 'Examination', icon: FileSpreadsheet, badge: 'Sem 7 & 8' },
    { id: 'timetable', label: 'Timetable', icon: Clock, badge: 'Conflict-Free' },
    { id: 'reports', label: 'Reports', icon: BarChart2, badge: 'Export CSV/PDF' },
  ];

  return (
    <section id="solutions" className="py-20 lg:py-28 bg-white border-b border-line-border">
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-blue mb-3">
            <span>Product Showcase</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-content-primary tracking-tight leading-tight mb-4">
            EDUCATION ERP.
          </h2>

          <p className="text-sm sm:text-base text-content-secondary leading-relaxed font-normal">
            A practical, modern campus operating platform designed for real institutional workflows. Built to centralize student management, fee auditing, academic scheduling, and faculty tasks without unnecessary complexity.
          </p>
        </div>

        {/* Real Product UI Container */}
        <div className="bg-surface-bg border border-line-border rounded-container shadow-subtle overflow-hidden">
          
          {/* Dashboard Window Header */}
          <div className="bg-white px-5 py-3 border-b border-line-border flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-blue text-white flex items-center justify-center font-bold text-xs">
                ERP
              </div>
              <div>
                <span className="text-xs font-bold text-content-primary block">
                  Campus Admin Suite &bull; Swarrnim Campus Hub
                </span>
                <span className="text-[11px] text-content-secondary font-mono">
                  v2.4.0 &bull; Academic Year 2026&ndash;27
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Live Syncing
              </span>
              <button
                onClick={onOpenContact}
                className="px-3.5 py-1.5 rounded-md bg-content-primary hover:bg-brand-blue text-white text-xs font-semibold transition-colors"
              >
                Request Deployment
              </button>
            </div>
          </div>

          {/* Dashboard Workspace: Sidebar + Main Stage */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
            
            {/* Sidebar Modules */}
            <div className="lg:col-span-3 bg-white border-r border-line-border p-3 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-content-muted px-3 py-2">
                Core Modules
              </div>
              {modules.map((m) => {
                const Icon = m.icon;
                const isActive = activeModule === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveModule(m.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all text-left ${
                      isActive
                        ? 'bg-surface-subtle text-content-primary font-bold'
                        : 'text-content-secondary hover:text-content-primary hover:bg-surface-bg'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-brand-blue' : 'text-content-secondary'}`} />
                      <span>{m.label}</span>
                    </div>
                    <span className="text-[10px] text-content-muted font-normal">
                      {m.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Main Stage Content */}
            <div className="lg:col-span-9 p-5 sm:p-6 bg-surface-bg flex flex-col justify-between">
              
              <div>
                {/* Module Top Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  <div className="bg-white border border-line-border rounded-xl p-3 shadow-subtle">
                    <span className="text-[10px] font-bold uppercase text-content-secondary block">Enrollment</span>
                    <span className="text-lg font-bold text-content-primary">2,840</span>
                    <span className="text-[10px] text-emerald-600 block">&uarr; 100% Verified</span>
                  </div>
                  <div className="bg-white border border-line-border rounded-xl p-3 shadow-subtle">
                    <span className="text-[10px] font-bold uppercase text-content-secondary block">Attendance Avg</span>
                    <span className="text-lg font-bold text-content-primary">94.6%</span>
                    <span className="text-[10px] text-brand-blue block">Today's Sessions</span>
                  </div>
                  <div className="bg-white border border-line-border rounded-xl p-3 shadow-subtle">
                    <span className="text-[10px] font-bold uppercase text-content-secondary block">Fee Audit</span>
                    <span className="text-lg font-bold text-content-primary">92.1%</span>
                    <span className="text-[10px] text-emerald-600 block">Current Term Cleared</span>
                  </div>
                  <div className="bg-white border border-line-border rounded-xl p-3 shadow-subtle">
                    <span className="text-[10px] font-bold uppercase text-content-secondary block">Scheduled Exams</span>
                    <span className="text-lg font-bold text-content-primary">18 Units</span>
                    <span className="text-[10px] text-content-secondary block">Hall Tickets Issued</span>
                  </div>
                </div>

                {/* Live Functional Table Simulation */}
                <div className="bg-white border border-line-border rounded-xl overflow-hidden shadow-subtle">
                  
                  {/* Table Control Bar */}
                  <div className="p-3 border-b border-line-border flex flex-wrap items-center justify-between gap-3 bg-surface-bg">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-content-primary capitalize">
                        {activeModule} Ledger View
                      </span>
                      <span className="text-[11px] text-content-muted">
                        &bull; Showing recent entries
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-content-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Filter records..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8 pr-3 py-1 rounded-md text-xs border border-line-border bg-white focus:outline-none focus:border-brand-blue w-36 sm:w-48"
                        />
                      </div>
                      <button className="p-1.5 rounded-md border border-line-border bg-white text-content-secondary hover:text-content-primary">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Table Rows */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-line-border bg-white text-content-secondary font-bold text-[11px]">
                          <th className="py-2.5 px-4">Identifier</th>
                          <th className="py-2.5 px-4">Entity / Department</th>
                          <th className="py-2.5 px-4">Category</th>
                          <th className="py-2.5 px-4">Metric / Status</th>
                          <th className="py-2.5 px-4 text-right">Audit Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-line-border font-normal">
                        {activeModule === 'attendance' && [
                          { id: 'REC-081', entity: 'Computer Eng. (Sem 7)', cat: 'Lecture 401', status: '62/66 Present (94%)', badge: 'bg-emerald-50 text-emerald-700' },
                          { id: 'REC-082', entity: 'Information Tech (Sem 5)', cat: 'Lab 2', status: '58/60 Present (96%)', badge: 'bg-emerald-50 text-emerald-700' },
                          { id: 'REC-083', entity: 'Mechanical Eng. (Sem 3)', cat: 'Workshop B', status: '48/52 Present (92%)', badge: 'bg-blue-50 text-blue-700' },
                          { id: 'REC-084', entity: 'Civil Eng. (Sem 5)', cat: 'Surveying Lab', status: '34/38 Present (89%)', badge: 'bg-blue-50 text-blue-700' },
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-surface-bg transition-colors">
                            <td className="py-2.5 px-4 font-mono font-medium text-content-primary">{row.id}</td>
                            <td className="py-2.5 px-4 font-semibold text-content-primary">{row.entity}</td>
                            <td className="py-2.5 px-4 text-content-secondary">{row.cat}</td>
                            <td className="py-2.5 px-4">
                              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${row.badge}`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-right">
                              <button className="text-brand-blue hover:underline font-semibold text-[11px]">
                                View Roll
                              </button>
                            </td>
                          </tr>
                        ))}

                        {activeModule === 'students' && [
                          { id: '23CE0101', entity: 'Kavya Sharma', cat: 'B.Tech Comp Eng', status: 'Active & Enrolled', badge: 'bg-emerald-50 text-emerald-700' },
                          { id: '23IT0204', entity: 'Aarav Patel', cat: 'B.Tech Info Tech', status: 'Fees Reconciled', badge: 'bg-emerald-50 text-emerald-700' },
                          { id: '23ME0308', entity: 'Devanshi Mehta', cat: 'Mechanical Eng', status: 'ID Card Issued', badge: 'bg-blue-50 text-blue-700' },
                          { id: '23MB0112', entity: 'Rohan Joshi', cat: 'MBA Finance', status: 'Documents Verified', badge: 'bg-emerald-50 text-emerald-700' },
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-surface-bg transition-colors">
                            <td className="py-2.5 px-4 font-mono font-medium text-content-primary">{row.id}</td>
                            <td className="py-2.5 px-4 font-semibold text-content-primary">{row.entity}</td>
                            <td className="py-2.5 px-4 text-content-secondary">{row.cat}</td>
                            <td className="py-2.5 px-4">
                              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${row.badge}`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-right">
                              <button className="text-brand-blue hover:underline font-semibold text-[11px]">
                                Dossier
                              </button>
                            </td>
                          </tr>
                        ))}

                        {(activeModule !== 'attendance' && activeModule !== 'students') && [
                          { id: 'MOD-901', entity: 'Core Academic Ledger', cat: activeModule.toUpperCase(), status: 'Synchronized & Verified', badge: 'bg-emerald-50 text-emerald-700' },
                          { id: 'MOD-902', entity: 'Automated Compliance Check', cat: activeModule.toUpperCase(), status: 'Regulatory Standard OK', badge: 'bg-blue-50 text-blue-700' },
                          { id: 'MOD-903', entity: 'Batch Ledger Reconciliation', cat: activeModule.toUpperCase(), status: 'Zero Discrepancies', badge: 'bg-emerald-50 text-emerald-700' },
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-surface-bg transition-colors">
                            <td className="py-2.5 px-4 font-mono font-medium text-content-primary">{row.id}</td>
                            <td className="py-2.5 px-4 font-semibold text-content-primary">{row.entity}</td>
                            <td className="py-2.5 px-4 text-content-secondary">{row.cat}</td>
                            <td className="py-2.5 px-4">
                              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${row.badge}`}>
                                {row.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-right">
                              <button className="text-brand-blue hover:underline font-semibold text-[11px]">
                                Inspect
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>

              {/* Bottom Architectural Specs Note */}
              <div className="mt-6 pt-4 border-t border-line-border flex flex-wrap items-center justify-between text-xs text-content-secondary gap-2">
                <span>Architecture: React &bull; Node &bull; PostgreSQL &bull; Granular RBAC Permissions</span>
                <span className="font-semibold text-content-primary">Production-Ready Institutional ERP</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
