import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  getEmployees, 
  deactivateEmployee as apiDeactivateEmployee,
  reactivateEmployee as apiReactivateEmployee 
} from './employeeService';

/**
 * Custom Hook: useEmployees
 * 
 * Manages employee master state, reactive multi-company scoping,
 * server filtering, pagination, and soft deactivation.
 */
export function useEmployees({ companyId, isAllCompanies }) {
  const [employees, setEmployees] = useState([]);
  const [count, setCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const pageSize = 25;

  // Filters
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [designation, setDesignation] = useState('all');
  const [employmentType, setEmploymentType] = useState('all');
  const [status, setStatus] = useState('active');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadToken, setReloadToken] = useState(0);

  const fetchIdRef = useRef(0);

  // Fetch employees
  const loadEmployees = useCallback(async () => {
    const fetchId = ++fetchIdRef.current;
    setIsLoading(true);
    setError(null);

    try {
      const res = await getEmployees({
        companyId,
        isAllCompanies,
        search,
        department,
        designation,
        employmentType,
        status,
        page,
        pageSize
      });

      if (fetchId === fetchIdRef.current) {
        setEmployees(res.data);
        setCount(res.count);
        setTotalPages(res.totalPages);
        setIsLoading(false);
      }
    } catch (err) {
      if (fetchId === fetchIdRef.current) {
        setError(err.message || 'Failed to load employee records.');
        setIsLoading(false);
      }
    }
  }, [
    companyId,
    isAllCompanies,
    search,
    department,
    designation,
    employmentType,
    status,
    page,
    pageSize
  ]);

  // Reset page to 1 when filters or company scope changes
  useEffect(() => {
    setPage(1);
  }, [companyId, isAllCompanies, search, department, designation, employmentType, status]);

  // Trigger load
  useEffect(() => {
    loadEmployees();
  }, [loadEmployees, reloadToken]);

  const refetch = useCallback(() => {
    setReloadToken((prev) => prev + 1);
  }, []);

  const deactivateEmployee = useCallback(async (employeeId) => {
    await apiDeactivateEmployee(employeeId);
    refetch();
  }, [refetch]);

  const reactivateEmployee = useCallback(async (employeeId) => {
    await apiReactivateEmployee(employeeId);
    refetch();
  }, [refetch]);

  return {
    employees,
    count,
    page,
    pageSize,
    totalPages,
    setPage,
    filters: {
      search,
      setSearch,
      department,
      setDepartment,
      designation,
      setDesignation,
      employmentType,
      setEmploymentType,
      status,
      setStatus
    },
    isLoading,
    error,
    refetch,
    deactivateEmployee,
    reactivateEmployee
  };
}
