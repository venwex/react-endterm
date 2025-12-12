import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useGlobal } from '../context/GlobalContext';

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const { favorites, toggleFavorite } = useGlobal();
  const isFav = favorites.includes(product.id);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <div className="relative pt-[75%] bg-gray-100">
        <img 
          src={product.thumbnail} 
          alt={product.title} 
          className="absolute top-0 left-0 w-full h-full object-contain p-4"
          loading="lazy"
        />
        <button 
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product.id);
          }}
          className={`absolute top-2 right-2 p-2 rounded-full shadow-md ${isFav ? 'bg-red-100 text-red-600' : 'bg-white text-gray-400'}`}
        >
          {isFav ? '❤️' : '🤍'}
        </button>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="text-xs text-indigo-600 font-semibold mb-1 uppercase tracking-wide">{product.category}</div>
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{product.title}</h3>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900">${product.price}</span>
            <span className="text-sm text-green-600 ml-2">{product.discountPercentage}% OFF</span>
          </div>
          <div className="flex items-center">
            <span className="text-yellow-400 mr-1">★</span>
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
        </div>
        
        <Link 
          to={`/products/${product.id}`} 
          className="mt-4 block w-full text-center bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
