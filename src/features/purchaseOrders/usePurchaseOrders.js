import { useState, useEffect, useCallback } from 'react';
import { getPurchaseOrders } from './purchaseOrderService';

export function usePurchaseOrders({
  companyId = null,
  isAllCompanies = false,
  vendorId = null,
  status = 'all',
  approvalStatus = 'all',
  dateFrom = null,
  dateTo = null,
  search = '',
  page = 1,
  pageSize = 25
} = {}) {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPOs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getPurchaseOrders({
        companyId,
        isAllCompanies,
        vendorId,
        status,
        approvalStatus,
        dateFrom,
        dateTo,
        search,
        page,
        pageSize
      });
      setPurchaseOrders(res.data);
      setCount(res.count);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('usePurchaseOrders hook error:', err);
      setError(err.message || 'Failed to fetch purchase orders');
    } finally {
      setIsLoading(false);
    }
  }, [companyId, isAllCompanies, vendorId, status, approvalStatus, dateFrom, dateTo, search, page, pageSize]);

  useEffect(() => {
    fetchPOs();
  }, [fetchPOs]);

  return {
    purchaseOrders,
    count,
    totalPages,
    isLoading,
    error,
    refetch: fetchPOs
  };
}
