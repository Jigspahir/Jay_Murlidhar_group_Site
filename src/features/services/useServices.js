import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  getServices, 
  deactivateService as apiDeactivateService,
  reactivateService as apiReactivateService 
} from './serviceService';

/**
 * Custom Hook: useServices
 * 
 * Manages service master state, reactive multi-company scoping,
 * server filtering, pagination, and soft deactivation.
 */
export function useServices({ companyId, isAllCompanies }) {
  const [services, setServices] = useState([]);
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const pageSize = 25;

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [billingType, setBillingType] = useState('all');
  const [status, setStatus] = useState('active');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  const fetchIdRef = useRef(0);

  // Fetch services
  const loadServices = useCallback(async () => {
    const fetchId = ++fetchIdRef.current;
    setIsLoading(true);
    setError(null);

    try {
      const res = await getServices({
        companyId,
        isAllCompanies,
        search,
        category,
        billingType,
        status,
        page,
        pageSize
      });

      if (fetchId === fetchIdRef.current) {
        setServices(res.data);
        setCount(res.count);
        setTotalPages(res.totalPages);
        setIsLoading(false);
      }
    } catch (err) {
      if (fetchId === fetchIdRef.current) {
        setError(err.message || 'Failed to load service records.');
        setIsLoading(false);
      }
    }
  }, [
    companyId,
    isAllCompanies,
    search,
    category,
    billingType,
    status,
    page,
    pageSize
  ]);

  // Reset page to 1 when filters or company scope changes
  useEffect(() => {
    setPage(1);
  }, [companyId, isAllCompanies, search, category, billingType, status]);

  // Trigger load
  useEffect(() => {
    loadServices();
  }, [loadServices, reloadToken]);

  const refetch = useCallback(() => {
    setReloadToken((prev) => prev + 1);
  }, []);

  const deactivateService = useCallback(async (serviceId) => {
    await apiDeactivateService(serviceId);
    refetch();
  }, [refetch]);

  const reactivateService = useCallback(async (serviceId) => {
    await apiReactivateService(serviceId);
    refetch();
  }, [refetch]);

  return {
    services,
    count,
    totalPages,
    page,
    setPage,
    pageSize,
    search,
    setSearch,
    category,
    setCategory,
    billingType,
    setBillingType,
    status,
    setStatus,
    isLoading,
    error,
    refetch,
    deactivateService,
    reactivateService
  };
}
