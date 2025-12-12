import { Product, ProductsResponse } from '../types';

const BASE_URL = 'https://dummyjson.com/products';

export const apiService = {
  getAllProducts: async (limit: number = 20, skip: number = 0): Promise<ProductsResponse> => {
    const res = await fetch(`${BASE_URL}?limit=${limit}&skip=${skip}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  searchProducts: async (query: string, limit: number = 20, skip: number = 0): Promise<ProductsResponse> => {
    const res = await fetch(`${BASE_URL}/search?q=${query}&limit=${limit}&skip=${skip}`);
    if (!res.ok) throw new Error('Failed to search products');
    return res.json();
  },

  getProductById: async (id: number): Promise<Product> => {
    const res = await fetch(`${BASE_URL}/${id}`);
    if (!res.ok) throw new Error('Failed to fetch product details');
    return res.json();
  },

  getCategories: async (): Promise<string[]> => {
    const res = await fetch(`${BASE_URL}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    // DummyJSON categories endpoint returns an array of objects in recent versions, handle carefully
    const data = await res.json();
    if (Array.isArray(data) && typeof data[0] === 'object') {
      return data.map((c: any) => c.slug || c.name);
    }
    return data;
  },

  getProductsByCategory: async (category: string, limit: number = 20): Promise<ProductsResponse> => {
    const res = await fetch(`${BASE_URL}/category/${category}?limit=${limit}`);
    if (!res.ok) throw new Error('Failed to fetch category products');
    return res.json();
  }
};
