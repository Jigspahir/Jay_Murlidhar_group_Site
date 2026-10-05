import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { createCustomer } from '../customers/customerService';

/**
 * JAY MURLIDHAR GROUP (JMG) — ENQUIRY CRM SERVICE
 * 
 * Production data layer for Inbound Enquiries, Leads & Customer Conversion.
 * Communicates with PostgreSQL via Supabase RLS.
 */

export const ENQUIRY_STATUSES = Object.freeze([
  { value: 'new', label: 'New', badgeBg: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'contacted', label: 'Contacted', badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  { value: 'in_progress', label: 'In Progress', badgeBg: 'bg-amber-50 text-amber-700 border-amber-200' },
  { value: 'follow_up', label: 'Follow-up', badgeBg: 'bg-purple-50 text-purple-700 border-purple-200' },
  { value: 'converted', label: 'Converted', badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { value: 'closed', label: 'Closed', badgeBg: 'bg-slate-100 text-slate-700 border-slate-200' },
  { value: 'lost', label: 'Lost', badgeBg: 'bg-rose-50 text-rose-700 border-rose-200' }
]);

export const ENQUIRY_PRIORITIES = Object.freeze([
  { value: 'low', label: 'Low', color: 'text-slate-600 bg-slate-100' },
  { value: 'medium', label: 'Medium', color: 'text-blue-700 bg-blue-50 border border-blue-200' },
  { value: 'high', label: 'High', color: 'text-amber-700 bg-amber-50 border border-amber-200' },
  { value: 'urgent', label: 'Urgent', color: 'text-red-700 bg-red-50 border border-red-200' }
]);

export const ENQUIRY_SOURCES = Object.freeze([
  { value: 'website', label: 'Website' },
  { value: 'walk_in', label: 'Walk-in / Kiosk' },
  { value: 'phone', label: 'Phone Call' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'referral', label: 'Referral' },
  { value: 'social_media', label: 'Social Media' },
  { value: 'email', label: 'Email' },
  { value: 'other', label: 'Other' }
]);

/**
 * Fetch enquiries list with filtering, company scoping, and pagination
 */
export async function getEnquiries({
  companyId = null,
  isAllCompanies = false,
  search = '',
  serviceId = 'all',
  status = 'all',
  priority = 'all',
  source = 'all',
  assignedEmployeeId = 'all',
  page = 1,
  pageSize = 25
} = {}) {
  if (!isSupabaseConfigured) {
    return { data: [], count: 0, page, pageSize, totalPages: 0 };
  }

  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('enquiries')
      .select(`
        id,
        enquiry_code,
        company_id,
        customer_id,
        service_id,
        assigned_employee_id,
        contact_name,
        contact_phone,
        contact_email,
        subject,
        message,
        status,
        priority,
        source,
        created_at,
        updated_at,
        company:companies (
          id,
          name,
          slug
        ),
        customer:customers (
          id,
          customer_code,
          first_name,
          last_name,
          company_name,
          display_name
        ),
        service:services (
          id,
          service_code,
          service_name,
          category,
          billing_type,
          base_price
        ),
        assigned_employee:employees!enquiries_assigned_employee_id_fkey (
          id,
          employee_code,
          first_name,
          last_name,
          designation
        )
      `, { count: 'exact' });

    // Company scoping:
    if (!isAllCompanies && companyId) {
      query = query.eq('company_id', companyId);
    }

    // Status filter
    if (status !== 'all') {
      query = query.eq('status', status);
    }

    // Priority filter
    if (priority !== 'all') {
      query = query.eq('priority', priority);
    }

    // Source filter
    if (source !== 'all') {
      query = query.eq('source', source);
    }

    // Service filter
    if (serviceId !== 'all') {
      query = query.eq('service_id', serviceId);
    }

    // Assigned Employee filter
    if (assignedEmployeeId !== 'all') {
      query = query.eq('assigned_employee_id', assignedEmployeeId);
    }

    // Search query (code, contact_name, phone, email, subject)
    if (search && search.trim()) {
      const q = search.trim();
      query = query.or(
        `enquiry_code.ilike.%${q}%,contact_name.ilike.%${q}%,contact_phone.ilike.%${q}%,contact_email.ilike.%${q}%,subject.ilike.%${q}%`
      );
    }

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, count, error } = await query;

    if (error) {
      console.warn('[enquiryService] getEnquiries error:', error.message);
      throw error;
    }

    const records = data || [];
    const totalCount = count !== null ? count : records.length;
    const totalPages = Math.ceil(totalCount / pageSize) || 1;

    return {
      data: records,
      count: totalCount,
      page,
      pageSize,
      totalPages
    };
  } catch (err) {
    console.warn('[enquiryService] getEnquiries exception:', err);
    return { data: [], count: 0, page, pageSize, totalPages: 0 };
  }
}

