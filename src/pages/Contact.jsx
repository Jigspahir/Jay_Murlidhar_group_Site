import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Building2, 
  CheckCircle2, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { validatePublicInquiry, checkSubmissionCooldown, sanitizeString } from '../utils/formSecurity';

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: 'technology',
    message: ''
  });

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
        setFormSubmitted(true);
        return;
      }
      setErrorMessage(validation.error);
      return;
    }

    // Cooldown check
    const rateCheck = checkSubmissionCooldown('contact_page', 8000);
    if (!rateCheck.allowed) {
      setErrorMessage(rateCheck.message);
      return;
    }

    setFormSubmitted(true);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Breadcrumb Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">Contact Us</span>
          </nav>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-[#0B1424] text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#38BDF8] bg-sky-950/60 px-3 py-1 rounded-md border border-sky-800/40">
              Get In Touch
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mt-4 mb-4 text-white">
              CONNECT WITH JAY MURLIDHAR GROUP.
            </h1>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
              Whether you are an institution exploring ERP solutions, an enterprise looking for business services, or seeking partnerships across our companies, we are here to assist you.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Details & Regional Offices */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Group Corporate Headquarters
              </h2>

              <div className="space-y-6 text-sm text-slate-600">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Principal Office</h3>
                    <p className="mt-1 leading-relaxed">
                      Jay Murlidhar Group, Near Motibagh,<br />
                      Junagadh - 362001, Junagadh District,<br />
                      Gujarat, India.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Direct Telephone</h3>
                    <a
                      href="tel:+919909461768"
                      className="mt-1 block hover:text-blue-600 transition-colors"
                    >
                      +91 9909461768
                    </a>
                    <p className="text-xs text-slate-400 mt-0.5">Mon–Sat, 10:00 AM – 6:00 PM IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Email Enquiries</h3>
                    <a
                      href="mailto:info.jaymurlidhargroup@gmail.com"
                      className="mt-1 block hover:text-blue-600 transition-colors break-all sm:break-normal"
                    >
                      info.jaymurlidhargroup@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Navigation to Domains */}
            <div className="bg-slate-100 rounded-2xl border border-slate-200 p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Looking for a specific business?
              </h3>
              <p className="text-xs text-slate-600 mb-4">
                Explore our dedicated domain and operating company pages for specialized point-of-contact details.
              </p>
              <Link
                to="/businesses"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                Browse Our Businesses Directory &rarr;
              </Link>
            </div>
          </div>

          {/* Form on Right */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Send an Enquiry</h2>
              <p className="text-sm text-slate-500 mb-8">
                Fill in your details below and our group coordination team will respond within 24 hours.
              </p>

              {formSubmitted ? (
                <div className="p-8 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-emerald-950">Thank you for your message!</h3>
                  <p className="text-sm text-emerald-700 mt-2 max-w-md mx-auto">
                    Your enquiry has been received by Jay Murlidhar Group. A representative will contact you shortly.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="mt-6 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Anti-spam honeypot field (hidden from legitimate users) */}
                  <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }}>
                    <label htmlFor="contact_website_hp">Do not fill this field</label>
                    <input
                      id="contact_website_hp"
                      type="text"
                      name="website_hp"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={100}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: sanitizeString(e.target.value, 100) })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm text-slate-900"
                        placeholder="e.g. Ramesh Patel"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        maxLength={120}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: sanitizeString(e.target.value, 120) })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm text-slate-900"
                        placeholder="ramesh@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        maxLength={25}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: sanitizeString(e.target.value, 25) })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm text-slate-900"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Area of Interest
                      </label>
                      <select
                        value={formData.interest}
                        onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm text-slate-900 bg-white"
                      >
                        <option value="technology">Technology &amp; Digital Solutions</option>
                        <option value="jan-suvidha">Jan Suvidha &amp; Citizen Services</option>
                        <option value="insurance">Jay Murlidhar Insurance</option>
                        <option value="business-services">Jay Murlidhar Business Services</option>
                        <option value="travel">Jay Murlidhar Tours</option>
                        <option value="retail">Jay Murlidhar Mobile &amp; Accessories</option>
                        <option value="academic-internship">Academic Innovation &amp; Internships</option>
                        <option value="general">General Group Partnership</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Message / Project Details *
                    </label>
                    <textarea
                      required
                      rows={5}
                      maxLength={2000}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: sanitizeString(e.target.value, 2000) })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm text-slate-900 resize-y"
                      placeholder="Please tell us about your requirements or enquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                  >
                    <span>Submit Enquiry</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
