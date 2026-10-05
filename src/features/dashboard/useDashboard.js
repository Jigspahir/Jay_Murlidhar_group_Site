import { useState, useEffect, useCallback } from 'react';
import { 
  fetchConsolidatedDashboardData, 
  fetchScopedCompanyDashboardData 
} from './dashboardService';

/**
 * Custom React Hook: useDashboard
 * 
 * Manages dashboard state, automated reactive fetching upon company context changes,
 * loading skeletons, and sanitized enterprise error handling.
 */
export function useDashboard({ currentCompanyId, isAllCompanies }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [consolidatedData, setConsolidatedData] = useState({
    totalCompanies: 0,
    totalDomains: 0,
    totalActiveMembers: 0,
    companies: []
  });
  const [scopedData, setScopedData] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const refetch = useCallback(() => {
    setReloadTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    async function executeFetch() {
      setIsLoading(true);
      setError(null);

      try {
        if (isAllCompanies) {
          const data = await fetchConsolidatedDashboardData();
          if (!isCancelled) {
            setConsolidatedData(data);
            setScopedData(null);
            setIsLoading(false);
          }
        } else if (currentCompanyId) {
          const data = await fetchScopedCompanyDashboardData(currentCompanyId);
          if (!isCancelled) {
            if (!data) {
              setError('The selected company profile could not be loaded.');
            } else {
              setScopedData(data);
            }
            setIsLoading(false);
          }
        } else {
          if (!isCancelled) {
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.warn('[useDashboard] Data fetch failed:', err);
        if (!isCancelled) {
          setError('Unable to load dashboard metrics. Please check your network connection.');
          setIsLoading(false);
        }
      }
    }

    executeFetch();

    return () => {
      isCancelled = true;
    };
  }, [isAllCompanies, currentCompanyId, reloadTrigger]);

  return {
    isLoading,
    error,
    consolidatedData,
    scopedData,
    refetch
  };
}
