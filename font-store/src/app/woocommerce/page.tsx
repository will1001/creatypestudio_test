'use client';

import React, { useState } from 'react';
import ProductList from '@/components/ProductList';
import { WooCommerceApiParams } from '@/lib/woocommerce';

export default function WooCommercePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFeatured, setShowFeatured] = useState(false);
  const [showOnSale, setShowOnSale] = useState(false);
  const [sortBy, setSortBy] = useState<WooCommerceApiParams['orderby']>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSearch = () => {
    const params: WooCommerceApiParams = {
      search: searchTerm || undefined,
      category: selectedCategory || undefined,
      featured: showFeatured || undefined,
      on_sale: showOnSale || undefined,
      orderby: sortBy,
      order: sortOrder,
      per_page: 12,
    };

    return params;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Font Store Products
          </h1>
          <p className="text-gray-600">
            Browse our collection of fonts and digital products from WooCommerce
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Search & Filter</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search fonts..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                placeholder="Category slug..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as WooCommerceApiParams['orderby'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Date</option>
                <option value="title">Title</option>
                <option value="price">Price</option>
                <option value="popularity">Popularity</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            <div>
              <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <select
                id="order"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showFeatured}
                onChange={(e) => setShowFeatured(e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Featured Only</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showOnSale}
                onChange={(e) => setShowOnSale(e.target.checked)}
                className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">On Sale Only</span>
            </label>
          </div>
        </div>

        {/* Products Display */}
        <ProductList params={handleSearch()} />

        {/* API Test Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">API Test</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-md font-medium text-gray-800 mb-2">Available Endpoints:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">GET /api/products</code> - Get all products</li>
                <li>• <code className="bg-gray-100 px-2 py-1 rounded">GET /api/products/[id]</code> - Get single product</li>
              </ul>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-800 mb-2">Query Parameters:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <code>page</code> - Page number</li>
                <li>• <code>per_page</code> - Products per page</li>
                <li>• <code>search</code> - Search query</li>
                <li>• <code>category</code> - Category slug</li>
                <li>• <code>featured</code> - Featured products (true/false)</li>
                <li>• <code>on_sale</code> - On sale products (true/false)</li>
                <li>• <code>orderby</code> - Sort by (date, title, price, etc.)</li>
                <li>• <code>order</code> - Sort order (asc/desc)</li>
              </ul>
            </div>

            <div>
              <h3 className="text-md font-medium text-gray-800 mb-2">Example Usage:</h3>
              <div className="bg-gray-100 p-3 rounded text-sm">
                <code>
                  GET /api/products?search=font&featured=true&per_page=10
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}