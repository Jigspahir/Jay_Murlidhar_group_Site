import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';

export const ALL_COMPANIES_ID = 'ALL';
export const STORAGE_KEY = 'jmg_current_company_id';

export const CompanyContext = createContext({
  currentCompany: null,
  currentCompanyId: null,
  availableCompanies: [],
  isAllCompanies: false,
  isLoading: true,
  switchCompany: () => {},
  refreshCompanies: async () => {}
});

export function CompanyProvider({ children }) {
  const { user, roles, userCompanies, isLoading: authLoading, refreshProfile } = useAuth();

  const isGroupOwner = useMemo(() => {
    return Array.isArray(roles) && roles.includes('group_owner');
  }, [roles]);

  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const previousUserIdRef = useRef(user?.id);

  // 1. Available Companies: derived strictly from authenticated user's active memberships
  // and where the company itself is active
  const availableCompanies = useMemo(() => {
    if (!user || !Array.isArray(userCompanies)) {
      return [];
    }

    const validMemberships = userCompanies.filter((uc) => {
      return uc.is_active === true && uc.company && uc.company.is_active !== false;
    });

    // Deduplicate companies by ID and attach membership context
    const seen = new Set();
    const companies = [];

    for (const uc of validMemberships) {
      if (!seen.has(uc.company_id)) {
        seen.add(uc.company_id);
        companies.push({
          ...uc.company,
          role: uc.role,
          is_primary: Boolean(uc.is_primary),
          membership_id: uc.id
        });
      }
    }

    return companies;
  }, [user, userCompanies]);

  // 2. Active Primary Company (if any)
  const primaryCompany = useMemo(() => {
    return availableCompanies.find((c) => c.is_primary) || null;
  }, [availableCompanies]);

  // 3. Handle user switch or logout: clear state immediately
  useEffect(() => {
    if (previousUserIdRef.current !== user?.id) {
      previousUserIdRef.current = user?.id;
      if (!user) {
        setSelectedCompanyId(null);
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch (e) {
          console.warn('[CompanyContext] Failed to clear localStorage on logout', e);
        }
      }
    }
  }, [user]);

  // 4. Resolve and validate active company on initial load, membership updates, or reload
  useEffect(() => {
    if (authLoading) return;

    if (!user || availableCompanies.length === 0) {
      setSelectedCompanyId(null);
      return;
    }

    // Read stored company preference from localStorage
    let storedId = null;
    try {
      storedId = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      console.warn('[CompanyContext] Failed to read localStorage', e);
    }

    // Case A: User previously selected 'ALL' (Consolidated)
    if (storedId === ALL_COMPANIES_ID) {
      if (isGroupOwner) {
        setSelectedCompanyId(ALL_COMPANIES_ID);
        return;
      }
      // If not authorized for ALL, ignore stored value
      storedId = null;
    }

    // Case B: Stored company ID matches an active, authorized company
    if (storedId && availableCompanies.some((c) => c.id === storedId || c.slug === storedId)) {
      const matched = availableCompanies.find((c) => c.id === storedId || c.slug === storedId);
      setSelectedCompanyId(matched.id);
      return;
    }

    // Case C: Fall back to primary company if defined
    if (primaryCompany) {
      setSelectedCompanyId(primaryCompany.id);
      try {
        localStorage.setItem(STORAGE_KEY, primaryCompany.id);
      } catch (e) {
        console.warn('[CompanyContext] Failed to persist primary company', e);
      }
      return;
    }

    // Case D: Fall back to first active company membership
    if (availableCompanies.length > 0) {
      const firstCompany = availableCompanies[0];
      setSelectedCompanyId(firstCompany.id);
      try {
        localStorage.setItem(STORAGE_KEY, firstCompany.id);
      } catch (e) {
        console.warn('[CompanyContext] Failed to persist fallback company', e);
      }
      return;
    }

    // Case E: 0 active companies
    setSelectedCompanyId(null);
  }, [authLoading, user, isGroupOwner, availableCompanies, primaryCompany]);

  // 5. Switch Company with strict authorization check
  const switchCompany = useCallback((companyId) => {
    if (!companyId) return;

    // Check authorization for ALL COMPANIES mode
    if (companyId === ALL_COMPANIES_ID) {
      if (!isGroupOwner) {
        console.warn('[CompanyContext] Access denied: Only group_owner can access All Companies mode.');
        return;
      }
      setSelectedCompanyId(ALL_COMPANIES_ID);
      try {
        localStorage.setItem(STORAGE_KEY, ALL_COMPANIES_ID);
      } catch (e) {
        console.warn('[CompanyContext] Failed to save preference to localStorage', e);
      }
      return;
    }

    // Verify company is an active, assigned membership for this user
    const target = availableCompanies.find((c) => c.id === companyId || c.slug === companyId);
    if (!target) {
      console.warn(`[CompanyContext] Access denied: Company "${companyId}" is not among active authorized memberships.`);
      return;
    }

    setSelectedCompanyId(target.id);
    try {
      localStorage.setItem(STORAGE_KEY, target.id);
    } catch (e) {
      console.warn('[CompanyContext] Failed to save preference to localStorage', e);
    }
  }, [isGroupOwner, availableCompanies]);

  // 6. Refresh company memberships
  const refreshCompanies = useCallback(async () => {
    if (typeof refreshProfile === 'function') {
      await refreshProfile();
    }
  }, [refreshProfile]);

  const isAllCompanies = selectedCompanyId === ALL_COMPANIES_ID;

  // Resolve currentCompany object
  const currentCompany = useMemo(() => {
    if (isAllCompanies) {
      return {
        id: ALL_COMPANIES_ID,
        name: 'All Companies',
        slug: 'all-companies',
        is_all: true
      };
    }

    if (!selectedCompanyId) {
      return null;
    }

    return availableCompanies.find(
      (c) => c.id === selectedCompanyId || c.slug === selectedCompanyId
    ) || null;
  }, [isAllCompanies, selectedCompanyId, availableCompanies]);

  const value = {
    currentCompany,
    currentCompanyId: selectedCompanyId,
    availableCompanies,
    isAllCompanies,
    isSuperAdmin: isGroupOwner,
    isLoading: authLoading,
    switchCompany,
    refreshCompanies
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
}
