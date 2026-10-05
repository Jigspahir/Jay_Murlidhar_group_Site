import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * JAY MURLIDHAR GROUP (JMG) — COMPANY SERVICE
 * 
 * Production data layer for Multi-Company Management & User-Company Bridge.
 * Interacts directly with PostgreSQL via Supabase RLS.
 */

// Canonical Seed Fallbacks (used for initial render resilience if Supabase is offline/unconfigured)
export const CANONICAL_DOMAINS = [
  {
    id: 'd1000000-0000-0000-0000-000000000001',
    name: 'Technology',
    slug: 'technology',
    description: 'Custom software engineering, cloud infrastructure, modern web platforms, and intelligent automation.',
    is_active: true
  },
  {
    id: 'd1000000-0000-0000-0000-000000000002',
    name: 'Jan Suvidha',
    slug: 'jan-suvidha',
    description: 'Common Services Centre (CSC), digital public kiosk, government e-services, and digital education.',
    is_active: true
  },
  {
    id: 'd1000000-0000-0000-0000-000000000003',
    name: 'Insurance',
    slug: 'insurance',
    description: 'Corporate underwriting, institutional liability risk mitigation, and comprehensive claims advocacy.',
    is_active: true
  },
  {
    id: 'd1000000-0000-0000-0000-000000000004',
    name: 'Business Services',
    slug: 'business-services',
    description: 'Corporate workflow assistance, statutory compliance filings, legal certifications, and operational management.',
    is_active: true
  },
  {
    id: 'd1000000-0000-0000-0000-000000000005',
    name: 'Travel',
    slug: 'travel',
    description: 'Curated institutional study tours, university student delegations, faculty expeditions, and corporate itineraries.',
    is_active: true
  },
  {
    id: 'd1000000-0000-0000-0000-000000000006',
    name: 'Retail',
    slug: 'retail',
    description: 'Smart mobility hardware, student computing device provisioning, and certified electronics servicing.',
    is_active: true
  }
];

export const CANONICAL_ROLES = [
  {
    id: 'r1000000-0000-0000-0000-000000000001',
    name: 'Group Owner / Super Admin',
    slug: 'group_owner',
    description: 'Full unrestricted administrative access across all JMG group companies and consolidated systems.'
  },
  {
    id: 'r1000000-0000-0000-0000-000000000002',
    name: 'Company Manager',
    slug: 'company_manager',
    description: 'Business management and operational administrative access scoped to assigned companies.'
  },
  {
    id: 'r1000000-0000-0000-0000-000000000003',
    name: 'Employee',
    slug: 'employee',
    description: 'Operational staff access for daily workflows and customer service within assigned companies.'
  }
];

