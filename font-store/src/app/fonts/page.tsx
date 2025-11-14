'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, Grid, List, Star, ShoppingCart, ExternalLink, ChevronDown, Loader2 } from 'lucide-react';
import { WooCommerceProduct } from '@/lib/woocommerce';
import { useProducts } from '@/hooks/use-woocommerce';
import { useCart } from '@/contexts/CartContext';

// Convert WooCommerce product to our Font type format
const convertToFontFormat = (product: WooCommerceProduct) => {
  return {
    id: product.id.toString(),
    name: product.name,
    designer: 'Creatype Studio',
    category: product.categories[0]?.name || 'Font',
    price: parseFloat(product.price),
    rating: parseFloat(product.average_rating) || 0,
    downloads: product.total_sales,
    description: product.short_description.replace(/<[^>]*>/g, ''), // Remove HTML tags
    preview: product.name,
    tags: product.tags.map(tag => tag.name),
    fileFormats: ['OTF', 'TTF', 'WOFF'],
    license: 'personal' as const, // Default license
    createdAt: new Date(product.date_created),
    isNew: new Date(product.date_created) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days
    imageUrl: product.images[0]?.src || '/placeholder-font.jpg',
    slug: product.slug,
    permalink: product.permalink,
    on_sale: product.on_sale,
    originalPrice: product.regular_price && parseFloat(product.regular_price) > parseFloat(product.price)
      ? parseFloat(product.regular_price)
      : undefined,
  };
};

export default function FontsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const { addItem } = useCart();

  // Use WooCommerce API hook
  const { products, loading, error, fetchProducts } = useProducts({
    per_page: 20,
    immediate: true,
  });

  // Extract unique categories from products
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    products.forEach(product => {
      product.categories.forEach(category => {
        uniqueCategories.add(category.name);
      });
    });
    return ['All', ...Array.from(uniqueCategories)];
  }, [products]);

  // Convert WooCommerce products to our font format
  const fontsData = useMemo(() => {
    return products.map(convertToFontFormat);
  }, [products]);

  const filteredFonts = useMemo(() => {
    let filtered = fontsData;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(font =>
        font.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        font.designer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        font.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(font => font.category === selectedCategory);
    }

    // Sort fonts
    switch (selectedSort) {
      case 'popular':
        filtered.sort((a, b) => b.downloads - a.downloads);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.slug?.split('-').pop() || '0').getTime() - new Date(a.slug?.split('-').pop() || '0').getTime());
        break;
      default:
        break;
    }

    return filtered;
  }, [fontsData, searchQuery, selectedCategory, selectedSort]);

  const handleAddToCart = (font: ReturnType<typeof convertToFontFormat>) => {
    addItem(font, 'personal');
  };

  const handleRetry = () => {
    fetchProducts({ per_page: 20 });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Fonts</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Browse Fonts</h1>
              <p className="text-gray-600 mt-1">
                {loading ? (
                  <span className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading fonts...
                  </span>
                ) : (
                  `Discover ${fontsData.length} premium fonts for your projects`
                )}
              </p>
            </div>

            {/* Search Bar */}
            <div className="mt-4 md:mt-0 flex-1 max-w-md md:ml-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search fonts..."
                  disabled={loading}
                />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="mt-4 md:mt-0 ml-4 flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                disabled={loading}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                disabled={loading}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                disabled={loading}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Category Filter */}
              <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className={`${showFilters ? 'block' : 'hidden'} sm:block`}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            <div className="mt-4 sm:mt-0">
              <p className="text-sm text-gray-600">
                {loading ? (
                  <span className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </span>
                ) : (
                  `Showing ${filteredFonts.length} of ${fontsData.length} fonts`
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fonts Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600">Loading fonts...</p>
            </div>
          </div>
        ) : filteredFonts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No fonts found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-6"
          }>
            {filteredFonts.map((font) => (
              <div
                key={font.id}
                className={`bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow ${
                  viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
                }`}
              >
                <Link href={`/fonts/${font.id}`} className="flex-1">
                  <div className={viewMode === 'list' ? 'sm:w-48 sm:h-48' : 'aspect-square'}>
                    <div className="w-full h-full bg-gray-50 rounded-t-lg p-6 flex items-center justify-center relative overflow-hidden">
                      {font.imageUrl && font.imageUrl !== '/placeholder-font.jpg' ? (
                        <img
                          src={font.imageUrl}
                          alt={font.name}
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div
                        className={`text-center font-bold text-gray-800 ${font.imageUrl && font.imageUrl !== '/placeholder-font.jpg' ? 'hidden' : ''}`}
                        style={{
                          fontFamily: font.category.includes('Script') ? 'cursive' :
                                     font.category.includes('Serif') ? 'serif' :
                                     font.category.includes('Monospace') ? 'monospace' : 'sans-serif'
                        }}
                      >
                        {font.preview || font.name}
                      </div>
                      {font.on_sale && (
                        <span className="absolute top-2 right-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                          Sale
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{font.name}</h3>
                        <p className="text-sm text-gray-600">{font.category} by {font.designer}</p>
                      </div>
                      {font.isNew && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          NEW
                        </span>
                      )}
                    </div>

                    <div className="flex items-center mb-3">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">{font.rating.toFixed(1)}</span>
                      <span className="ml-2 text-sm text-gray-500">({font.downloads.toLocaleString()} downloads)</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{font.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {font.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-gray-900">
                        ${font.price}
                        {font.originalPrice && font.originalPrice > font.price && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ${font.originalPrice}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        {font.fileFormats.slice(0, 2).join(', ')}
                        {font.fileFormats.length > 2 && ` +${font.fileFormats.length - 2}`}
                      </div>
                    </div>
                  </div>
                </Link>

                <div className={`p-6 pt-0 ${viewMode === 'list' ? 'sm:pt-6 sm:border-l sm:border-gray-200 sm:w-48' : ''}`}>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(font)}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </button>
                    <Link
                      href={font.permalink || `/fonts/${font.id}`}
                      target={font.permalink ? "_blank" : "_self"}
                      className="flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}