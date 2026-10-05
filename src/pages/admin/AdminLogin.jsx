import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Building2, 
  Layers, 
  Lightbulb, 
  TrendingUp 
} from 'lucide-react';

export default function AdminLogin() {
  const { signIn, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotInfo, setShowForgotInfo] = useState(false);

  // If already authenticated and not loading, redirect to target or /admin
  const destination = location.state?.from?.pathname || '/admin';
  if (isAuthenticated && !isLoading) {
    return <Navigate to={destination} replace />;
  }

  // Client-side validation
  const validate = () => {
    const errors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (isSubmitting) return;

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await signIn({ email, password });
      navigate(destination, { replace: true });
    } catch (err) {
      setFormError(err.message || 'Unable to sign in. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#F8FAFC] text-[#0F172A] relative flex flex-col justify-center py-4 sm:py-6 lg:py-8 overflow-hidden selection:bg-[#2563EB] selection:text-white">
      {/* Subtle brand background ambiance contained strictly within inset-0 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div 
          className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-bl from-orange-100/50 via-blue-50/40 to-transparent rounded-full blur-3xl -mr-40 -mt-40" 
        />
        <div 
          className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-blue-100/40 via-slate-100/30 to-transparent rounded-full blur-3xl -ml-40 -mb-40" 
        />
      </div>

      {/* Main Centered Content Container */}
      <main className="w-full max-w-[1320px] mx-auto px-4 sm:px-8 lg:px-12 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_480px] gap-8 lg:gap-12 xl:gap-16 items-center w-full">
          
          {/* =========================================================
              LEFT BRAND SECTION (JMG Brand & Ecosystem)
          ========================================================== */}
          <div className="w-full max-w-[620px] mx-auto lg:mx-0 flex flex-col justify-between">
            
            {/* Brand Pillars Eyebrow */}
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-mono font-bold tracking-wider text-[#64748B] uppercase">
              <span className="text-[#EA580C]">PEOPLE</span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-[#2563EB]">BUSINESS</span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-[#0F172A]">TECHNOLOGY</span>
              <span className="text-slate-300">&bull;</span>
              <span className="text-[#EA580C]">GROWTH</span>
            </div>

            {/* Strong Headline */}
            <div className="mt-4 sm:mt-5">
              <h1 className="text-3xl sm:text-4xl lg:text-[40px] xl:text-[44px] font-extrabold text-[#0F172A] tracking-tight leading-[1.14]">
                ONE GROUP.<br />
                <span className="text-[#EA580C]">MANY POSSIBILITIES.</span>
              </h1>
            </div>

            {/* Supporting Text */}
            <div className="mt-3.5">
              <p className="text-base sm:text-lg text-[#334155] font-medium leading-snug">
                Integrated businesses. Connected operations. Digital growth.
              </p>
            </div>

            {/* Description */}
            <div className="mt-2.5">
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-lg">
                The centralized operational hub managing commerce, technology, finance, and multi-company enterprise workflows across the Jay Murlidhar Group.
              </p>
            </div>

            {/* Feature Cards Grid (2 cols x 2 rows, equal size & 16px gap) */}
            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              
              {/* Item 1: Multiple Businesses */}
              <div className="h-[70px] p-3 sm:p-3.5 rounded-xl bg-white/85 backdrop-blur-sm border border-slate-200/80 shadow-sm flex items-center gap-3 hover:border-[#EA580C]/40 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-100 text-[#EA580C] flex items-center justify-center shrink-0">
                  <Building2 className="w-4.5 h-4.5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#0F172A] truncate">Multiple Businesses</div>
                  <div className="text-[11px] text-[#64748B] truncate">Integrated company ecosystem</div>
                </div>
              </div>

              {/* Item 2: Connected Operations */}
              <div className="h-[70px] p-3 sm:p-3.5 rounded-xl bg-white/85 backdrop-blur-sm border border-slate-200/80 shadow-sm flex items-center gap-3 hover:border-[#2563EB]/40 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 text-[#2563EB] flex items-center justify-center shrink-0">
                  <Layers className="w-4.5 h-4.5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#0F172A] truncate">Connected Operations</div>
                  <div className="text-[11px] text-[#64748B] truncate">Real-time operational sync</div>
                </div>
              </div>

              {/* Item 3: Innovation Driven */}
              <div className="h-[70px] p-3 sm:p-3.5 rounded-xl bg-white/85 backdrop-blur-sm border border-slate-200/80 shadow-sm flex items-center gap-3 hover:border-[#2563EB]/40 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 text-[#2563EB] flex items-center justify-center shrink-0">
                  <Lightbulb className="w-4.5 h-4.5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#0F172A] truncate">Innovation Driven</div>
                  <div className="text-[11px] text-[#64748B] truncate">Cloud-native architecture</div>
                </div>
              </div>

              {/* Item 4: Sustainable Growth */}
              <div className="h-[70px] p-3 sm:p-3.5 rounded-xl bg-white/85 backdrop-blur-sm border border-slate-200/80 shadow-sm flex items-center gap-3 hover:border-[#EA580C]/40 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-100 text-[#EA580C] flex items-center justify-center shrink-0">
                  <TrendingUp className="w-4.5 h-4.5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#0F172A] truncate">Sustainable Growth</div>
                  <div className="text-[11px] text-[#64748B] truncate">Enterprise scale governance</div>
                </div>
              </div>

            </div>

          </div>

          {/* =========================================================
              RIGHT LOGIN SECTION (Compact Enterprise Login Card)
          ========================================================== */}
          <div className="w-full max-w-[480px] mx-auto lg:mx-0">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_16px_40px_rgba(15,23,42,0.06)] overflow-hidden">
              
              {/* Branded dual-tone top accent strip: Orange & Blue (rounded top corners preserved) */}
              <div className="h-1.5 w-full flex" aria-hidden="true">
                <div className="h-full w-1/3 bg-[#EA580C]" />
                <div className="h-full w-2/3 bg-[#2563EB]" />
              </div>

              {/* Card Body: 28-32px top/bottom padding, 32-36px horizontal desktop padding */}
              <div className="px-6 sm:px-8 lg:px-9 pt-7 sm:pt-8 pb-6 sm:pb-7">
                
                {/* Brand Header with Clickable Official JMG Logo (22-28px gap to WORK EMAIL) */}
                <div className="flex justify-center mb-6">
                  <Link 
                    to="/" 
                    aria-label="Return to Jay Murlidhar Group public website"
                    className="inline-flex items-center justify-center rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2 transition-all duration-200 hover:opacity-90 hover:scale-[1.01] cursor-pointer"
                  >
                    <img 
                      src="/assets/jay-murlidhar-group-logo.png" 
                      alt="Jay Murlidhar Group" 
                      className="w-auto h-auto max-w-[145px] sm:max-w-[155px] max-h-[50px] object-contain"
                      loading="eager"
                    />
                  </Link>
                </div>

                {/* Form-level Error Alert */}
                {formError && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="leading-relaxed font-sans">{formError}</div>
                  </div>
                )}

                {/* Forgot Password Information Banner */}
                {showForgotInfo && (
                  <div className="mb-4 p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start justify-between gap-2.5 animate-in fade-in duration-200">
                    <div className="leading-relaxed">
                      <span className="font-semibold block mb-0.5 text-[#1D4ED8]">Password Reset Assistance</span>
                      To reset your administrative credentials, please contact the Group System Administrator at <span className="font-mono font-medium underline">admin@jaymurlidhargroup.co.in</span>.
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setShowForgotInfo(false)}
                      className="text-blue-500 hover:text-blue-800 text-base font-bold shrink-0 leading-none px-1"
                      aria-label="Dismiss reset notice"
                    >
                      &times;
                    </button>
                  </div>
                )}

                {/* Sign In Form: Compact vertical rhythm with controlled spacing */}
                <form onSubmit={handleSubmit} noValidate>
                  
                  {/* Work Email Field (15-16px label, 8px margin-bottom, 52-54px input, 12-14px radius) */}
                  <div className="w-full">
                    <label 
                      htmlFor="admin-email" 
                      className="block text-sm sm:text-[15px] font-mono font-semibold text-slate-700 uppercase tracking-wider mb-2"
                    >
                      Work Email
                    </label>
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        id="admin-email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        disabled={isSubmitting}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (fieldErrors.email) {
                            setFieldErrors((prev) => ({ ...prev, email: '' }));
                          }
                        }}
                        placeholder="name@jaymurlidhargroup.co.in"
                        className={`w-full h-[52px] sm:h-[54px] pl-10 pr-3.5 rounded-xl bg-slate-50/60 hover:bg-white text-slate-900 text-sm sm:text-[15px] border focus:outline-none focus:bg-white transition-all placeholder:text-slate-400 placeholder:text-sm sm:placeholder:text-[14px] ${
                          fieldErrors.email 
                            ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10' 
                            : 'border-slate-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15'
                        }`}
                      />
                    </div>
                    {fieldErrors.email && (
                      <p className="mt-1 text-xs text-rose-600 font-sans">
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Password Field (18-22px gap from email input, 8px gap before password input) */}
                  <div className="w-full mt-5">
                    <div className="flex items-center justify-between mb-2">
                      <label 
                        htmlFor="admin-password" 
                        className="block text-sm sm:text-[15px] font-mono font-semibold text-slate-700 uppercase tracking-wider"
                      >
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotInfo(true)}
                        className="text-[13.5px] sm:text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8] hover:underline focus:outline-none cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        id="admin-password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        value={password}
                        disabled={isSubmitting}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (fieldErrors.password) {
                            setFieldErrors((prev) => ({ ...prev, password: '' }));
                          }
                        }}
                        placeholder="••••••••••••"
                        className={`w-full h-[52px] sm:h-[54px] pl-10 pr-10 rounded-xl bg-slate-50/60 hover:bg-white text-slate-900 text-sm sm:text-[15px] border focus:outline-none focus:bg-white transition-all placeholder:text-slate-400 placeholder:text-sm sm:placeholder:text-[14px] ${
                          fieldErrors.password 
                            ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10' 
                            : 'border-slate-200 focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <p className="mt-1 text-xs text-rose-600 font-sans">
                        {fieldErrors.password}
                      </p>
                    )}
                  </div>

                  {/* Submit Action (20-24px gap after password input, 54px button height) */}
                  <div className="w-full mt-[22px]">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-[54px] px-4 rounded-xl bg-[#1D4ED8] hover:bg-[#1E40AF] active:bg-[#1E3A8A] text-white font-semibold text-sm sm:text-base transition-all duration-150 flex items-center justify-center gap-2 shadow-sm hover:shadow disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Authenticating...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                </form>

                {/* Security Notice: 24px gap below Sign In, divider, 18-20px before text, 20-24px card bottom */}
                <div className="mt-6 pt-[18px] border-t border-slate-200/80 flex items-center justify-center gap-2 text-xs sm:text-[13.5px] font-mono text-slate-500 whitespace-nowrap">
                  <ShieldCheck className="w-4 h-4 text-[#2563EB] shrink-0" />
                  <span>Authorized access only</span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Subtle Corporate Footer sitting naturally below content */}
      <footer className="w-full max-w-[1320px] mx-auto px-4 mt-4 sm:mt-6 pb-4 sm:pb-5 text-center text-[13px] sm:text-sm font-mono text-slate-400 z-10 leading-[1.4]">
        &copy; 2026 Jay Murlidhar Group. All Rights Reserved.
      </footer>
    </div>
  );
}
