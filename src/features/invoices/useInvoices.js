import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getInvoices,
  issueInvoice as apiIssueInvoice,
  cancelInvoice as apiCancelInvoice,
  deleteInvoice as apiDeleteInvoice
} from './invoiceService';

/**
 * Custom Hook: useInvoices
 * 
 * Manages invoice listing, filtering, pagination, and status transitions
 */
export function useInvoices({ companyId, isAllCompanies }) {
  const [invoices, setInvoices] = useState([]);
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const pageSize = 25;

  // Filters
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [customerId, setCustomerId] = useState(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  const fetchIdRef = useRef(0);

  const loadInvoices = useCallback(async () => {
    const fetchId = ++fetchIdRef.current;
    setIsLoading(true);
    setError(null);

    try {
      const res = await getInvoices({
        companyId,
        isAllCompanies,
        search,
        status,
        customerId,
        dateFrom: dateFrom || null,
        dateTo: dateTo || null,
        page,
        pageSize
      });

      if (fetchId === fetchIdRef.current) {
        setInvoices(res.data);
        setCount(res.count);
        setTotalPages(res.totalPages);
        setIsLoading(false);
      }
    } catch (err) {
      if (fetchId === fetchIdRef.current) {
        setError(err.message || 'Failed to load invoices.');
        setIsLoading(false);
      }
    }
  }, [companyId, isAllCompanies, search, status, customerId, dateFrom, dateTo, page]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices, reloadToken]);

  // Reset to page 1 when company or filters change
  useEffect(() => {
    setPage(1);
  }, [companyId, isAllCompanies, search, status, customerId, dateFrom, dateTo]);

  const refresh = () => setReloadToken((t) => t + 1);

  const issueInvoice = async (id) => {
    await apiIssueInvoice(id);
    refresh();
  };

  const cancelInvoice = async (id, reason) => {
    await apiCancelInvoice(id, reason);
    refresh();
  };

  const deleteInvoice = async (id) => {
    await apiDeleteInvoice(id);
    refresh();
  };

  return {
    invoices,
    count,
    totalPages,
    page,
    setPage,
    pageSize,
    search,
    setSearch,
    status,
    setStatus,
    customerId,
    setCustomerId,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    isLoading,
    error,
    refresh,
    issueInvoice,
    cancelInvoice,
    deleteInvoice
  };
}
