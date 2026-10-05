import { useState, useEffect, useCallback } from 'react';
import { getPurchaseBills } from './purchaseBillService';

export function usePurchaseBills({
  companyId = null,
  isAllCompanies = false,
  vendorId = null,
  purchaseOrderId = null,
  status = 'all',
  paymentStatus = 'all',
  dateFrom = null,
  dateTo = null,
  search = '',
  page = 1,
  pageSize = 25
} = {}) {
  const [purchaseBills, setPurchaseBills] = useState([]);
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBills = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getPurchaseBills({
        companyId,
        isAllCompanies,
        vendorId,
        purchaseOrderId,
        status,
        paymentStatus,
        dateFrom,
        dateTo,
        search,
        page,
        pageSize
      });
      setPurchaseBills(res.data);
      setCount(res.count);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('usePurchaseBills error:', err);
      setError(err.message || 'Failed to fetch purchase bills');
    } finally {
      setIsLoading(false);
    }
  }, [companyId, isAllCompanies, vendorId, purchaseOrderId, status, paymentStatus, dateFrom, dateTo, search, page, pageSize]);

  useEffect(() => {
    fetchBills();
  }, [fetchBills]);

  return {
    purchaseBills,
    count,
    totalPages,
    isLoading,
    error,
    refetch: fetchBills
  };
}
