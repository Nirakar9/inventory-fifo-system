'use client';

import { useState } from 'react';

export default function AddProduct() {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa('admin:password123')
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: parseInt(quantity),
          unit_price: parseFloat(unitPrice)
        })
      });
      if (!response.ok) throw new Error('Failed to add product');
      const data = await response.json();
      setMessage('Product added successfully!');
      setProductId('');
      setQuantity('');
      setUnitPrice('');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
        <h3 className="text-xl font-semibold text-gray-900">Add Product to Inventory</h3>
        <p className="mt-1 text-sm text-gray-600">Enter product details to add a new batch to inventory.</p>
      </div>
      <div className="px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-2">
                Product ID
              </label>
              <input
                type="text"
                id="productId"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                placeholder="e.g., PRD001"
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g., 100"
                required
                min="1"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Unit Price ($)
              </label>
              <input
                type="number"
                id="unitPrice"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                placeholder="e.g., 10.50"
                required
                step="0.01"
                min="0"
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding Product...' : 'Add Product'}
            </button>
          </div>
        </form>
        {message && (
          <div className={`mt-6 p-4 rounded-md ${message.includes('successfully') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
