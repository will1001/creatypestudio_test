'use client';

import Link from 'next/link';
import { ArrowRight, Star, Download, TrendingUp, Sparkles, Loader2 } from 'lucide-react';
import { useProducts } from '@/hooks/use-woocommerce';
import { WooCommerceProduct } from '@/lib/woocommerce';

// Convert WooCommerce product to display format
const convertToDisplayFormat = (product: WooCommerceProduct) => {
  return {
    id: product.id,
    name: product.name,
    designer: 'Creatype Studio',
    category: product.categories[0]?.name || 'Font',
    price: parseFloat(product.price),
    rating: parseFloat(product.average_rating) || 0,
    downloads: product.total_sales,
    description: product.short_description.replace(/<[^>]*>/g, ''),
    preview: product.name,
    tags: product.tags.map(tag => tag.name),
    fileFormats: ['OTF', 'TTF', 'WOFF'],
    isNew: new Date(product.date_created) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    imageUrl: product.images[0]?.src || '/placeholder-font.jpg',
    slug: product.slug,
    permalink: product.permalink,
    on_sale: product.on_sale,
    originalPrice: product.regular_price && parseFloat(product.regular_price) > parseFloat(product.price)
      ? parseFloat(product.regular_price)
      : undefined,
    featured: product.featured,
    createdAt: new Date(product.date_created),
  };
};

export default function Home() {
  // Use WooCommerce API hook to get products
  const { products, loading, error } = useProducts({
    per_page: 20,
    immediate: true,
  });

  // Convert products to display format
  const displayProducts = products.map(convertToDisplayFormat);

  // Get featured fonts (marked as featured in WooCommerce)
  const featuredFonts = displayProducts.filter(font => font.featured).slice(0, 3);

  // Get new fonts (created within last 7 days)
  const newFonts = displayProducts.filter(font => font.isNew).slice(0, 3);

  // Fallback: If no featured fonts, use the ones with highest ratings
  const fallbackFeatured = displayProducts
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  // Fallback: If no new fonts, use the most recent ones
  const fallbackNew = displayProducts
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 3);

  const displayFeaturedFonts = featuredFonts.length > 0 ? featuredFonts : fallbackFeatured;
  const displayNewFonts = newFonts.length > 0 ? newFonts : fallbackNew;

  // Calculate stats from actual data
  const totalFonts = displayProducts.length;
  const totalDownloads = displayProducts.reduce((sum, font) => sum + font.downloads, 0);
  const averageRating = displayProducts.length > 0
    ? (displayProducts.reduce((sum, font) => sum + font.rating, 0) / displayProducts.length).toFixed(1)
    : '4.8';

  // Extract unique categories
  const uniqueCategories = Array.from(new Set(displayProducts.map(font => font.category)));
  const categoryCounts = uniqueCategories.map(category => ({
    name: category,
    count: displayProducts.filter(font => font.category === category).length,
    icon: category.includes('Sans') ? '🎨' :
          category.includes('Serif') ? '📖' :
          category.includes('Script') ? '✍️' :
          category.includes('Display') ? '🌟' :
          category.includes('Mono') ? '💻' : '🖋️'
  }));

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Star className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-6">
              <Sparkles className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
                Premium <span className="text-blue-600">Fonts</span>
              </h1>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover professional fonts for your creative projects.
              From elegant scripts to modern sans-serifs, find the perfect typography for your brand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/fonts"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Browse All Fonts
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/fonts?featured=true"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                View Featured Fonts
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {loading ? (
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                ) : (
                  totalFonts.toLocaleString()
                )}
              </div>
              <div className="text-gray-600">Premium Fonts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {loading ? (
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                ) : (
                  `${(totalDownloads / 1000).toFixed(0)}K+`
                )}
              </div>
              <div className="text-gray-600">Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{averageRating}★</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Fonts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Fonts</h2>
              <p className="text-gray-600 mt-2">Hand-picked premium fonts from our collection</p>
            </div>
            <Link
              href="/fonts?featured=true"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                <p className="text-gray-600">Loading featured fonts...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayFeaturedFonts.map((font) => (
                <Link key={font.id} href={`/fonts/${font.id}`}>
                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer relative">
                    {font.on_sale && (
                      <div className="absolute top-4 right-4 bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                        Sale
                      </div>
                    )}
                    <div className="aspect-square bg-gray-50 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
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
                        className={`text-4xl font-bold text-gray-800 text-center px-4 ${font.imageUrl && font.imageUrl !== '/placeholder-font.jpg' ? 'hidden' : ''}`}
                        style={{
                          fontFamily: font.category.includes('Script') ? 'cursive' :
                                     font.category.includes('Serif') ? 'serif' :
                                     font.category.includes('Mono') ? 'monospace' : 'sans-serif'
                        }}
                      >
                        {font.name.split(' ').slice(0, 2).join('\n')}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-gray-900">{font.name}</h3>
                      <p className="text-sm text-gray-600">{font.category} by {font.designer}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm text-gray-600">{font.rating.toFixed(1)}</span>
                          <span className="ml-2 text-sm text-gray-500">({font.downloads})</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          ${font.price}
                          {font.originalPrice && font.originalPrice > font.price && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              ${font.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
            <p className="text-gray-600 mt-2">Find the perfect font style for your project</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoryCounts.map((category) => (
              <Link
                key={category.name}
                href={`/fonts?category=${category.name.toLowerCase().replace(' ', '-')}`}
                className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow text-center"
              >
                <div className="text-3xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} fonts</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
              <p className="text-gray-600 mt-2">Fresh fonts added to our collection</p>
            </div>
            <div className="flex items-center text-green-600">
              <TrendingUp className="h-5 w-5 mr-2" />
              <span className="font-medium">Just Added</span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-green-600 mb-4" />
                <p className="text-gray-600">Loading new arrivals...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {displayNewFonts.map((font) => (
                <Link key={font.id} href={`/fonts/${font.id}`}>
                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer relative">
                    <div className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                      NEW
                    </div>
                    <div className="aspect-square bg-gray-50 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
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
                        className={`text-4xl font-bold text-gray-800 text-center px-4 ${font.imageUrl && font.imageUrl !== '/placeholder-font.jpg' ? 'hidden' : ''}`}
                        style={{
                          fontFamily: font.category.includes('Script') ? 'cursive' :
                                     font.category.includes('Serif') ? 'serif' :
                                     font.category.includes('Mono') ? 'monospace' : 'sans-serif'
                        }}
                      >
                        {font.name.split(' ').slice(0, 2).join('\n')}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-gray-900">{font.name}</h3>
                      <p className="text-sm text-gray-600">{font.category} by {font.designer}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm text-gray-600">{font.rating.toFixed(1)}</span>
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          ${font.price}
                          {font.originalPrice && font.originalPrice > font.price && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              ${font.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Perfect Font?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of designers who trust FontStore for premium typography
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/fonts"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-blue-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Start Browsing
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-full text-white hover:bg-blue-700 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}