export const CANONICAL_COMPANIES = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    name: 'Jay Murlidhar Tech Solutions',
    slug: 'jay-murlidhar-tech-solutions',
    legal_name: 'Jay Murlidhar Tech Solutions Pvt. Ltd.',
    description: 'Custom software engineering, cloud infrastructure, APIs, and modern digital applications.',
    domain_id: 'd1000000-0000-0000-0000-000000000001',
    logo_url: null,
    is_active: true,
    created_at: '2026-10-01T00:00:00.000Z',
    updated_at: '2026-10-01T00:00:00.000Z',
    domain: CANONICAL_DOMAINS[0]
  },
  {
    id: 'c1000000-0000-0000-0000-000000000002',
    name: 'Jay Murlidhar Computer',
    slug: 'jay-murlidhar-computer',
    legal_name: 'Jay Murlidhar Computer (CSC & Jan Suvidha Kendra)',
    description: 'Your trusted neighbourhood kiosk for all digital services, government schemes, and digital literacy.',
    domain_id: 'd1000000-0000-0000-0000-000000000002', // Strictly Jan Suvidha
    logo_url: null,
    is_active: true,
    created_at: '2026-10-01T00:00:00.000Z',
    updated_at: '2026-10-01T00:00:00.000Z',
    domain: CANONICAL_DOMAINS[1]
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    name: 'Jay Murlidhar Insurance',
    slug: 'jay-murlidhar-insurance',
    legal_name: 'Jay Murlidhar Insurance Services',
    description: 'Comprehensive institutional liability risk mitigation, life and general insurance, and claims advocacy.',
    domain_id: 'd1000000-0000-0000-0000-000000000003',
    logo_url: null,
    is_active: true,
    created_at: '2026-10-01T00:00:00.000Z',
    updated_at: '2026-10-01T00:00:00.000Z',
    domain: CANONICAL_DOMAINS[2]
  },
  {
    id: 'c1000000-0000-0000-0000-000000000004',
    name: 'Jay Murlidhar Business Services',
    slug: 'jay-murlidhar-business-services',
    legal_name: 'Jay Murlidhar Business Services',
    description: 'Statutory business registrations (GST, MSME, PAN/TAN), tax filings, legal certifications, and corporate compliance.',
    domain_id: 'd1000000-0000-0000-0000-000000000004',
    logo_url: null,
    is_active: true,
    created_at: '2026-10-01T00:00:00.000Z',
    updated_at: '2026-10-01T00:00:00.000Z',
    domain: CANONICAL_DOMAINS[3]
  },
  {
    id: 'c1000000-0000-0000-0000-000000000005',
    name: 'Jay Murlidhar Tours',
    slug: 'jay-murlidhar-tours',
    legal_name: 'Jay Murlidhar Tours & Travels',
    description: 'Institutional study tours, university student delegations, faculty expeditions, and corporate travel.',
    domain_id: 'd1000000-0000-0000-0000-000000000005',
    logo_url: null,
    is_active: true,
    created_at: '2026-10-01T00:00:00.000Z',
    updated_at: '2026-10-01T00:00:00.000Z',
    domain: CANONICAL_DOMAINS[4]
  },
  {
    id: 'c1000000-0000-0000-0000-000000000006',
    name: 'Jay Murlidhar Mobile & Accessories',
    slug: 'jay-murlidhar-mobile-accessories',
    legal_name: 'Jay Murlidhar Mobile & Accessories',
    description: 'Smart mobility hardware, student computing device provisioning, and certified electronics servicing.',
    domain_id: 'd1000000-0000-0000-0000-000000000006',
    logo_url: null,
    is_active: true,
    created_at: '2026-10-01T00:00:00.000Z',
    updated_at: '2026-10-01T00:00:00.000Z',
    domain: CANONICAL_DOMAINS[5]
  }
];

/**
 * Generate a URL-safe, lowercase slug from a company name
 */
