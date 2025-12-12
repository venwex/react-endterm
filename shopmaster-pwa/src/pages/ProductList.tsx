import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { useDebounce } from '../hooks/useDebounce';

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();

  // url state sync
  const queryParam = searchParams.get('q') || '';
  const pageParam = parseInt(searchParams.get('page') || '1');
  const limitParam = parseInt(searchParams.get('limit') || '20');

  const [searchTerm, setSearchTerm] = useState(queryParam);
  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    // update url when search input changes (debounced)
    const newParams: any = { page: '1', limit: limitParam.toString() };
    if (debouncedSearch) newParams.q = debouncedSearch;
    setSearchParams(newParams);
  }, [debouncedSearch]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const skip = (pageParam - 1) * limitParam;
        let data;

        if (queryParam) {
          data = await apiService.searchProducts(queryParam, limitParam, skip);
        } else {
          data = await apiService.getAllProducts(limitParam, skip);
        }

        setProducts(data.products);
        setTotal(data.total);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [queryParam, pageParam, limitParam]);

  const handlePageChange = (newPage: number) => {
    setSearchParams({
      q: queryParam,
      page: newPage.toString(),
      limit: limitParam.toString()
    });
    window.scrollTo(0, 0);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchParams({
      q: queryParam,
      page: '1',
      limit: e.target.value
    });
  };

  const totalPages = Math.ceil(total / limitParam);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Items per page:</label>
          <select
            value={limitParam}
            onChange={handleLimitChange}
            className="border border-gray-300 rounded-md p-1"
          >
            {PAGE_SIZE_OPTIONS.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">No products found.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => handlePageChange(pageParam - 1)}
              disabled={pageParam === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 flex items-center">
              Page {pageParam} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pageParam + 1)}
              disabled={pageParam >= totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;
