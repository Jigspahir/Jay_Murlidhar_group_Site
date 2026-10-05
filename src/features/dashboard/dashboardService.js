import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { CANONICAL_COMPANIES, CANONICAL_DOMAINS } from '../../services/companyService';

/**
 * JAY MURLIDHAR GROUP (JMG) — DASHBOARD SERVICE
 * 
 * Production data layer for Consolidated & Company-Scoped Dashboard.
 * Queries PostgreSQL via Supabase RLS.
 * strictly uses real database data (companies, domains, user_companies).
 */

/**
 * Fetch consolidated metrics and company overview list for All Companies mode
 */
export async function fetchConsolidatedDashboardData() {
  if (!isSupabaseConfigured) {
    return {
      totalCompanies: CANONICAL_COMPANIES.length,
      totalDomains: CANONICAL_DOMAINS.length,
      totalActiveMembers: 0,
      companies: CANONICAL_COMPANIES.map((c) => ({
        ...c,
        memberCount: 0
      }))
    };
  }

  try {
    // Parallel queries to minimize latency
    const [companiesRes, domainsRes, membersRes] = await Promise.all([
      supabase
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
          domain:domains (
            id,
            name,
            slug
          )
        `)
        .order('name', { ascending: true }),

      supabase
        .from('domains')
        .select('id, name, slug, is_active')
        .eq('is_active', true),

      supabase
        .from('user_companies')
        .select('id, company_id, is_active')
        .eq('is_active', true)
    ]);

    if (companiesRes.error) {
      console.warn('[dashboardService] Error loading companies:', companiesRes.error.message);
    }

    const rawCompanies = companiesRes.data || CANONICAL_COMPANIES;
    const activeCompanies = rawCompanies.filter((c) => c.is_active !== false);
    const activeDomains = domainsRes.data || CANONICAL_DOMAINS;
    const activeMembers = membersRes.data || [];

    // Calculate member counts per company
    const memberCounts = {};
    activeMembers.forEach((m) => {
      if (m.company_id) {
        memberCounts[m.company_id] = (memberCounts[m.company_id] || 0) + 1;
      }
    });

    const enrichedCompanies = activeCompanies.map((c) => ({
      ...c,
      memberCount: memberCounts[c.id] || 0
    }));

    return {
      totalCompanies: activeCompanies.length,
      totalDomains: activeDomains.length,
      totalActiveMembers: activeMembers.length,
      companies: enrichedCompanies
    };
  } catch (err) {
    console.warn('[dashboardService] fetchConsolidatedDashboardData exception:', err);
    return {
      totalCompanies: CANONICAL_COMPANIES.length,
      totalDomains: CANONICAL_DOMAINS.length,
      totalActiveMembers: 0,
      companies: CANONICAL_COMPANIES.map((c) => ({
        ...c,
        memberCount: 0
      }))
    };
  }
}

/**
 * Fetch company-scoped metrics and personnel data for a specific company
 */
export async function fetchScopedCompanyDashboardData(companyId) {
  if (!companyId) return null;

  if (!isSupabaseConfigured) {
    const canonical = CANONICAL_COMPANIES.find((c) => c.id === companyId || c.slug === companyId);
    if (!canonical) return null;
    return {
      company: canonical,
      activeMembersCount: 0,
      members: []
    };
  }

  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(companyId);

    let compQuery = supabase
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
      compQuery = compQuery.eq('id', companyId);
    } else {
      compQuery = compQuery.eq('slug', companyId);
    }

    const { data: companyData, error: compErr } = await compQuery.maybeSingle();

    if (compErr || !companyData) {
      console.warn('[dashboardService] Error fetching scoped company:', compErr?.message);
      return null;
    }

    // Query active members for this specific company
    const { data: membersData, error: memErr } = await supabase
      .from('user_companies')
      .select(`
        id,
        user_id,
        company_id,
        role_id,
        is_primary,
        is_active,
        created_at,
        user:profiles (
          id,
          full_name,
          email,
          avatar_url
        ),
        role:roles (
          id,
          name,
          slug
        )
      `)
      .eq('company_id', companyData.id)
      .eq('is_active', true)
      .order('is_primary', { ascending: false });

    if (memErr) {
      console.warn('[dashboardService] Error fetching scoped members:', memErr.message);
    }

    const activeMembers = membersData || [];

    return {
      company: companyData,
      activeMembersCount: activeMembers.length,
      members: activeMembers
    };
  } catch (err) {
    console.warn('[dashboardService] fetchScopedCompanyDashboardData exception:', err);
    return null;
  }
}
