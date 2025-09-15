'use client';

import { useState, useEffect } from 'react';

interface Product {
  product_id: string;
  name: string;
  total_quantity: number;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/products', {
        credentials: 'include',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:password123') // Assuming default auth
        }
      });
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This will also delete all associated inventory batches.')) {
      return;
    }
    setDeleting(productId);
    try {
      const response = await fetch(`http://localhost:4000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:password123')
        }
      });
      if (!response.ok) throw new Error('Failed to delete product');
      setProducts(products.filter(p => p.product_id !== productId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <div className="text-center py-8">Loading products...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Products</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">List of all products in the inventory system.</p>
      </div>
      <ul className="divide-y divide-gray-200">
        {products.map((product) => (
          <li key={product.product_id} className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-10 w-10">
                  <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {product.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                <div className="text-sm text-gray-500">ID: {product.product_id}</div>
                <div className="text-sm text-gray-500">Quantity: {product.total_quantity}</div>
              </div>
              </div>
              <button
                onClick={() => deleteProduct(product.product_id)}
                disabled={deleting === product.product_id}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {deleting === product.product_id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
