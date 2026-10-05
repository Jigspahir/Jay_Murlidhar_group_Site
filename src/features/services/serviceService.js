import { supabase, isSupabaseConfigured } from '../../lib/supabase';

/**
 * JAY MURLIDHAR GROUP (JMG) — SERVICE MASTER SERVICE
 * 
 * Production data layer for Services Master & Company Scoping.
 * Communicates with PostgreSQL via Supabase RLS.
 */

export const BILLING_TYPES = Object.freeze([
  { value: 'fixed', label: 'Fixed Price' },
  { value: 'hourly', label: 'Hourly Rate' },
  { value: 'recurring_monthly', label: 'Monthly Recurring' },
  { value: 'quote_based', label: 'Quote Based / Custom' },
  { value: 'government_fee', label: 'Government Fee / Citizen Rate' }
]);

export const SERVICE_STATUSES = Object.freeze([
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
]);

export const SERVICE_CATEGORIES = Object.freeze([
  'Technology',
  'RTO Services',
  'CSC & Citizen Services',
  'Business Registration',
  'Academy',
  'Insurance',
  'Business Compliance',
  'Travel & Tours',
  'Retail & Hardware',
  'Other'
]);

/**
 * Fetch services list with filtering, company scoping, and pagination
 */
export async function getServices({
  companyId = null,
  isAllCompanies = false,
  search = '',
  category = 'all',
  billingType = 'all',
  status = 'active',
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
      .from('services')
      .select(`
        id,
        service_code,
        service_name,
        description,
        company_id,
        category,
        base_price,
        billing_type,
        status,
        created_at,
        updated_at,
        company:companies (
          id,
          name,
          slug
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

    // Category filter
    if (category !== 'all') {
      query = query.eq('category', category);
    }

    // Billing Type filter
    if (billingType !== 'all') {
      query = query.eq('billing_type', billingType);
    }

    // Search query (code, name, description, category)
    if (search && search.trim()) {
      const q = search.trim();
      query = query.or(
        `service_code.ilike.%${q}%,service_name.ilike.%${q}%,description.ilike.%${q}%,category.ilike.%${q}%`
      );
    }

    query = query.order('created_at', { ascending: false }).range(from, to);

    const { data, count, error } = await query;

    if (error) {
      console.warn('[serviceService] getServices error:', error.message);
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
    console.warn('[serviceService] getServices exception:', err);
    return { data: [], count: 0, page, pageSize, totalPages: 0 };
  }
}

/**
 * Fetch a single service by UUID or service code with company details
 */
export async function getServiceById(serviceId) {
  if (!serviceId || !isSupabaseConfigured) return null;

  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(serviceId);

    let query = supabase
      .from('services')
      .select(`
        id,
        service_code,
        service_name,
        description,
        company_id,
        category,
        base_price,
        billing_type,
        status,
        created_at,
        updated_at,
        created_by,
        updated_by,
        company:companies (
          id,
          name,
          slug,
          legal_name,
          domain_id
        )
      `);

    if (isUuid) {
      query = query.eq('id', serviceId);
    } else {
      query = query.eq('service_code', serviceId);
    }

    const { data, error } = await query.single();

    if (error) {
      console.warn('[serviceService] getServiceById error:', error.message);
      throw error;
    }

    return data;
  } catch (err) {
    console.warn('[serviceService] getServiceById exception:', err);
    return null;
  }
}

/**
 * Fetch active services for a given company (used in dropdowns, enquiries)
 */
export async function getCompanyServices(companyId) {
  if (!companyId || !isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase
      .from('services')
      .select('id, service_code, service_name, category, billing_type, base_price, status')
      .eq('company_id', companyId)
      .eq('status', 'active')
      .order('service_name', { ascending: true });

    if (error) {
      console.warn('[serviceService] getCompanyServices error:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.warn('[serviceService] getCompanyServices exception:', err);
    return [];
  }
}

/**
 * Create a new Service record
 */
export async function createService(payload) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase client is not configured.');
  }

  const {
    company_id,
    service_name,
    description,
    category,
    base_price = 0,
    billing_type = 'fixed',
    status = 'active'
  } = payload;

  if (!company_id) {
    throw new Error('Company is required.');
  }

  if (!service_name || !service_name.trim()) {
    throw new Error('Service name is required.');
  }

  const numericPrice = Number(base_price);
  if (isNaN(numericPrice) || numericPrice < 0) {
    throw new Error('Base price must be a non-negative number.');
  }

  const insertData = {
    company_id,
    service_name: service_name.trim(),
    description: description ? description.trim() : null,
    category: category || 'General',
    base_price: numericPrice,
    billing_type: billing_type || 'fixed',
    status: status || 'active'
  };

  const { data, error } = await supabase
    .from('services')
    .insert(insertData)
    .select(`
      id,
      service_code,
      service_name,
      company_id,
      category,
      base_price,
      billing_type,
      status
    `)
    .single();

  if (error) {
    console.error('[serviceService] createService error:', error.message);
    throw new Error(error.message || 'Failed to create service.');
  }

  return data;
}

/**
 * Update an existing Service record
 */
export async function updateService(serviceId, payload) {
  if (!serviceId || !isSupabaseConfigured) {
    throw new Error('Service ID and Supabase configuration are required.');
  }

  const {
    service_name,
    description,
    category,
    base_price,
    billing_type,
    status
  } = payload;

  const updateData = {};

  if (service_name !== undefined) {
    if (!service_name || !service_name.trim()) {
      throw new Error('Service name cannot be empty.');
    }
    updateData.service_name = service_name.trim();
  }

  if (description !== undefined) {
    updateData.description = description ? description.trim() : null;
  }

  if (category !== undefined) {
    updateData.category = category;
  }

  if (base_price !== undefined) {
    const numericPrice = Number(base_price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      throw new Error('Base price must be a non-negative number.');
    }
    updateData.base_price = numericPrice;
  }

  if (billing_type !== undefined) {
    updateData.billing_type = billing_type;
  }

  if (status !== undefined) {
    updateData.status = status;
  }

  const { data, error } = await supabase
    .from('services')
    .update(updateData)
    .eq('id', serviceId)
    .select(`
      id,
      service_code,
      service_name,
      company_id,
      category,
      base_price,
      billing_type,
      status
    `)
    .single();

  if (error) {
    console.error('[serviceService] updateService error:', error.message);
    throw new Error(error.message || 'Failed to update service.');
  }

  return data;
}

/**
 * Soft deactivate a service (status = 'inactive')
 */
export async function deactivateService(serviceId) {
  return updateService(serviceId, { status: 'inactive' });
}

/**
 * Reactivate an inactive service (status = 'active')
 */
export async function reactivateService(serviceId) {
  return updateService(serviceId, { status: 'active' });
}
