import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, AlertCircle } from 'lucide-react';
import {
  VENDOR_TYPES,
  VENDOR_STATUSES,
  INDIAN_STATES,
  isValidGSTIN,
  isValidPAN
} from './vendorService';

export default function VendorForm({
  initialData = null,
  companies = [],
  selectedCompanyId,
  isAllCompanies,
  onSubmit,
  isSubmitting = false
}) {
  const navigate = useNavigate();

  const [companyId, setCompanyId] = useState(
    initialData?.company_id || (isAllCompanies ? (companies[0]?.id || '') : selectedCompanyId || '')
  );

  const [vendorType, setVendorType] = useState(initialData?.vendor_type || 'distributor');
  const [legalName, setLegalName] = useState(initialData?.legal_name || '');
  const [tradeName, setTradeName] = useState(initialData?.trade_name || '');
  const [contactPerson, setContactPerson] = useState(initialData?.contact_person || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [alternatePhone, setAlternatePhone] = useState(initialData?.alternate_phone || '');

  const [gstin, setGstin] = useState(initialData?.gstin || '');
  const [pan, setPan] = useState(initialData?.pan || '');
  const [msmeRegistrationNo, setMsmeRegistrationNo] = useState(initialData?.msme_registration_no || '');

  const [billingAddress, setBillingAddress] = useState(initialData?.billing_address || '');
  const [billingCity, setBillingCity] = useState(initialData?.billing_city || 'Ahmedabad');
  const [billingState, setBillingState] = useState(initialData?.billing_state || 'Gujarat');
  const [billingPostalCode, setBillingPostalCode] = useState(initialData?.billing_postal_code || '380001');

  const [paymentTermsDays, setPaymentTermsDays] = useState(
    initialData?.payment_terms_days !== undefined ? initialData.payment_terms_days : 15
  );

  const [bankName, setBankName] = useState(initialData?.bank_name || '');
  const [bankAccountNo, setBankAccountNo] = useState(initialData?.bank_account_no || '');
  const [bankIfsc, setBankIfsc] = useState(initialData?.bank_ifsc || '');
  const [bankBranch, setBankBranch] = useState(initialData?.bank_branch || '');
  const [upiId, setUpiId] = useState(initialData?.upi_id || '');

  const [status, setStatus] = useState(initialData?.status || 'active');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!companyId) {
      setFormError('Please select a company for this vendor.');
      return;
    }
    if (!legalName.trim()) {
      setFormError('Vendor legal name is required.');
      return;
    }
    if (!phone.trim()) {
      setFormError('Primary phone number is required.');
      return;
    }
    if (!billingAddress.trim()) {
      setFormError('Billing address is required.');
      return;
    }
    if (gstin && !isValidGSTIN(gstin)) {
      setFormError('Invalid Indian GSTIN format (15 alphanumeric characters).');
      return;
    }
    if (pan && !isValidPAN(pan)) {
      setFormError('Invalid Indian PAN format (10 alphanumeric characters).');
      return;
    }

    try {
      await onSubmit({
        company_id: companyId,
        vendor_type: vendorType,
        legal_name: legalName,
        trade_name: tradeName,
        contact_person: contactPerson,
        email,
        phone,
        alternate_phone: alternatePhone,
        gstin,
        pan,
        msme_registration_no: msmeRegistrationNo,
        billing_address: billingAddress,
        billing_city: billingCity,
        billing_state: billingState,
        billing_postal_code: billingPostalCode,
        payment_terms_days: paymentTermsDays,
        bank_name: bankName,
        bank_account_no: bankAccountNo,
        bank_ifsc: bankIfsc,
        bank_branch: bankBranch,
        upi_id: upiId,
        status,
        notes
      });
    } catch (err) {
      console.error('VendorForm submit error:', err);
      setFormError(err.message || 'Failed to save vendor details.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {formError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-xs text-rose-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{formError}</span>
        </div>
      )}

      {/* 1. Basic & Company Information */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100 pb-2">
          1. Company & Identity
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              JMG Operating Company *
            </label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              disabled={Boolean(initialData)} // Company locked during edit
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white disabled:bg-slate-50 disabled:text-slate-500"
            >
              <option value="">Select Company</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Vendor Classification *
            </label>
            <select
              value={vendorType}
              onChange={(e) => setVendorType(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            >
              {VENDOR_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Legal Name (Registered Entity / Person) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Reliance Retail Ltd or Bharat Telecom"
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Trade Name / Doing Business As (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Jio Digital Life"
              value={tradeName}
              onChange={(e) => setTradeName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Contact Person & Communication */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100 pb-2">
          2. Contact & Communication
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Person / Rep
            </label>
            <input
              type="text"
              placeholder="Key Account Manager"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Primary Phone *
            </label>
            <input
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Alternate Phone
            </label>
            <input
              type="tel"
              placeholder="Office Landline / Support"
              value={alternatePhone}
              onChange={(e) => setAlternatePhone(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Billing Email
            </label>
            <input
              type="email"
              placeholder="accounts@vendor.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 3. Tax & Commercial Terms */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100 pb-2">
          3. Tax & Credit Terms
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              GSTIN (15 Chars)
            </label>
            <input
              type="text"
              maxLength={15}
              placeholder="24ABCDE1234F1Z5"
              value={gstin}
              onChange={(e) => setGstin(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              PAN (10 Chars)
            </label>
            <input
              type="text"
              maxLength={10}
              placeholder="ABCDE1234F"
              value={pan}
              onChange={(e) => setPan(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              MSME / Udyam Reg. No
            </label>
            <input
              type="text"
              placeholder="UDYAM-GJ-01-0000000"
              value={msmeRegistrationNo}
              onChange={(e) => setMsmeRegistrationNo(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Credit Days *
            </label>
            <input
              type="number"
              min={0}
              value={paymentTermsDays}
              onChange={(e) => setPaymentTermsDays(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
            />
            <span className="text-[10px] text-slate-400">Default credit buffer for AP due date</span>
          </div>
        </div>
      </div>

      {/* 4. Billing Address */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100 pb-2">
          4. Billing Address & State
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              required
              placeholder="Unit / Plot / Building / Road"
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              City *
            </label>
            <input
              type="text"
              required
              value={billingCity}
              onChange={(e) => setBillingCity(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              State / Union Territory *
            </label>
            <select
              value={billingState}
              onChange={(e) => setBillingState(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            >
              {INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              PIN / Postal Code *
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={billingPostalCode}
              onChange={(e) => setBillingPostalCode(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* 5. Banking Details for Disbursements */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold border-b border-slate-100 pb-2">
          5. Banking Details (For Outgoing NEFT/RTGS Settlements)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Beneficiary Bank Name
            </label>
            <input
              type="text"
              placeholder="e.g. State Bank of India"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Bank Account Number
            </label>
            <input
              type="text"
              placeholder="Current / Settlement A/c"
              value={bankAccountNo}
              onChange={(e) => setBankAccountNo(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Bank IFSC Code
            </label>
            <input
              type="text"
              maxLength={11}
              placeholder="SBIN0001234"
              value={bankIfsc}
              onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono uppercase"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Branch Name
            </label>
            <input
              type="text"
              placeholder="Main Branch / Area"
              value={bankBranch}
              onChange={(e) => setBankBranch(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              UPI VPA / QR ID
            </label>
            <input
              type="text"
              placeholder="vendor@okhdfcbank"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Vendor Profile Status *
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            >
              {VENDOR_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Internal Procurement Notes & Terms
          </label>
          <textarea
            rows={3}
            placeholder="Special commercial terms, contract references, discount covenants..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Action Strip */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => navigate('/admin/vendors')}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Vendors</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? 'Saving...' : initialData ? 'Update Vendor' : 'Register Vendor'}</span>
        </button>
      </div>
    </form>
  );
}
