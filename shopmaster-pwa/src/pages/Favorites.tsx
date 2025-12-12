import React, { useEffect, useState } from 'react';
import { useGlobal } from '../context/GlobalContext';
import { Product } from '../types';
import { apiService } from '../services/apiService';
import ProductCard from '../components/ProductCard';

const Favorites = () => {
  const { favorites, user } = useGlobal();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFavs = async () => {
      setLoading(true);
      if (favorites.length === 0) {
        setFavoriteProducts([]);
        setLoading(false);
        return;
      }

      // In a real app, you'd use a bulk API endpoint.
      // For this demo with DummyJSON, we fetch individually in parallel.
      try {
        const promises = favorites.map(id => apiService.getProductById(id));
        const results = await Promise.all(promises);
        setFavoriteProducts(results);
      } catch (error) {
        console.error("Error fetching favorites details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavs();
  }, [favorites]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
      <p className="text-gray-500 mb-8">
        {user ? "Your saved items (Synced)" : "Guest Favorites (Stored Locally)"}
      </p>

      {loading ? (
        <div className="text-center py-10">Loading favorites...</div>
      ) : favoriteProducts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-xl text-gray-600">You haven't added any favorites yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favoriteProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
