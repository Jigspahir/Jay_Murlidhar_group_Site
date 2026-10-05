import { supabase, isSupabaseConfigured } from '../../lib/supabase';

/**
 * JAY MURLIDHAR GROUP (JMG) — CUSTOMER SERVICE
 * 
 * Production data layer for Customer Master & Company Scoping.
 * Communicates with PostgreSQL via Supabase RLS.
 */

export const CUSTOMER_TYPES = Object.freeze([
  { value: 'individual', label: 'Individual (Retail / Citizen / Personal)' },
  { value: 'business', label: 'Business (Corporate / MSME / Institution)' }
]);

export const CUSTOMER_STATUSES = Object.freeze([
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
]);

export const INDIAN_STATES = Object.freeze([
  'Gujarat',
  'Maharashtra',
  'Rajasthan',
  'Madhya Pradesh',
  'Delhi',
  'Karnataka',
  'Tamil Nadu',
  'Uttar Pradesh',
  'Punjab',
  'Haryana',
  'West Bengal',
  'Telangana',
  'Andhra Pradesh',
  'Kerala',
  'Goa',
  'Other'
]);

/**
 * Fetch customers list with filtering, company scoping, and pagination
 */
export async function getCustomers({
  companyId = null,
  isAllCompanies = false,
  search = '',
  customerType = 'all',
  status = 'active',
  city = '',
  state = '',
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
      .from('customers')
      .select(`
        id,
        customer_code,
        company_id,
        customer_type,
        first_name,
        last_name,
        company_name,
        display_name,
        email,
        phone,
        alternate_phone,
        tax_id,
        city,
        state,
        assigned_employee_id,
        status,
        created_at,
        company:companies (
          id,
          name,
          slug
        ),
        assigned_employee:employees!customers_assigned_employee_id_fkey (
          id,
          employee_code,
          first_name,
          last_name,
          designation
        )
      `, { count: 'exact' });

    // Company scoping:
    // If not in All Companies mode and companyId is provided, filter strictly to that company
    if (!isAllCompanies && companyId) {
      query = query.eq('company_id', companyId);
    }

    // Status filter
    if (status !== 'all') {
      query = query.eq('status', status);
    }

    // Customer Type filter
    if (customerType !== 'all') {
      query = query.eq('customer_type', customerType);
    }

    // City filter
    if (city && city.trim()) {
      query = query.ilike('city', `%${city.trim()}%`);
    }

    // State filter
    if (state && state.trim()) {
      query = query.eq('state', state.trim());
    }

    // Search query (code, name, company name, email, phone)
    if (search && search.trim()) {
      const q = search.trim();
      query = query.or(
        `customer_code.ilike.%${q}%,first_name.ilike.%${q}%,last_name.ilike.%${q}%,company_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`
      );
    }

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, count, error } = await query;

    if (error) {
      console.warn('[customerService] getCustomers error:', error.message);
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
    console.warn('[customerService] getCustomers exception:', err);
    return { data: [], count: 0, page, pageSize, totalPages: 0 };
  }
}

/**
 * Fetch a single customer by UUID or customer code with company and employee details
 */
export async function getCustomerById(customerId) {
  if (!customerId || !isSupabaseConfigured) return null;

  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(customerId);

    let query = supabase
      .from('customers')
      .select(`
        id,
        customer_code,
        company_id,
        customer_type,
        first_name,
        last_name,
        company_name,
        display_name,
        email,
        phone,
        alternate_phone,
        tax_id,
        address,
        city,
        state,
        postal_code,
        country,
        assigned_employee_id,
        status,
        notes,
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
        assigned_employee:employees!customers_assigned_employee_id_fkey (
          id,
          employee_code,
          first_name,
          last_name,
          designation,
          department,
          email,
          phone
        )
      `);

    if (isUuid) {
      query = query.eq('id', customerId);
    } else {
      query = query.eq('customer_code', customerId);
    }

    const { data, error } = await query.single();

    if (error) {
      console.warn('[customerService] getCustomerById error:', error.message);
      throw error;
    }

    return data;
  } catch (err) {
    console.warn('[customerService] getCustomerById exception:', err);
    return null;
  }
}

/**
 * Create a new Customer record
 */
export async function createCustomer(payload) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase client is not configured.');
  }

  const {
    company_id,
    customer_type = 'individual',
    first_name,
    last_name,
    company_name,
    email,
    phone,
    alternate_phone,
    tax_id,
    address,
    city,
    state,
    postal_code,
    country = 'India',
    assigned_employee_id,
    status = 'active',
    notes
  } = payload;

  if (!company_id) {
    throw new Error('Company assignment is required.');
  }

  if (customer_type === 'individual' && (!first_name || !first_name.trim())) {
    throw new Error('First name is required for individual customers.');
  }

  if (customer_type === 'business' && (!company_name || !company_name.trim())) {
    throw new Error('Business/Company name is required for business customers.');
  }

  if (!phone || !phone.trim()) {
    throw new Error('Phone number is required.');
  }

  // Sanitize phone
  const cleanPhone = phone.trim();
  const digitsOnly = cleanPhone.replace(/\D/g, '');
  if (digitsOnly.length < 7) {
    throw new Error('Please enter a valid phone number with at least 7 digits.');
  }

  // Validate optional email
  if (email && email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      throw new Error('Invalid email address format.');
    }
  }

  const insertData = {
    company_id,
    customer_type,
    first_name: first_name ? first_name.trim() : null,
    last_name: last_name ? last_name.trim() : null,
    company_name: company_name ? company_name.trim() : null,
    email: email && email.trim() ? email.trim().toLowerCase() : null,
    phone: cleanPhone,
    alternate_phone: alternate_phone && alternate_phone.trim() ? alternate_phone.trim() : null,
    tax_id: tax_id && tax_id.trim() ? tax_id.trim().toUpperCase() : null,
    address: address && address.trim() ? address.trim() : null,
    city: city && city.trim() ? city.trim() : null,
    state: state && state.trim() ? state.trim() : null,
    postal_code: postal_code && postal_code.trim() ? postal_code.trim() : null,
    country: country || 'India',
    assigned_employee_id: assigned_employee_id || null,
    status: status || 'active',
    notes: notes && notes.trim() ? notes.trim() : null
  };

  const { data, error } = await supabase
    .from('customers')
    .insert([insertData])
    .select()
    .single();

  if (error) {
    console.error('[customerService] createCustomer failed:', error);
    throw new Error(error.message || 'Failed to create customer record.');
  }

  return data;
}