/**
 * Fetch compact pipeline summary counts
 */
export async function getEnquiryPipelineCounts({ companyId = null, isAllCompanies = false } = {}) {
  if (!isSupabaseConfigured) {
    return {
      new: 0,
      contacted: 0,
      in_progress: 0,
      follow_up: 0,
      converted: 0,
      closed: 0,
      lost: 0,
      total: 0
    };
  }

  try {
    let query = supabase.from('enquiries').select('status');

    if (!isAllCompanies && companyId) {
      query = query.eq('company_id', companyId);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('[enquiryService] getEnquiryPipelineCounts error:', error.message);
      return {
        new: 0,
        contacted: 0,
        in_progress: 0,
        follow_up: 0,
        converted: 0,
        closed: 0,
        lost: 0,
        total: 0
      };
    }

    const counts = {
      new: 0,
      contacted: 0,
      in_progress: 0,
      follow_up: 0,
      converted: 0,
      closed: 0,
      lost: 0,
      total: (data || []).length
    };

    (data || []).forEach((row) => {
      if (counts[row.status] !== undefined) {
        counts[row.status]++;
      }
    });

    return counts;
  } catch (err) {
    console.warn('[enquiryService] getEnquiryPipelineCounts exception:', err);
    return {
      new: 0,
      contacted: 0,
      in_progress: 0,
      follow_up: 0,
      converted: 0,
      closed: 0,
      lost: 0,
      total: 0
    };
  }
}

/**
 * Fetch single enquiry by ID or enquiry code
 */
export async function getEnquiryById(enquiryId) {
  if (!enquiryId || !isSupabaseConfigured) return null;

  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(enquiryId);

    let query = supabase
      .from('enquiries')
      .select(`
        id,
        enquiry_code,
        company_id,
        customer_id,
        service_id,
        assigned_employee_id,
        contact_name,
        contact_phone,
        contact_email,
        subject,
        message,
        status,
        priority,
        source,
        created_at,
        updated_at,
        created_by,
        updated_by,
        company:companies (
          id,
          name,
          slug,
          legal_name
        ),
        customer:customers (
          id,
          customer_code,
          first_name,
          last_name,
          company_name,
          display_name,
          email,
          phone,
          customer_type
        ),
        service:services (
          id,
          service_code,
          service_name,
          category,
          billing_type,
          base_price,
          description
        ),
        assigned_employee:employees!enquiries_assigned_employee_id_fkey (
          id,
          employee_code,
          first_name,
          last_name,
          designation,
          email,
          phone
        )
      `);

    if (isUuid) {
      query = query.eq('id', enquiryId);
    } else {
      query = query.eq('enquiry_code', enquiryId);
    }

    const { data, error } = await query.single();

    if (error) {
      console.warn('[enquiryService] getEnquiryById error:', error.message);
      throw error;
    }

    return data;
  } catch (err) {
    console.warn('[enquiryService] getEnquiryById exception:', err);
    return null;
  }
}

/**
 * Create a new Enquiry record
 */
export async function createEnquiry(payload) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase client is not configured.');
  }

  const {
    company_id,
    customer_id = null,
    service_id = null,
    assigned_employee_id = null,
    contact_name,
    contact_phone,
    contact_email = null,
    subject,
    message = null,
    status = 'new',
    priority = 'medium',
    source = 'website'
  } = payload;

  if (!company_id) {
    throw new Error('Company is required.');
  }

  if (!contact_name || !contact_name.trim()) {
    throw new Error('Contact name is required.');
  }

  if (!contact_phone || !contact_phone.trim()) {
    throw new Error('Contact phone is required.');
  }

  if (!subject || !subject.trim()) {
    throw new Error('Subject / enquiry title is required.');
  }

  const insertData = {
    company_id,
    customer_id: customer_id || null,
    service_id: service_id || null,
    assigned_employee_id: assigned_employee_id || null,
    contact_name: contact_name.trim(),
    contact_phone: contact_phone.trim(),
    contact_email: contact_email ? contact_email.trim() : null,
    subject: subject.trim(),
    message: message ? message.trim() : null,
    status: status || 'new',
    priority: priority || 'medium',
    source: source || 'website'
  };

  const { data, error } = await supabase
    .from('enquiries')
    .insert(insertData)
    .select(`
      id,
      enquiry_code,
      company_id,
      customer_id,
      service_id,
      assigned_employee_id,
      contact_name,
      contact_phone,
      contact_email,
      subject,
      status,
      priority,
      source
    `)
    .single();

  if (error) {
    console.error('[enquiryService] createEnquiry error:', error.message);
    throw new Error(error.message || 'Failed to create enquiry.');
  }

  return data;
}

