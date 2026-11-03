import React, { useState } from 'react';
import { X, Send, CheckCircle2, User, Mail, Phone, Briefcase, Link as LinkIcon, MessageSquare, AlertCircle } from 'lucide-react';
import { CAREER_DEPARTMENTS } from '../../data/careersData';
import { validatePublicInquiry, checkSubmissionCooldown, sanitizeString } from '../../utils/formSecurity';

export default function TalentPoolModal({ isOpen, onClose, preselectedDepartment }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: preselectedDepartment || CAREER_DEPARTMENTS[0],
    portfolio: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Honeypot & input validation
    const validation = validatePublicInquiry({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      honeypot
    });

    if (!validation.isValid) {
      if (validation.isBot) {
        setSubmitted(true);
        return;
      }
      setErrorMessage(validation.error);
      return;
    }

    const rateCheck = checkSubmissionCooldown('talent_pool', 8000);
    if (!rateCheck.allowed) {
      setErrorMessage(rateCheck.message);
      return;
    }

    setIsSubmitting(true);

    // Simulate reliable dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
        <div 
          className="relative w-full max-w-xl transform rounded-2xl bg-white p-6 sm:p-8 text-left shadow-2xl transition-all border border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {!submitted ? (
            <div>
              {/* Header */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-mono font-semibold uppercase tracking-wider mb-2">
                  <span>JMG TALENT POOL</span>
                </div>
                <h3 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
                  Connect with Jay Murlidhar Group
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Share your profile with our hiring team. We review submissions continuously and reach out when matching opportunities open up.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Anti-spam honeypot field (hidden from legitimate users) */}
                <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }}>
                  <label htmlFor="talent_website_hp">Do not fill this field</label>
                  <input
                    id="talent_website_hp"
                    type="text"
                    name="website_hp"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      placeholder="e.g. Rahul Patel"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: sanitizeString(e.target.value, 100) })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Preferred Department *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                      {CAREER_DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Portfolio / LinkedIn */}
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Portfolio / LinkedIn / GitHub (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <LinkIcon className="w-4 h-4" />
                    </div>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/... or https://github.com/..."
                      value={formData.portfolio}
                      onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Brief message */}
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Brief Introduction / Skills Summary
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none text-slate-400">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <textarea
                      rows={3}
                      placeholder="Tell us about your background, tools you work with, and what you would like to accomplish at JMG..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-sm transition-all shadow-md disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-blue-400" />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Profile to Talent Pool'}</span>
                  </button>
                  <p className="text-[11px] text-center text-slate-400 font-mono mt-2">
                    Direct communication with JMG talent leads • No spam guaranteed
                  </p>
                </div>
              </form>
            </div>
          ) : (
            <div className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-[#0F172A] mb-2">
                Profile Received!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                Thank you for your interest in Jay Murlidhar Group. Our team has received your details for the <strong className="text-slate-900">{formData.department}</strong> department and will review your profile.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2.5 rounded-lg bg-[#0F172A] text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
