import { useState, useEffect, useCallback, useRef } from 'react';
import { getExpenses, cancelExpense as apiCancelExpense } from './expenseService';

/**
 * Custom Hook: useExpenses
 * 
 * Manages reactive expense listing, category filters, date scoping, and pagination
 */
export function useExpenses({ companyId, isAllCompanies }) {
  const [expenses, setExpenses] = useState([]);
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const pageSize = 25;

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [paymentMethod, setPaymentMethod] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  const fetchIdRef = useRef(0);

  const loadExpenses = useCallback(async () => {
    const fetchId = ++fetchIdRef.current;
    setIsLoading(true);
    setError(null);

    try {
      const res = await getExpenses({
        companyId,
        isAllCompanies,
        category,
        status,
        paymentMethod,
        dateFrom: dateFrom || null,
        dateTo: dateTo || null,
        search,
        page,
        pageSize
      });

      if (fetchId === fetchIdRef.current) {
        setExpenses(res.data);
        setCount(res.count);
        setTotalPages(res.totalPages);
        setIsLoading(false);
      }
    } catch (err) {
      if (fetchId === fetchIdRef.current) {
        setError(err.message || 'Failed to load expense records.');
        setIsLoading(false);
      }
    }
  }, [companyId, isAllCompanies, category, status, paymentMethod, dateFrom, dateTo, search, page]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses, reloadToken]);

  useEffect(() => {
    setPage(1);
  }, [companyId, isAllCompanies, category, status, paymentMethod, dateFrom, dateTo, search]);

  const refresh = () => setReloadToken((t) => t + 1);

  const cancelExpense = async (id) => {
    await apiCancelExpense(id);
    refresh();
  };

  return {
    expenses,
    count,
    totalPages,
    page,
    setPage,
    pageSize,
    search,
    setSearch,
    category,
    setCategory,
    status,
    setStatus,
    paymentMethod,
    setPaymentMethod,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    isLoading,
    error,
    refresh,
    cancelExpense
  };
}