export function generateSlug(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Fetch all companies with joined domain data
 */
export async function fetchCompanies() {
  if (!isSupabaseConfigured) {
    return CANONICAL_COMPANIES;
  }

  try {
    const { data, error } = await supabase
      .from('companies')
      .select(`
        id,
        name,
        slug,
        legal_name,
        description,
        logo_url,
        domain_id,
        is_active,
        created_at,
        updated_at,
        domain:domains (
          id,
          name,
          slug,
          description
        )
      `)
      .order('name', { ascending: true });

    if (error) {
      console.warn('[companyService] fetchCompanies failed, using canonical fallback:', error.message);
      return CANONICAL_COMPANIES;
    }

    return data && data.length > 0 ? data : CANONICAL_COMPANIES;
  } catch (err) {
    console.warn('[companyService] fetchCompanies error:', err);
    return CANONICAL_COMPANIES;
  }
}

/**
 * Fetch a single company by ID or Slug with joined domain data
 */
export async function fetchCompanyById(identifier) {
  if (!identifier) return null;

  if (!isSupabaseConfigured) {
    return CANONICAL_COMPANIES.find(c => c.id === identifier || c.slug === identifier) || null;
  }

  try {
    // Check if identifier is a UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

    let query = supabase
      .from('companies')
      .select(`
        id,
        name,
        slug,
        legal_name,
        description,
        logo_url,
        domain_id,
        is_active,
        created_at,
        updated_at,
        domain:domains (
          id,
          name,
          slug,
          description
        )
      `);

    if (isUuid) {
      query = query.eq('id', identifier);
    } else {
      query = query.eq('slug', identifier);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.warn('[companyService] fetchCompanyById failed:', error.message);
      return CANONICAL_COMPANIES.find(c => c.id === identifier || c.slug === identifier) || null;
    }

    return data || CANONICAL_COMPANIES.find(c => c.id === identifier || c.slug === identifier) || null;
  } catch (err) {
    console.warn('[companyService] fetchCompanyById error:', err);
    return CANONICAL_COMPANIES.find(c => c.id === identifier || c.slug === identifier) || null;
  }
}

/**
 * Fetch all active domains from public.domains
 */
export async function fetchDomains() {
  if (!isSupabaseConfigured) {
    return CANONICAL_DOMAINS;
  }

  try {
    const { data, error } = await supabase
      .from('domains')
      .select('id, name, slug, description, is_active')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (error) {
      console.warn('[companyService] fetchDomains failed, fallback to canonical domains:', error.message);
      return CANONICAL_DOMAINS;
    }

    return data && data.length > 0 ? data : CANONICAL_DOMAINS;
  } catch (err) {
    console.warn('[companyService] fetchDomains error:', err);
    return CANONICAL_DOMAINS;
  }
}

/**
 * Fetch all system roles from public.roles
 */
export async function fetchRoles() {
  if (!isSupabaseConfigured) {
    return CANONICAL_ROLES;
  }

  try {
    const { data, error } = await supabase
      .from('roles')
      .select('id, name, slug, description')
      .order('name', { ascending: true });

    if (error) {
      console.warn('[companyService] fetchRoles failed, using canonical roles:', error.message);
      return CANONICAL_ROLES;
    }

    return data && data.length > 0 ? data : CANONICAL_ROLES;
  } catch (err) {
    console.warn('[companyService] fetchRoles error:', err);
    return CANONICAL_ROLES;
  }
}

/**
 * Create a new company
 */
export async function createCompany({
  name,
  legal_name,
  domain_id,
  description,
  logo_url,
  is_active = true
}) {
  if (!name || !name.trim()) {
    throw new Error('Company name is required.');
  }

  if (!domain_id) {
    throw new Error('Please select a valid domain.');
  }

  const slug = generateSlug(name);
  if (!slug) {
    throw new Error('Failed to generate a valid slug from company name.');
  }

  if (!isSupabaseConfigured) {
    throw new Error('Database is in read-only offline mode. Configure Supabase credentials to save changes.');
  }

  // 1. Verify slug uniqueness
  const { data: existing, error: checkError } = await supabase
    .from('companies')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  if (!checkError && existing) {
    throw new Error(`A company with slug "${slug}" already exists. Please enter a distinct name.`);
  }

  // 2. Insert into public.companies
  const { data, error } = await supabase
    .from('companies')
    .insert([
      {
        name: name.trim(),
        slug,
        legal_name: legal_name?.trim() || null,
        domain_id,
        description: description?.trim() || null,
        logo_url: logo_url?.trim() || null,
        is_active: Boolean(is_active)
      }
    ])
    .select(`
      id,
      name,
      slug,
      legal_name,
      description,
      logo_url,
      domain_id,
      is_active,
      created_at,
      updated_at,
      domain:domains (
        id,
        name,
        slug
      )
    `)
    .single();

  if (error) {
    console.error('[companyService] createCompany error:', error);
    throw new Error(error.message || 'Unable to create company.');
  }

  return data;
}

/**
 * Update company metadata
 * Note: Slug is strictly preserved to maintain system identity and relational integrity.
 */
export async function updateCompany(id, {
  name,
  legal_name,
  domain_id,
  description,
  logo_url,
  is_active
}) {
  if (!id) throw new Error('Company ID is required for update.');
  if (!name || !name.trim()) throw new Error('Company name is required.');
  if (!domain_id) throw new Error('Valid domain assignment is required.');

  if (!isSupabaseConfigured) {
    throw new Error('Database is in read-only offline mode. Configure Supabase credentials to save changes.');
  }

  const updatePayload = {
    name: name.trim(),
    legal_name: legal_name?.trim() || null,
    domain_id,
    description: description?.trim() || null,
    logo_url: logo_url?.trim() || null,
    updated_at: new Date().toISOString()
  };

  if (typeof is_active === 'boolean') {
    updatePayload.is_active = is_active;
  }

  const { data, error } = await supabase
    .from('companies')
    .update(updatePayload)
    .eq('id', id)
    .select(`
      id,
      name,
      slug,
      legal_name,
      description,
      logo_url,
      domain_id,
      is_active,
      created_at,
      updated_at,
      domain:domains (
        id,
        name,
        slug
      )
    `)
    .single();

  if (error) {
    console.error('[companyService] updateCompany error:', error);
    throw new Error(error.message || 'Failed to update company.');
  }

  return data;
}

/**
 * Soft-deactivate a company (is_active = false)
 * Never hard-delete or cascade-delete business data.
 */
export async function deactivateCompany(id) {
  if (!id) throw new Error('Company ID is required.');

  if (!isSupabaseConfigured) {
    throw new Error('Database is in read-only offline mode.');
  }

  const { data, error } = await supabase
    .from('companies')
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[companyService] deactivateCompany error:', error);
    throw new Error(error.message || 'Failed to deactivate company.');
  }

  return data;
}