/**
 * Update an existing Customer record
 */
export async function updateCustomer(customerId, payload) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase client is not configured.');
  }

  if (!customerId) {
    throw new Error('Customer ID is required for update.');
  }

  const {
    company_id,
    customer_type,
    first_name,
    last_name,
    company_name,
    email,
    phone,
    alternate_phone,
    tax_id,
    address,
    city,
    state,
    postal_code,
    country,
    assigned_employee_id,
    status,
    notes
  } = payload;

  const updateData = {};

  if (company_id !== undefined) updateData.company_id = company_id;
  if (customer_type !== undefined) updateData.customer_type = customer_type;
  if (first_name !== undefined) updateData.first_name = first_name ? first_name.trim() : null;
  if (last_name !== undefined) updateData.last_name = last_name ? last_name.trim() : null;
  if (company_name !== undefined) updateData.company_name = company_name ? company_name.trim() : null;

  if (phone !== undefined) {
    if (!phone || !phone.trim()) {
      throw new Error('Phone number is required.');
    }
    const cleanPhone = phone.trim();
    const digitsOnly = cleanPhone.replace(/\D/g, '');
    if (digitsOnly.length < 7) {
      throw new Error('Please enter a valid phone number with at least 7 digits.');
    }
    updateData.phone = cleanPhone;
  }

  if (email !== undefined) {
    if (email && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        throw new Error('Invalid email address format.');
      }
      updateData.email = email.trim().toLowerCase();
    } else {
      updateData.email = null;
    }
  }

  if (alternate_phone !== undefined) updateData.alternate_phone = alternate_phone ? alternate_phone.trim() : null;
  if (tax_id !== undefined) updateData.tax_id = tax_id ? tax_id.trim().toUpperCase() : null;
  if (address !== undefined) updateData.address = address ? address.trim() : null;
  if (city !== undefined) updateData.city = city ? city.trim() : null;
  if (state !== undefined) updateData.state = state ? state.trim() : null;
  if (postal_code !== undefined) updateData.postal_code = postal_code ? postal_code.trim() : null;
  if (country !== undefined) updateData.country = country || 'India';
  if (assigned_employee_id !== undefined) updateData.assigned_employee_id = assigned_employee_id || null;
  if (status !== undefined) updateData.status = status;
  if (notes !== undefined) updateData.notes = notes ? notes.trim() : null;

  const { data, error } = await supabase
    .from('customers')
    .update(updateData)
    .eq('id', customerId)
    .select()
    .single();

  if (error) {
    console.error('[customerService] updateCustomer failed:', error);
    throw new Error(error.message || 'Failed to update customer record.');
  }

  return data;
}

/**
 * Soft deactivation of customer (sets status = 'inactive')
 */
export async function deactivateCustomer(customerId) {
  if (!isSupabaseConfigured) throw new Error('Supabase client is not configured.');

  const { data, error } = await supabase
    .from('customers')
    .update({ status: 'inactive' })
    .eq('id', customerId)
    .select()
    .single();

  if (error) {
    console.error('[customerService] deactivateCustomer failed:', error);
    throw new Error(error.message || 'Failed to deactivate customer.');
  }

  return data;
}

/**
 * Reactivate a previously deactivated customer (sets status = 'active')
 */
export async function reactivateCustomer(customerId) {
  if (!isSupabaseConfigured) throw new Error('Supabase client is not configured.');

  const { data, error } = await supabase
    .from('customers')
    .update({ status: 'active' })
    .eq('id', customerId)
    .select()
    .single();

  if (error) {
    console.error('[customerService] reactivateCustomer failed:', error);
    throw new Error(error.message || 'Failed to reactivate customer.');
  }

  return data;
}

/**
 * Fetch eligible active employees who belong to the target company
 * for assignment as account/relationship manager.
 */
export async function getAssignableEmployees({ companyId = null } = {}) {
  if (!isSupabaseConfigured || !companyId) return [];

  try {
    const { data: assignments, error: assignError } = await supabase
      .from('employee_company_assignments')
      .select('employee_id')
      .eq('company_id', companyId)
      .eq('is_active', true);

    if (assignError || !assignments || assignments.length === 0) {
      return [];
    }

    const employeeIds = assignments.map((a) => a.employee_id);

    const { data, error } = await supabase
      .from('employees')
      .select('id, employee_code, first_name, last_name, designation, department')
      .in('id', employeeIds)
      .eq('status', 'active')
      .order('first_name', { ascending: true });

    if (error) {
      console.warn('[customerService] getAssignableEmployees error:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.warn('[customerService] getAssignableEmployees exception:', err);
    return [];
  }
}
