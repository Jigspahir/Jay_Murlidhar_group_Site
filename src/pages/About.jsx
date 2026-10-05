import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { 
  Building2, 
  Target, 
  Compass, 
  Users, 
  Award, 
  ShieldCheck, 
  ArrowRight, 
  Globe2, 
  Layers,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { JMG_DOMAINS } from '../data/jmgEcosystem';
import FinalCTA from '../components/FinalCTA';

const GROUP_METRICS = [
  { value: "25+", label: "Years of Trust", sub: "Regional foundation & institutional heritage" },
  { value: "5", label: "Business Domains", sub: "Fully interconnected operating verticals" },
  { value: "6", label: "Operating Companies", sub: "Dedicated operating entities" },
  { value: "50,000+", label: "Stakeholders Served", sub: "Students, institutions, clients & partners" },
];

export default function About() {
  const context = useOutletContext();
  const onOpenContact = context?.onOpenContact;

  const pillars = [
    {
      title: "One Unified Vision",
      desc: "Jay Murlidhar Group operates as an integrated multi-domain conglomerate, combining institutional trust with high-velocity digital execution.",
      icon: Target,
      color: "from-blue-600 to-indigo-600"
    },
    {
      title: "Interconnected Ecosystem",
      desc: "From software engineering and insurance to corporate business services, travel, and mobility retail, our businesses empower each other.",
      icon: Layers,
      color: "from-emerald-600 to-teal-600"
    },
    {
      title: "Institutional Heritage",
      desc: "Over 25+ years of delivering trusted solutions to educational institutions, enterprises, and regional communities across Gujarat and beyond.",
      icon: Award,
      color: "from-amber-600 to-orange-600"
    },
    {
      title: "Future-Ready Technology",
      desc: "Investing continuously in modern cloud platforms, automated workflows, and high-impact software systems.",
      icon: Sparkles,
      color: "from-violet-600 to-purple-600"
    }
  ];

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Breadcrumb Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">About Jay Murlidhar Group</span>
          </nav>
        </div>
      </div>

      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-[#070D18] text-white py-20 lg:py-28">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#2563EB_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400 uppercase tracking-widest mb-6">
              <Building2 className="w-3.5 h-3.5" />
              Corporate Profile
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white mb-6">
              ONE GROUP.<br />
              MULTIPLE BUSINESSES.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400">
                ONE CONNECTED ECOSYSTEM.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-light mb-8">
              Jay Murlidhar Group is an ambitious multi-sector conglomerate with active operations spanning Technology &amp; Digital, Insurance, Business Services, Travel, and Retail.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/ecosystem"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/30"
              >
                <span>Explore Full Ecosystem</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={onOpenContact}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm transition-all backdrop-blur-sm"
              >
                Contact Leadership
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Row */}
      <section className="bg-white border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {GROUP_METRICS.map((metric, idx) => (
              <div key={idx} className="border-l-2 border-blue-600 pl-4">
                <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {metric.value}
                </div>
                <div className="text-xs uppercase font-bold text-slate-500 mt-1 tracking-wider">
                  {metric.label}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {metric.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Group Philosophy & Pillars */}
      <section className="py-20 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Strategic Foundation
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-4 mb-4">
            How We Structure Value Across Disciplines
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Every business under the Jay Murlidhar Group operates with functional independence while drawing from our central pool of technological capital, governance standards, and operational synergy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center mb-6 shadow-md`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ecosystem Domains Grid */}
      <section className="py-16 bg-slate-100 border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Domains</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Our Operating Domains</h2>
            </div>
            <Link to="/ecosystem" className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-4 md:mt-0">
              View All 6 Domains <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {JMG_DOMAINS.map((domain) => (
              <Link
                key={domain.id}
                to={domain.domainRoute}
                className="bg-white p-6 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-slate-400">{domain.number}</span>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: domain.accentColor }} />
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {domain.name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                  {domain.tagline}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600">
                  <span>Explore Domain</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <FinalCTA onOpenContact={onOpenContact} />
    </div>
  );
}