/**
 * Fetch all members belonging to a company from public.user_companies
 */
export async function fetchCompanyMembers(companyId) {
  if (!companyId) return [];

  if (!isSupabaseConfigured) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('user_companies')
      .select(`
        id,
        user_id,
        company_id,
        role_id,
        is_primary,
        is_active,
        created_at,
        updated_at,
        user:profiles (
          id,
          full_name,
          email,
          phone,
          avatar_url,
          is_active
        ),
        role:roles (
          id,
          name,
          slug,
          description
        ),
        company:companies (
          id,
          name,
          slug
        )
      `)
      .eq('company_id', companyId)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('[companyService] fetchCompanyMembers error:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.warn('[companyService] fetchCompanyMembers exception:', err);
    return [];
  }
}

/**
 * Fetch all active user profiles eligible for company assignment
 */
export async function fetchAvailableProfiles() {
  if (!isSupabaseConfigured) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, phone, avatar_url, is_active')
      .eq('is_active', true)
      .order('full_name', { ascending: true });

    if (error) {
      console.warn('[companyService] fetchAvailableProfiles error:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.warn('[companyService] fetchAvailableProfiles exception:', err);
    return [];
  }
}

/**
 * Assign a user to a company in public.user_companies
 * Enforces: Only ONE active primary company per user across the system.
 */
export async function assignUserToCompany({
  user_id,
  company_id,
  role_id,
  is_primary = false,
  is_active = true
}) {
  if (!user_id) throw new Error('User selection is required.');
  if (!company_id) throw new Error('Company is required.');
  if (!role_id) throw new Error('Role selection is required.');

  if (!isSupabaseConfigured) {
    throw new Error('Database is in read-only offline mode.');
  }

  // 1. If this membership is marked primary, unset is_primary on any existing companies for this user
  if (is_primary) {
    const { error: resetPrimaryErr } = await supabase
      .from('user_companies')
      .update({ is_primary: false })
      .eq('user_id', user_id);

    if (resetPrimaryErr) {
      console.warn('[companyService] Failed to reset prior primary companies:', resetPrimaryErr.message);
    }
  }

  // 2. Check if a mapping already exists between this user and this company
  const { data: existing } = await supabase
    .from('user_companies')
    .select('id')
    .eq('user_id', user_id)
    .eq('company_id', company_id)
    .maybeSingle();

  let result;
  if (existing) {
    // Update existing record
    const { data, error } = await supabase
      .from('user_companies')
      .update({
        role_id,
        is_primary: Boolean(is_primary),
        is_active: Boolean(is_active),
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id)
      .select(`
        id,
        user_id,
        company_id,
        role_id,
        is_primary,
        is_active,
        user:profiles (*),
        role:roles (*),
        company:companies (*)
      `)
      .single();

    if (error) throw new Error(error.message || 'Failed to update user-company assignment.');
    result = data;
  } else {
    // Insert new record
    const { data, error } = await supabase
      .from('user_companies')
      .insert([
        {
          user_id,
          company_id,
          role_id,
          is_primary: Boolean(is_primary),
          is_active: Boolean(is_active)
        }
      ])
      .select(`
        id,
        user_id,
        company_id,
        role_id,
        is_primary,
        is_active,
        user:profiles (*),
        role:roles (*),
        company:companies (*)
      `)
      .single();

    if (error) throw new Error(error.message || 'Failed to assign user to company.');
    result = data;
  }

  return result;
}

/**
 * Update an existing user_companies membership
 */
export async function updateCompanyMembership(membershipId, {
  user_id,
  role_id,
  is_primary,
  is_active
}) {
  if (!membershipId) throw new Error('Membership ID is required.');

  if (!isSupabaseConfigured) {
    throw new Error('Database is in read-only offline mode.');
  }

  // If setting is_primary = true, unset other primary memberships for that user
  if (is_primary && user_id) {
    await supabase
      .from('user_companies')
      .update({ is_primary: false })
      .eq('user_id', user_id)
      .neq('id', membershipId);
  }

  const updateData = {
    updated_at: new Date().toISOString()
  };

  if (role_id) updateData.role_id = role_id;
  if (typeof is_primary === 'boolean') updateData.is_primary = is_primary;
  if (typeof is_active === 'boolean') updateData.is_active = is_active;

  const { data, error } = await supabase
    .from('user_companies')
    .update(updateData)
    .eq('id', membershipId)
    .select(`
      id,
      user_id,
      company_id,
      role_id,
      is_primary,
      is_active,
      user:profiles (*),
      role:roles (*),
      company:companies (*)
    `)
    .single();

  if (error) throw new Error(error.message || 'Failed to update membership.');
  return data;
}

/**
 * Soft-remove a user from a company by setting is_active = false
 * User remains in profiles; only company access is revoked.
 */
export async function removeUserFromCompany(membershipId) {
  if (!membershipId) throw new Error('Membership ID is required.');

  if (!isSupabaseConfigured) {
    throw new Error('Database is in read-only offline mode.');
  }

  const { data, error } = await supabase
    .from('user_companies')
    .update({
      is_active: false,
      is_primary: false,
      updated_at: new Date().toISOString()
    })
    .eq('id', membershipId)
    .select()
    .single();

  if (error) {
    console.error('[companyService] removeUserFromCompany error:', error);
    throw new Error(error.message || 'Failed to deactivate company membership.');
  }

  return data;
}

/**
 * Fetch real aggregate statistics for Consolidated & Scoped Dashboards
 */
export async function fetchGroupDashboardStats() {
  if (!isSupabaseConfigured) {
    return {
      totalCompanies: CANONICAL_COMPANIES.length,
      totalDomains: CANONICAL_DOMAINS.length,
      totalPersonnel: 0,
      companyMemberCounts: {}
    };
  }

  try {
    const [compRes, domRes, ucRes] = await Promise.all([
      supabase.from('companies').select('id, is_active'),
      supabase.from('domains').select('id, is_active').eq('is_active', true),
      supabase.from('user_companies').select('id, company_id, is_active').eq('is_active', true)
    ]);

    const activeCompanies = (compRes.data || []).filter((c) => c.is_active !== false);
    const activeDomains = domRes.data || [];
    const activeMembers = ucRes.data || [];

    const memberCountMap = {};
    activeMembers.forEach((item) => {
      if (item.company_id) {
        memberCountMap[item.company_id] = (memberCountMap[item.company_id] || 0) + 1;
      }
    });

    return {
      totalCompanies: activeCompanies.length || CANONICAL_COMPANIES.length,
      totalDomains: activeDomains.length || CANONICAL_DOMAINS.length,
      totalPersonnel: activeMembers.length,
      companyMemberCounts: memberCountMap
    };
  } catch (err) {
    console.warn('[companyService] fetchGroupDashboardStats error:', err);
    return {
      totalCompanies: CANONICAL_COMPANIES.length,
      totalDomains: CANONICAL_DOMAINS.length,
      totalPersonnel: 0,
      companyMemberCounts: {}
    };
  }
}
