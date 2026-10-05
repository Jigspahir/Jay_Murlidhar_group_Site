import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  getCustomers, 
  deactivateCustomer as apiDeactivateCustomer,
  reactivateCustomer as apiReactivateCustomer 
} from './customerService';

/**
 * Custom Hook: useCustomers
 * 
 * Manages customer master state, reactive multi-company scoping,
 * server filtering, pagination, and soft deactivation.
 */
export function useCustomers({ companyId, isAllCompanies }) {
  const [customers, setCustomers] = useState([]);
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const pageSize = 25;

  // Filters
  const [search, setSearch] = useState('');
  const [customerType, setCustomerType] = useState('all');
  const [status, setStatus] = useState('active');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  const fetchIdRef = useRef(0);

  // Fetch customers
  const loadCustomers = useCallback(async () => {
    const fetchId = ++fetchIdRef.current;
    setIsLoading(true);
    setError(null);

    try {
      const res = await getCustomers({
        companyId,
        isAllCompanies,
        search,
        customerType,
        status,
        city,
        state,
        page,
        pageSize
      });

      if (fetchId === fetchIdRef.current) {
        setCustomers(res.data);
        setCount(res.count);
        setTotalPages(res.totalPages);
        setIsLoading(false);
      }
    } catch (err) {
      if (fetchId === fetchIdRef.current) {
        setError(err.message || 'Failed to load customer records.');
        setIsLoading(false);
      }
    }
  }, [
    companyId,
    isAllCompanies,
    search,
    customerType,
    status,
    city,
    state,
    page,
    pageSize
  ]);

  // Reset page to 1 when filters or company scope changes
  useEffect(() => {
    setPage(1);
  }, [companyId, isAllCompanies, search, customerType, status, city, state]);

  // Trigger load
  useEffect(() => {
    loadCustomers();
  }, [loadCustomers, reloadToken]);

  const refetch = useCallback(() => {
    setReloadToken((prev) => prev + 1);
  }, []);

  const deactivateCustomer = useCallback(async (customerId) => {
    await apiDeactivateCustomer(customerId);
    refetch();
  }, [refetch]);

  const reactivateCustomer = useCallback(async (customerId) => {
    await apiReactivateCustomer(customerId);
    refetch();
  }, [refetch]);

  return {
    customers,
    count,
    page,
    pageSize,
    totalPages,
    setPage,
    filters: {
      search,
      setSearch,
      customerType,
      setCustomerType,
      status,
      setStatus,
      city,
      setCity,
      state,
      setState
    },
    isLoading,
    error,
    refetch,
    deactivateCustomer,
    reactivateCustomer
  };
}
