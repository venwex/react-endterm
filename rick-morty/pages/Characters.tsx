import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import { Character, CharacterResponse } from '../types';
import { CharacterCard } from '../components/CharacterCard';
import { useDebounce } from '../hooks/useDebounce';
import { useSearchParams } from 'react-router-dom';

const Characters: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<CharacterResponse | null>(null);
  const [loading, setLoading] = useState(false);

  // State initialization from URL or defaults
  const initialPage = parseInt(searchParams.get('page') || '1');
  const initialSearch = searchParams.get('search') || '';
  const initialStatus = searchParams.get('status') || 'all';

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [page, setPage] = useState(initialPage);

  const debouncedSearch = useDebounce(searchTerm, 500);

  // Effect to sync state with URL and Fetch
  useEffect(() => {
    // Update URL params
    const params: any = {};
    if (page > 1) params.page = page.toString();
    if (debouncedSearch) params.search = debouncedSearch;
    if (statusFilter !== 'all') params.status = statusFilter;
    setSearchParams(params);

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await apiService.getCharacters(page, debouncedSearch, statusFilter);
        setData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, debouncedSearch, statusFilter, setSearchParams]);

  // Reset page on search/filter change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (data?.info.pages || 1)) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div>
      <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search characters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow bg-gray-900 text-white border border-gray-600 rounded px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-900 text-white border border-gray-600 rounded px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="alive">Alive</option>
            <option value="dead">Dead</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
           <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data?.results.map((char) => (
              <CharacterCard key={char.id} character={char} />
            ))}
            {data?.results.length === 0 && (
              <p className="text-gray-400 col-span-full text-center py-10">No characters found in this dimension.</p>
            )}
          </div>

          {data && data.info.pages > 1 && (
            <div className="flex justify-center items-center mt-10 space-x-4">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 hover:bg-gray-600"
              >
                Previous
              </button>
              <span className="text-gray-300">Page {page} of {data.info.pages}</span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === data.info.pages}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50 hover:bg-gray-600"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Characters;
