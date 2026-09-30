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
  Download, 
  ArrowRight,
  Filter,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export default function ProductShowcase({ onOpenContact }) {
  const [activeModule, setActiveModule] = useState('attendance');
  const [filterQuery, setFilterQuery] = useState('');

  const modules = [
    { id: 'students', label: 'Students', count: '2,840' },
    { id: 'faculty', label: 'Faculty', count: '142' },
    { id: 'attendance', label: 'Attendance', count: 'Live Today' },
    { id: 'fees', label: 'Fees', count: 'Reconciled' },
    { id: 'examination', label: 'Examination', count: 'Sem 7 & 8' },
    { id: 'timetable', label: 'Timetable', count: 'Conflict-Free' },
    { id: 'reports', label: 'Reports', count: 'Audited' },
  ];

  return (
    <section id="solutions" className="py-24 lg:py-36 bg-white border-b border-[#E2E8F0]">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 mb-4 font-mono text-xs font-semibold uppercase tracking-[0.2em]">
            <span className="text-[#2563EB]">05 —</span>
            <span className="text-[#1E293B]">DIGITAL PRODUCTS</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-[#111827] tracking-[-0.03em] leading-[1.08] mb-6">
            SOLUTIONS BUILT FOR<br />
            THE REAL WORLD.
          </h2>

          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed font-normal">
            A centralized digital platform designed to simplify institutional workflows, eliminate manual administrative friction, and provide unified visibility across departments.
          </p>
        </div>

        {/* Product Showcase Split: Left Details + Module List, Right Realistic ERP Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Product Details & Module Navigator */}
          <div className="lg:col-span-4">
            <span className="font-mono text-xs font-semibold uppercase text-[#2563EB] block mb-2">
              Featured Solution
            </span>

            <h3 className="text-3xl font-bold text-[#111827] tracking-tight mb-4">
              EDUCATION ERP
            </h3>

            <p className="text-base text-[#64748B] leading-relaxed font-normal mb-8">
              A digital ecosystem for modern institution management. Engineered specifically for universities, schools, and educational institutes.
            </p>

            {/* Mobile Module Selector (Horizontal scrollable tab bar for touch screens) */}
            <div className="lg:hidden mb-6 -mx-4 px-4 overflow-x-auto no-scrollbar flex items-center gap-2 pb-2">
              {modules.map((m) => {
                const isActive = activeModule === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveModule(m.id)}
                    className={`min-h-[44px] px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border flex-shrink-0 ${
                      isActive
                        ? 'bg-[#111827] text-white border-[#111827] shadow-sm'
                        : 'bg-white text-[#64748B] border-[#E2E8F0] hover:text-[#111827]'
                    }`}
                  >
                    <span>{m.label}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#64748B]'
                    }`}>
                      {m.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Desktop Clickable Module List */}
            <div className="hidden lg:block border-y border-[#E2E8F0] divide-y divide-[#E2E8F0] mb-8">
              {modules.map((m) => {
                const isActive = activeModule === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setActiveModule(m.id)}
                    className={`w-full py-3.5 flex items-center justify-between text-left transition-all ${
                      isActive 
                        ? 'text-[#111827] font-semibold pl-2 border-l-2 border-[#2563EB] bg-slate-50/50' 
                        : 'text-[#64748B] font-medium hover:text-[#111827]'
                    }`}
                  >
                    <span className="text-sm">{m.label}</span>
                    <span className="font-mono text-xs text-[#94A3B8]">{m.count}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={onOpenContact}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto min-h-[48px] px-6 py-3.5 rounded-[10px] bg-[#111827] hover:bg-[#2563EB] text-white font-medium text-sm transition-colors duration-200"
            >
              <span>Explore Solution</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Column: Large Realistic ERP Software Interface */}
          <div className="lg:col-span-8">
            <div className="border border-[#E2E8F0] rounded-[16px] bg-[#FAFAFA] shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
              
              {/* Product Window Header */}
              <div className="bg-white px-5 py-3 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-md bg-[#111827] text-white flex items-center justify-center font-bold text-xs">
                    ERP
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-[#111827] block">
                      Campus Administrative Suite &bull; Academic Portal
                    </span>
                    <span className="text-[11px] font-mono text-[#64748B]">
                      Role: Institutional Administrator &bull; Semester 7 &amp; 8
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Synchronized
                  </span>
                </div>
              </div>

              {/* ERP Workspace */}
              <div className="p-5 sm:p-6 space-y-6">
                
                {/* Real Metrics Summary Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white border border-[#E2E8F0] rounded-[10px] p-3">
                    <div className="text-[10px] font-mono uppercase text-[#94A3B8]">Enrollment</div>
                    <div className="text-lg font-bold text-[#111827] mt-0.5">2,840</div>
                    <div className="text-[10px] text-emerald-600 font-medium">100% KYC Approved</div>
                  </div>
                  <div className="bg-white border border-[#E2E8F0] rounded-[10px] p-3">
                    <div className="text-[10px] font-mono uppercase text-[#94A3B8]">Avg Attendance</div>
                    <div className="text-lg font-bold text-[#111827] mt-0.5">94.8%</div>
                    <div className="text-[10px] text-[#2563EB] font-medium">Biometric + App Verified</div>
                  </div>
                  <div className="bg-white border border-[#E2E8F0] rounded-[10px] p-3">
                    <div className="text-[10px] font-mono uppercase text-[#94A3B8]">Fee Reconciliation</div>
                    <div className="text-lg font-bold text-[#111827] mt-0.5">91.4%</div>
                    <div className="text-[10px] text-emerald-600 font-medium">Instant Bank Settlement</div>
                  </div>
                  <div className="bg-white border border-[#E2E8F0] rounded-[10px] p-3">
                    <div className="text-[10px] font-mono uppercase text-[#94A3B8]">Hall Tickets</div>
                    <div className="text-lg font-bold text-[#111827] mt-0.5">Issued</div>
                    <div className="text-[10px] text-[#64748B] font-medium">Zero Conflicts</div>
                  </div>
                </div>

                {/* Table Component */}
                <div className="bg-white border border-[#E2E8F0] rounded-[12px] overflow-hidden">
                  
                  {/* Table Controls */}
                  <div className="p-3 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 bg-[#FAFAFA]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-[#111827] capitalize">
                        {activeModule} Master Records
                      </span>
                      <span className="text-[11px] text-[#94A3B8]">
                        &bull; Real-time audit view
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Filter records..."
                          value={filterQuery}
                          onChange={(e) => setFilterQuery(e.target.value)}
                          className="pl-8 pr-3 py-1 rounded-md text-xs border border-[#E2E8F0] bg-white focus:outline-none focus:border-[#2563EB] w-36 sm:w-44 text-[#111827]"
                        />
                      </div>
                      <button className="p-1.5 rounded-md border border-[#E2E8F0] bg-white text-[#64748B] hover:text-[#111827]">
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Mobile ERP Record Cards View (sm:hidden) */}
                  <div className="sm:hidden p-3 space-y-3">
                    {(() => {
                      const MODULE_DATA = {
                        students: [
                          { id: 'STU-2024-089', entity: 'Aarav K. Patel', prog: 'B.Tech Comp Eng (Sem 7)', status: 'Active • 98% Attendance', badge: 'text-emerald-700 bg-emerald-50' },
                          { id: 'STU-2024-114', entity: 'Diya M. Shah', prog: 'B.Tech Info Tech (Sem 5)', status: 'Active • Fees Cleared', badge: 'text-emerald-700 bg-emerald-50' },
                          { id: 'STU-2024-205', entity: 'Rohan S. Mehta', prog: 'MBA Operations (Sem 3)', status: 'Active • Hall Ticket Issued', badge: 'text-blue-700 bg-blue-50' },
                          { id: 'STU-2024-340', entity: 'Ananya R. Joshi', prog: 'B.Arch Urban (Sem 4)', status: 'Active • 94% Attendance', badge: 'text-emerald-700 bg-emerald-50' },
                        ],
                        faculty: [
                          { id: 'FAC-102', entity: 'Dr. V. N. Sharma', prog: 'Head of Comp Engineering', status: 'Biometric Verified (08:45 AM)', badge: 'text-emerald-700 bg-emerald-50' },
                          { id: 'FAC-108', entity: 'Prof. K. L. Trivedi', prog: 'Information Technology Dept', status: 'In Lecture (Hall C-201)', badge: 'text-blue-700 bg-blue-50' },
                          { id: 'FAC-119', entity: 'Dr. R. P. Desai', prog: 'Business Administration', status: 'Evaluating Sem 7 Papers', badge: 'text-indigo-700 bg-indigo-50' },
                          { id: 'FAC-124', entity: 'Prof. S. M. Vora', prog: 'Civil Engineering Dept', status: 'Biometric Verified (09:02 AM)', badge: 'text-emerald-700 bg-emerald-50' },
                        ],
                        attendance: [
                          { id: 'ATT-401', entity: 'Computer Eng. (Sem 7)', prog: 'B.Tech CE • Lecture Hall 3', status: '62/66 (94% Present)', badge: 'text-emerald-700 bg-emerald-50' },
                          { id: 'ATT-402', entity: 'Information Tech (Sem 5)', prog: 'B.Tech IT • Lab 4B', status: '58/60 (96% Present)', badge: 'text-emerald-700 bg-emerald-50' },
                          { id: 'ATT-403', entity: 'Mechanical Eng. (Sem 3)', prog: 'B.Tech ME • Workshop 1', status: '48/52 (92% Present)', badge: 'text-blue-700 bg-blue-50' },
                          { id: 'ATT-404', entity: 'Business Admin (Sem 2)', prog: 'MBA Core • Seminar Hall', status: '42/45 (93% Present)', badge: 'text-emerald-700 bg-emerald-50' },
                        ],
                        fees: [
                          { id: 'FEE-8821', entity: 'Semester 7 Tuition Batch', prog: 'B.Tech CE (64 Transactions)', status: 'Settled via HDFC Netbanking', badge: 'text-emerald-700 bg-emerald-50' },
                          { id: 'FEE-8822', entity: 'Hostel & Mess Quarter 3', prog: 'Campus Residency (Block A-D)', status: 'Direct Bank Settlement', badge: 'text-emerald-700 bg-emerald-50' },
                          { id: 'FEE-8823', entity: 'Lab Consumable Grant', prog: 'Engineering AMC Reserve', status: 'Govt Subsidy Reconciled', badge: 'text-blue-700 bg-blue-50' },
                          { id: 'FEE-8824', entity: 'Alumni Endowment Fund', prog: 'Institutional Scholarship', status: 'Audited & Distributed', badge: 'text-emerald-700 bg-emerald-50' },
                        ],
                        examination: [
                          { id: 'EXM-701', entity: 'Distributed Systems & Cloud', prog: 'B.Tech CE • External Theory', status: 'Seating Locked (Zero Conflict)', badge: 'text-emerald-700 bg-emerald-50' },
                          { id: 'EXM-702', entity: 'Corporate Finance & Risk', prog: 'MBA • Case Study Evaluation', status: 'Digital Submission Verified', badge: 'text-emerald-700 bg-emerald-50' },
                          { id: 'EXM-703', entity: 'Structural Analysis II', prog: 'B.Tech Civil • Lab Viva', status: 'External Examiner Appointed', badge: 'text-blue-700 bg-blue-50' },
                          { id: 'EXM-704', entity: 'Microservices Architecture', prog: 'B.Tech IT • Practical Exam', status: 'Hall Tickets Cleared', badge: 'text-emerald-700 bg-emerald-50' },
                        ],
                        timetable: [
                          { id: 'TBL-101', entity: 'Monday 09:00 - 11:00 AM', prog: 'Advanced Cloud Computing • Hall 4', status: 'Allocated • No Overlap', badge: 'text-emerald-700 bg-emerald-50' },
                          { id: 'TBL-102', entity: 'Monday 11:30 - 01:30 PM', prog: 'Data Structures Lab • Terminal 2', status: 'Workstations Pre-loaded', badge: 'text-emerald-700 bg-emerald-50' },
                          { id: 'TBL-103', entity: 'Tuesday 02:00 - 04:00 PM', prog: 'Strategic Management • Executive Hall', status: 'Guest Lecture Confirmed', badge: 'text-blue-700 bg-blue-50' },
                          { id: 'TBL-104', entity: 'Wednesday 10:00 - 12:00 PM', prog: 'VLSI Design & Hardware • Lab 1', status: 'Clean Time Slot', badge: 'text-emerald-700 bg-emerald-50' },
                        ],
                        reports: [
                          { id: 'REP-041', entity: 'NAAC Institutional Compliance Ledger', prog: 'Annual Quality Audit (AQAR)', status: 'Digitally Signed by Registrar', badge: 'text-emerald-700 bg-emerald-50' },
                          { id: 'REP-042', entity: 'Fee Collection & Settlement Audit', prog: 'Statutory Chartered Ledger', status: 'Zero Reconciliation Variance', badge: 'text-emerald-700 bg-emerald-50' },
                          { id: 'REP-043', entity: 'Biometric Attendance Aggregation', prog: 'State University Portal Sync', status: 'API Transmission Success', badge: 'text-blue-700 bg-blue-50' },
                          { id: 'REP-044', entity: 'Faculty Academic Output Summary', prog: 'Research & Publications Index', status: 'Compiled for Governing Body', badge: 'text-emerald-700 bg-emerald-50' },
                        ],
                      };

                      const rows = MODULE_DATA[activeModule] || MODULE_DATA.attendance;
                      const filteredRows = filterQuery 
                        ? rows.filter(r => r.entity.toLowerCase().includes(filterQuery.toLowerCase()) || r.prog.toLowerCase().includes(filterQuery.toLowerCase()) || r.id.toLowerCase().includes(filterQuery.toLowerCase()))
                        : rows;

                      return filteredRows.map((row, idx) => (
                        <div key={idx} className="p-3.5 rounded-lg border border-[#E2E8F0] bg-white space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs text-[#64748B] bg-slate-100 px-2 py-0.5 rounded">
                              {row.id}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${row.badge}`}>
                              {row.status}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-[#111827]">{row.entity}</div>
                            <div className="text-xs text-[#64748B] mt-0.5">{row.prog}</div>
                          </div>
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[11px] font-mono text-[#94A3B8]">Audit Verified</span>
                            <button className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1 min-h-[36px]">
                              <span>Inspect Record &rarr;</span>
                            </button>
                          </div>
                        </div>
                      ));
                    })()}
                  </div>

                  {/* Desktop Table View (hidden sm:block) */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-[#E2E8F0] bg-white text-[#64748B] font-semibold text-[11px]">
                          <th className="py-2.5 px-4 font-mono">ID</th>
                          <th className="py-2.5 px-4">Entity / Department</th>
                          <th className="py-2.5 px-4">Program</th>
                          <th className="py-2.5 px-4">Status / Audit</th>
                          <th className="py-2.5 px-4 text-right">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0] font-normal">
                        {(() => {
                          const MODULE_DATA = {
                            students: [
                              { id: 'STU-2024-089', entity: 'Aarav K. Patel', prog: 'B.Tech Comp Eng (Sem 7)', status: 'Active • 98% Attendance', badge: 'text-emerald-700 bg-emerald-50' },
                              { id: 'STU-2024-114', entity: 'Diya M. Shah', prog: 'B.Tech Info Tech (Sem 5)', status: 'Active • Fees Cleared', badge: 'text-emerald-700 bg-emerald-50' },
                              { id: 'STU-2024-205', entity: 'Rohan S. Mehta', prog: 'MBA Operations (Sem 3)', status: 'Active • Hall Ticket Issued', badge: 'text-blue-700 bg-blue-50' },
                              { id: 'STU-2024-340', entity: 'Ananya R. Joshi', prog: 'B.Arch Urban (Sem 4)', status: 'Active • 94% Attendance', badge: 'text-emerald-700 bg-emerald-50' },
                            ],
                            faculty: [
                              { id: 'FAC-102', entity: 'Dr. V. N. Sharma', prog: 'Head of Comp Engineering', status: 'Biometric Verified (08:45 AM)', badge: 'text-emerald-700 bg-emerald-50' },
                              { id: 'FAC-108', entity: 'Prof. K. L. Trivedi', prog: 'Information Technology Dept', status: 'In Lecture (Hall C-201)', badge: 'text-blue-700 bg-blue-50' },
                              { id: 'FAC-119', entity: 'Dr. R. P. Desai', prog: 'Business Administration', status: 'Evaluating Sem 7 Papers', badge: 'text-indigo-700 bg-indigo-50' },
                              { id: 'FAC-124', entity: 'Prof. S. M. Vora', prog: 'Civil Engineering Dept', status: 'Biometric Verified (09:02 AM)', badge: 'text-emerald-700 bg-emerald-50' },
                            ],
                            attendance: [
                              { id: 'ATT-401', entity: 'Computer Eng. (Sem 7)', prog: 'B.Tech CE • Lecture Hall 3', status: '62/66 (94% Present)', badge: 'text-emerald-700 bg-emerald-50' },
                              { id: 'ATT-402', entity: 'Information Tech (Sem 5)', prog: 'B.Tech IT • Lab 4B', status: '58/60 (96% Present)', badge: 'text-emerald-700 bg-emerald-50' },
                              { id: 'ATT-403', entity: 'Mechanical Eng. (Sem 3)', prog: 'B.Tech ME • Workshop 1', status: '48/52 (92% Present)', badge: 'text-blue-700 bg-blue-50' },
                              { id: 'ATT-404', entity: 'Business Admin (Sem 2)', prog: 'MBA Core • Seminar Hall', status: '42/45 (93% Present)', badge: 'text-emerald-700 bg-emerald-50' },
                            ],
                            fees: [
                              { id: 'FEE-8821', entity: 'Semester 7 Tuition Batch', prog: 'B.Tech CE (64 Transactions)', status: 'Settled via HDFC Netbanking', badge: 'text-emerald-700 bg-emerald-50' },
                              { id: 'FEE-8822', entity: 'Hostel & Mess Quarter 3', prog: 'Campus Residency (Block A-D)', status: 'Direct Bank Settlement', badge: 'text-emerald-700 bg-emerald-50' },
                              { id: 'FEE-8823', entity: 'Lab Consumable Grant', prog: 'Engineering AMC Reserve', status: 'Govt Subsidy Reconciled', badge: 'text-blue-700 bg-blue-50' },
                              { id: 'FEE-8824', entity: 'Alumni Endowment Fund', prog: 'Institutional Scholarship', status: 'Audited & Distributed', badge: 'text-emerald-700 bg-emerald-50' },
                            ],
                            examination: [
                              { id: 'EXM-701', entity: 'Distributed Systems & Cloud', prog: 'B.Tech CE • External Theory', status: 'Seating Locked (Zero Conflict)', badge: 'text-emerald-700 bg-emerald-50' },
                              { id: 'EXM-702', entity: 'Corporate Finance & Risk', prog: 'MBA • Case Study Evaluation', status: 'Digital Submission Verified', badge: 'text-emerald-700 bg-emerald-50' },
                              { id: 'EXM-703', entity: 'Structural Analysis II', prog: 'B.Tech Civil • Lab Viva', status: 'External Examiner Appointed', badge: 'text-blue-700 bg-blue-50' },
                              { id: 'EXM-704', entity: 'Microservices Architecture', prog: 'B.Tech IT • Practical Exam', status: 'Hall Tickets Cleared', badge: 'text-emerald-700 bg-emerald-50' },
                            ],
                            timetable: [
                              { id: 'TBL-101', entity: 'Monday 09:00 - 11:00 AM', prog: 'Advanced Cloud Computing • Hall 4', status: 'Allocated • No Overlap', badge: 'text-emerald-700 bg-emerald-50' },
                              { id: 'TBL-102', entity: 'Monday 11:30 - 01:30 PM', prog: 'Data Structures Lab • Terminal 2', status: 'Workstations Pre-loaded', badge: 'text-emerald-700 bg-emerald-50' },
                              { id: 'TBL-103', entity: 'Tuesday 02:00 - 04:00 PM', prog: 'Strategic Management • Executive Hall', status: 'Guest Lecture Confirmed', badge: 'text-blue-700 bg-blue-50' },
                              { id: 'TBL-104', entity: 'Wednesday 10:00 - 12:00 PM', prog: 'VLSI Design & Hardware • Lab 1', status: 'Clean Time Slot', badge: 'text-emerald-700 bg-emerald-50' },
                            ],
                            reports: [
                              { id: 'REP-041', entity: 'NAAC Institutional Compliance Ledger', prog: 'Annual Quality Audit (AQAR)', status: 'Digitally Signed by Registrar', badge: 'text-emerald-700 bg-emerald-50' },
                              { id: 'REP-042', entity: 'Fee Collection & Settlement Audit', prog: 'Statutory Chartered Ledger', status: 'Zero Reconciliation Variance', badge: 'text-emerald-700 bg-emerald-50' },
                              { id: 'REP-043', entity: 'Biometric Attendance Aggregation', prog: 'State University Portal Sync', status: 'API Transmission Success', badge: 'text-blue-700 bg-blue-50' },
                              { id: 'REP-044', entity: 'Faculty Academic Output Summary', prog: 'Research & Publications Index', status: 'Compiled for Governing Body', badge: 'text-emerald-700 bg-emerald-50' },
                            ],
                          };

                          const rows = MODULE_DATA[activeModule] || MODULE_DATA.attendance;
                          const filteredRows = filterQuery 
                            ? rows.filter(r => r.entity.toLowerCase().includes(filterQuery.toLowerCase()) || r.prog.toLowerCase().includes(filterQuery.toLowerCase()) || r.id.toLowerCase().includes(filterQuery.toLowerCase()))
                            : rows;

                          return filteredRows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-[#FAFAFA] transition-colors">
                              <td className="py-2.5 px-4 font-mono text-[#64748B]">{row.id}</td>
                              <td className="py-2.5 px-4 font-medium text-[#111827]">{row.entity}</td>
                              <td className="py-2.5 px-4 text-[#64748B]">{row.prog}</td>
                              <td className="py-2.5 px-4">
                                <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${row.badge}`}>
                                  {row.status}
                                </span>
                              </td>
                              <td className="py-2.5 px-4 text-right">
                                <button className="text-[#2563EB] hover:underline font-medium text-[11px]">
                                  Inspect
                                </button>
                              </td>
                            </tr>
                          ));
                        })()}
                      </tbody>
                    </table>
                  </div>

                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-[#64748B] font-mono">
                  <span>PostgreSQL &bull; Redis &bull; Granular RBAC Permissions</span>
                  <span className="text-[#111827] font-semibold">Standard Institutional Build</span>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
