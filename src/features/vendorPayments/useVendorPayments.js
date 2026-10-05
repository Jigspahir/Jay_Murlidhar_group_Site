import { useState, useEffect, useCallback } from 'react';
import { getVendorPayments } from './vendorPaymentService';

export function useVendorPayments({
  companyId = null,
  isAllCompanies = false,
  vendorId = null,
  billId = null,
  paymentMethod = 'all',
  dateFrom = null,
  dateTo = null,
  search = '',
  page = 1,
  pageSize = 25
} = {}) {
  const [vendorPayments, setVendorPayments] = useState([]);
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getVendorPayments({
        companyId,
        isAllCompanies,
        vendorId,
        billId,
        paymentMethod,
        dateFrom,
        dateTo,
        search,
        page,
        pageSize
      });
      setVendorPayments(res.data);
      setCount(res.count);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('useVendorPayments hook error:', err);
      setError(err.message || 'Failed to fetch vendor payments');
    } finally {
      setIsLoading(false);
    }
  }, [companyId, isAllCompanies, vendorId, billId, paymentMethod, dateFrom, dateTo, search, page, pageSize]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return {
    vendorPayments,
    count,
    totalPages,
    isLoading,
    error,
    refetch: fetchPayments
  };
}
