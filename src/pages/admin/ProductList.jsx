import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';
import {
  getProducts,
  getProductCategories,
  ProductTable,
  ProductFilters
} from '../../features/inventory';
import { Package, Plus, RefreshCw, Layers } from 'lucide-react';

export default function ProductList() {
  const { currentCompanyId, isAllCompanies } = useCompany();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const targetCompanyId = isAllCompanies ? null : currentCompanyId;

      const [prodsRes, catsRes] = await Promise.all([
        getProducts({
          companyId: targetCompanyId,
          isAllCompanies,
          categoryId: categoryFilter,
          status: statusFilter,
          search: searchTerm,
          page,
          pageSize: 20
        }),
        getProductCategories(targetCompanyId)
      ]);

      setProducts(prodsRes.data || []);
      setTotalPages(prodsRes.totalPages || 1);
      setTotalCount(prodsRes.count || 0);
      setCategories(catsRes.data || []);
    } catch (err) {
      console.error('Error loading products list:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentCompanyId, isAllCompanies, categoryFilter, statusFilter, searchTerm, page]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleReset = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-7 h-7 text-blue-600" />
            Product Master
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Physical merchandise, hardware SKUs, brand catalogs, pricing tiers, and serial tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Filter Strip */}
      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={(v) => {
          setSearchTerm(v);
          setPage(1);
        }}
        statusFilter={statusFilter}
        onStatusChange={(v) => {
          setStatusFilter(v);
          setPage(1);
        }}
        categoryFilter={categoryFilter}
        onCategoryChange={(v) => {
          setCategoryFilter(v);
          setPage(1);
        }}
        categories={categories}
        onReset={handleReset}
      />

      {/* Table */}
      <ProductTable
        products={products}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setPage}
      />
    </div>
  );
}
