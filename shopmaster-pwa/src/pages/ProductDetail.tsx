import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../services/apiService';
import { Product } from '../types';
import { useGlobal } from '../context/GlobalContext';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState('');
  const { toggleFavorite, favorites } = useGlobal();

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const data = await apiService.getProductById(parseInt(id));
        setProduct(data);
        setSelectedImage(data.images[0]);
      } catch (error) {
        console.error("Error fetching product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center py-20">Loading details...</div>;
  if (!product) return <div className="text-center py-20">Product not found.</div>;

  const isFav = favorites.includes(product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/products" className="text-indigo-600 mb-6 inline-block hover:underline">← Back to Products</Link>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Image Gallery */}
          <div className="md:w-1/2 p-8 bg-gray-50">
            <div className="aspect-w-1 aspect-h-1 bg-white rounded-lg mb-4 flex items-center justify-center overflow-hidden h-96">
              <img src={selectedImage} alt={product.title} className="object-contain max-h-full" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 flex-shrink-0 border-2 rounded-md p-1 ${selectedImage === img ? 'border-indigo-600' : 'border-gray-200'}`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          <div className="md:w-1/2 p-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-sm text-indigo-600 font-bold uppercase tracking-wide">{product.brand} - {product.category}</h2>
                <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.title}</h1>
              </div>
              <button
                onClick={() => toggleFavorite(product.id)}
                className={`p-3 rounded-full ${isFav ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}
              >
                {isFav ? '❤️' : '🤍'}
              </button>
            </div>

            <div className="mt-4 flex items-center">
              <span className="text-3xl font-bold text-gray-900">${product.price}</span>
              <span className="ml-3 text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                {product.discountPercentage}% OFF
              </span>
            </div>

            <div className="mt-2 flex items-center">
              <span className="text-yellow-400 text-lg">★</span>
              <span className="ml-1 font-bold">{product.rating}</span>
              <span className="ml-4 text-gray-500 text-sm">Stock: {product.stock} available</span>
            </div>

            <p className="mt-6 text-gray-600 leading-relaxed text-lg">
              {product.description}
            </p>

            <div className="mt-8 pt-8 border-t border-gray-200 grid grid-cols-2 gap-4">
              <div>
                <span className="block text-sm text-gray-500">Brand</span>
                <span className="font-medium">{product.brand}</span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">SKU</span>
                <span className="font-medium">PROD-{product.id}</span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Category</span>
                <span className="font-medium capitalize">{product.category}</span>
              </div>
              <div>
                <span className="block text-sm text-gray-500">Delivery</span>
                <span className="font-medium">Free Shipping</span>
              </div>
            </div>

            <button className="mt-8 w-full bg-indigo-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-indigo-700 transition shadow-lg">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
