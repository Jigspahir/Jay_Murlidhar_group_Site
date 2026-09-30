import React, { useState } from 'react';
import { X, Send, Check } from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    interest: 'Education ERP',
    message: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-content-primary/40 backdrop-blur-sm">
      <div className="bg-white rounded-container max-w-lg w-full p-6 sm:p-8 border border-line-border shadow-modal relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-surface-subtle text-content-secondary hover:text-content-primary transition-colors"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-content-primary mb-2">Inquiry Received</h3>
            <p className="text-xs sm:text-sm text-content-secondary max-w-sm mx-auto mb-6">
              Thank you for contacting Jay Murlidhar Group. Our operations and technical team will review your inquiry and follow up directly.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-5 py-2 rounded-btn bg-content-primary text-white text-xs font-semibold hover:bg-brand-blue transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-blue mb-1 block">
              Inquiry &amp; Consultation
            </span>

            <h3 className="text-2xl font-bold text-content-primary mb-2">
              Let's Talk
            </h3>
            <p className="text-xs sm:text-sm text-content-secondary mb-6 font-normal">
              Connect with Jay Murlidhar Group for education platforms, technical partnerships, or commercial solutions.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-content-primary uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jigar Parmar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-md border border-line-border text-xs focus:outline-none focus:border-brand-blue bg-surface-bg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-content-primary uppercase tracking-wider mb-1">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@organization.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-md border border-line-border text-xs focus:outline-none focus:border-brand-blue bg-surface-bg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-content-primary uppercase tracking-wider mb-1">
                    Area of Interest
                  </label>
                  <select
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-line-border text-xs focus:outline-none focus:border-brand-blue bg-surface-bg"
                  >
                    <option value="Jay Murlidhar Tech Solutions">Jay Murlidhar Tech Solutions</option>
                    <option value="Jay Murlidhar Computer">Jay Murlidhar Computer</option>
                    <option value="Jay Murlidhar Insurance">Jay Murlidhar Insurance</option>
                    <option value="Jay Murlidhar Business Services">Jay Murlidhar Business Services</option>
                    <option value="Jay Murlidhar Tours">Jay Murlidhar Tours</option>
                    <option value="Jay Murlidhar Mobile & Accessories">Jay Murlidhar Mobile &amp; Accessories</option>
                    <option value="Education ERP Platform">Education ERP Platform</option>
                    <option value="Parent Group General Partnership">Parent Group General Partnership</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-content-primary uppercase tracking-wider mb-1">
                  Institution / Organization
                </label>
                <input
                  type="text"
                  placeholder="University, College, or Company name"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-md border border-line-border text-xs focus:outline-none focus:border-brand-blue bg-surface-bg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-content-primary uppercase tracking-wider mb-1">
                  Brief Requirements
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe your timeline or specific functional requirements..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-md border border-line-border text-xs focus:outline-none focus:border-brand-blue bg-surface-bg resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-btn text-xs font-semibold text-content-secondary hover:bg-surface-subtle"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-btn bg-content-primary hover:bg-brand-blue text-white text-xs font-semibold shadow-subtle transition-colors flex items-center gap-1.5"
                >
                  <span>Submit Inquiry</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
