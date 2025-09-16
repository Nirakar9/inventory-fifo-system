'use client';

import { useState, useEffect } from 'react';

interface LedgerEntry {
  id: number;
  product_id: string;
  quantity: number;
  total_cost: string;
  sold_at: string;
  batch_id: number;
  batch_qty: number;
  unit_price: string;
  cost: string;
}

interface LedgerProps {
  refreshTrigger?: number;
}

export default function Ledger({ refreshTrigger }: LedgerProps) {
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLedger();
  }, [refreshTrigger]);

  const fetchLedger = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/ledger`, {
        credentials: 'include',
        headers: {
          'Authorization': 'Basic ' + btoa('admin:password123') // Assuming default auth
        }
      });
      if (!response.ok) throw new Error('Failed to fetch ledger');
      const data = await response.json();
      setLedger(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading ledger...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Error: {error}</div>;

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Sales Ledger</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Detailed view of sales and inventory allocations.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sale ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch Qty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ledger.map((entry) => (
              <tr key={`${entry.id}-${entry.batch_id}`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.product_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${entry.total_cost}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(entry.sold_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.batch_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.batch_qty}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${entry.unit_price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${entry.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
