import { useState, useEffect, useCallback, useRef } from 'react';
import { getPayments } from './paymentService';

/**
 * Custom Hook: usePayments
 * 
 * Manages reactive payments list, company scoping, filters, and pagination
 */
export function usePayments({ companyId, isAllCompanies, invoiceId = null }) {
  const [payments, setPayments] = useState([]);
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const pageSize = 25;

  // Filters
  const [search, setSearch] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  const fetchIdRef = useRef(0);

  const loadPayments = useCallback(async () => {
    const fetchId = ++fetchIdRef.current;
    setIsLoading(true);
    setError(null);

    try {
      const res = await getPayments({
        companyId,
        isAllCompanies,
        invoiceId,
        paymentMethod,
        dateFrom: dateFrom || null,
        dateTo: dateTo || null,
        search,
        page,
        pageSize
      });

      if (fetchId === fetchIdRef.current) {
        setPayments(res.data);
        setCount(res.count);
        setTotalPages(res.totalPages);
        setIsLoading(false);
      }
    } catch (err) {
      if (fetchId === fetchIdRef.current) {
        setError(err.message || 'Failed to load payments ledger.');
        setIsLoading(false);
      }
    }
  }, [companyId, isAllCompanies, invoiceId, paymentMethod, dateFrom, dateTo, search, page]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments, reloadToken]);

  useEffect(() => {
    setPage(1);
  }, [companyId, isAllCompanies, invoiceId, paymentMethod, dateFrom, dateTo, search]);

  const refresh = () => setReloadToken((t) => t + 1);

  return {
    payments,
    count,
    totalPages,
    page,
    setPage,
    pageSize,
    search,
    setSearch,
    paymentMethod,
    setPaymentMethod,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    isLoading,
    error,
    refresh
  };
}