/**
 * Update an existing Enquiry record
 */
export async function updateEnquiry(enquiryId, payload) {
  if (!enquiryId || !isSupabaseConfigured) {
    throw new Error('Enquiry ID and Supabase configuration are required.');
  }

  const {
    customer_id,
    service_id,
    assigned_employee_id,
    contact_name,
    contact_phone,
    contact_email,
    subject,
    message,
    status,
    priority,
    source
  } = payload;

  const updateData = {};

  if (customer_id !== undefined) updateData.customer_id = customer_id || null;
  if (service_id !== undefined) updateData.service_id = service_id || null;
  if (assigned_employee_id !== undefined) updateData.assigned_employee_id = assigned_employee_id || null;

  if (contact_name !== undefined) {
    if (!contact_name.trim()) throw new Error('Contact name cannot be empty.');
    updateData.contact_name = contact_name.trim();
  }

  if (contact_phone !== undefined) {
    if (!contact_phone.trim()) throw new Error('Contact phone cannot be empty.');
    updateData.contact_phone = contact_phone.trim();
  }

  if (contact_email !== undefined) {
    updateData.contact_email = contact_email ? contact_email.trim() : null;
  }

  if (subject !== undefined) {
    if (!subject.trim()) throw new Error('Subject cannot be empty.');
    updateData.subject = subject.trim();
  }

  if (message !== undefined) {
    updateData.message = message ? message.trim() : null;
  }

  if (status !== undefined) updateData.status = status;
  if (priority !== undefined) updateData.priority = priority;
  if (source !== undefined) updateData.source = source;

  const { data, error } = await supabase
    .from('enquiries')
    .update(updateData)
    .eq('id', enquiryId)
    .select(`
      id,
      enquiry_code,
      company_id,
      customer_id,
      service_id,
      assigned_employee_id,
      contact_name,
      contact_phone,
      contact_email,
      subject,
      status,
      priority,
      source
    `)
    .single();

  if (error) {
    console.error('[enquiryService] updateEnquiry error:', error.message);
    throw new Error(error.message || 'Failed to update enquiry.');
  }

  return data;
}

/**
 * Update enquiry workflow status
 */
export async function updateEnquiryStatus(enquiryId, status) {
  return updateEnquiry(enquiryId, { status });
}

/**
 * Convert an enquiry into a customer:
 * - If customer_id exists: update enquiry status to 'converted'
 * - If customer_id is null: create customer using Customer architecture, link new customer to enquiry, update status to 'converted'
 */
export async function convertEnquiryToCustomer({
  enquiryId,
  customerData = null
}) {
  if (!enquiryId) throw new Error('Enquiry ID is required.');

  // Fetch enquiry to inspect state
  const enquiry = await getEnquiryById(enquiryId);
  if (!enquiry) throw new Error('Enquiry not found.');

  let targetCustomerId = enquiry.customer_id;

  // If no customer is currently linked, create one
  if (!targetCustomerId) {
    if (!customerData) {
      // Split contact name into first and last name
      const nameParts = (enquiry.contact_name || '').trim().split(/\s+/);
      const firstName = nameParts[0] || 'Customer';
      const lastName = nameParts.slice(1).join(' ') || '';

      customerData = {
        company_id: enquiry.company_id,
        customer_type: 'individual',
        first_name: firstName,
        last_name: lastName,
        phone: enquiry.contact_phone,
        email: enquiry.contact_email || null,
        assigned_employee_id: enquiry.assigned_employee_id || null,
        notes: `Converted from Enquiry ${enquiry.enquiry_code}: ${enquiry.subject}`
      };
    }

    const newCustomer = await createCustomer(customerData);
    targetCustomerId = newCustomer.id;
  }

  // Update enquiry with customer_id and set status to 'converted'
  const updatedEnquiry = await updateEnquiry(enquiryId, {
    customer_id: targetCustomerId,
    status: 'converted'
  });

  return {
    enquiry: updatedEnquiry,
    customerId: targetCustomerId
  };
}

/**
 * Fetch active customers belonging to a specific company for form dropdowns
 */
export async function getCompanyCustomers(companyId) {
  if (!companyId || !isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase
      .from('customers')
      .select('id, customer_code, first_name, last_name, company_name, display_name, phone, email')
      .eq('company_id', companyId)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[enquiryService] getCompanyCustomers error:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.warn('[enquiryService] getCompanyCustomers exception:', err);
    return [];
  }
}
