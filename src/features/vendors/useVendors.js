import { useState, useEffect, useCallback } from 'react';
import { getVendors } from './vendorService';

export function useVendors({
  companyId = null,
  isAllCompanies = false,
  vendorType = 'all',
  status = 'all',
  search = '',
  page = 1,
  pageSize = 25
} = {}) {
  const [vendors, setVendors] = useState([]);
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVendors = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getVendors({
        companyId,
        isAllCompanies,
        vendorType,
        status,
        search,
        page,
        pageSize
      });
      setVendors(res.data);
      setCount(res.count);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('useVendors hook error:', err);
      setError(err.message || 'Failed to fetch vendors');
    } finally {
      setIsLoading(false);
    }
  }, [companyId, isAllCompanies, vendorType, status, search, page, pageSize]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  return {
    vendors,
    count,
    totalPages,
    isLoading,
    error,
    refetch: fetchVendors
  };
}
