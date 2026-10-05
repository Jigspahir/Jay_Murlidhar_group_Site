import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  getEnquiries, 
  getEnquiryPipelineCounts,
  updateEnquiryStatus as apiUpdateEnquiryStatus,
  convertEnquiryToCustomer as apiConvertEnquiryToCustomer 
} from './enquiryService';

/**
 * Custom Hook: useEnquiries
 * 
 * Manages enquiry CRM state, reactive multi-company scoping,
 * server filtering, pipeline metrics, and status progression.
 */
export function useEnquiries({ companyId, isAllCompanies }) {
  const [enquiries, setEnquiries] = useState([]);
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const pageSize = 25;

  // Pipeline Metrics
  const [pipelineCounts, setPipelineCounts] = useState({
    new: 0,
    contacted: 0,
    in_progress: 0,
    follow_up: 0,
    converted: 0,
    closed: 0,
    lost: 0,
    total: 0
  });

  // Filters
  const [search, setSearch] = useState('');
  const [serviceId, setServiceId] = useState('all');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [source, setSource] = useState('all');
  const [assignedEmployeeId, setAssignedEmployeeId] = useState('all');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  const fetchIdRef = useRef(0);

  // Fetch enquiries and pipeline metrics
  const loadEnquiries = useCallback(async () => {
    const fetchId = ++fetchIdRef.current;
    setIsLoading(true);
    setError(null);

    try {
      const [listRes, metricsRes] = await Promise.all([
        getEnquiries({
          companyId,
          isAllCompanies,
          search,
          serviceId,
          status,
          priority,
          source,
          assignedEmployeeId,
          page,
          pageSize
        }),
        getEnquiryPipelineCounts({
          companyId,
          isAllCompanies
        })
      ]);

      if (fetchId === fetchIdRef.current) {
        setEnquiries(listRes.data);
        setCount(listRes.count);
        setTotalPages(listRes.totalPages);
        setPipelineCounts(metricsRes);
        setIsLoading(false);
      }
    } catch (err) {
      if (fetchId === fetchIdRef.current) {
        setError(err.message || 'Failed to load enquiry records.');
        setIsLoading(false);
      }
    }
  }, [
    companyId,
    isAllCompanies,
    search,
    serviceId,
    status,
    priority,
    source,
    assignedEmployeeId,
    page,
    pageSize
  ]);

  // Reset page to 1 when filters or company scope changes
  useEffect(() => {
    setPage(1);
  }, [companyId, isAllCompanies, search, serviceId, status, priority, source, assignedEmployeeId]);

  // Trigger load
  useEffect(() => {
    loadEnquiries();
  }, [loadEnquiries, reloadToken]);

  const refetch = useCallback(() => {
    setReloadToken((prev) => prev + 1);
  }, []);

  const updateStatus = useCallback(async (enquiryId, newStatus) => {
    await apiUpdateEnquiryStatus(enquiryId, newStatus);
    refetch();
  }, [refetch]);

  const convertToCustomer = useCallback(async ({ enquiryId, customerData }) => {
    const res = await apiConvertEnquiryToCustomer({ enquiryId, customerData });
    refetch();
    return res;
  }, [refetch]);

  return {
    enquiries,
    count,
    totalPages,
    page,
    setPage,
    pageSize,
    pipelineCounts,
    search,
    setSearch,
    serviceId,
    setServiceId,
    status,
    setStatus,
    priority,
    setPriority,
    source,
    setSource,
    assignedEmployeeId,
    setAssignedEmployeeId,
    isLoading,
    error,
    refetch,
    updateStatus,
    convertToCustomer
  };
}
