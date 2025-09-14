'use client';

import { useState, useEffect } from 'react';
import ProductList from './components/ProductList';
import Ledger from './components/Ledger';

import AddProduct from './components/AddProduct';
import SellProduct from './components/SellProduct';

export default function Home() {
  const [activeTab, setActiveTab] = useState('products');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Inventory FIFO System</h1>
          </div>
        </div>
      </header>

      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('ledger')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'ledger'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sales Ledger
            </button>
            <button
              onClick={() => setActiveTab('addProduct')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'addProduct'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Add Product
            </button>
            <button
              onClick={() => setActiveTab('sellProduct')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sellProduct'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sell Product
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'products' && <ProductList />}
        {activeTab === 'ledger' && <Ledger refreshTrigger={refreshTrigger} />}
        {activeTab === 'addProduct' && <AddProduct />}
        {activeTab === 'sellProduct' && <SellProduct />}
      </main>
    </div>
  );
}
