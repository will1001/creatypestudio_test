'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Star, Download, ShoppingCart, Heart, Share2, Check, ExternalLink, User, Calendar, FileText, Shield, Loader2 } from 'lucide-react';
import { licenseOptions } from '@/lib/fonts-data';
import { WooCommerceProduct } from '@/lib/woocommerce';
import { useProduct } from '@/hooks/use-woocommerce';
import { useCart } from '@/contexts/CartContext';

// Convert WooCommerce product to display format
const convertToDisplayFormat = (product: WooCommerceProduct) => {
  return {
    id: product.id.toString(),
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
    license: 'personal' as const,
    createdAt: new Date(product.date_created),
    isNew: new Date(product.date_created) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    imageUrl: product.images[0]?.src || '/placeholder-font.jpg',
    slug: product.slug,
    permalink: product.permalink,
    on_sale: product.on_sale,
    originalPrice: product.regular_price && parseFloat(product.regular_price) > parseFloat(product.price)
      ? parseFloat(product.regular_price)
      : undefined,
  };
};

export default function FontDetailPage() {
  const params = useParams();
  const router = useRouter();
  const fontId = params.id as string;
  const { addItem } = useCart();

  const [selectedLicense, setSelectedLicense] = useState<'personal' | 'commercial' | 'extended'>('personal');
  const [fontSize, setFontSize] = useState(24);
  const [previewText, setPreviewText] = useState('The quick brown fox jumps over the lazy dog');

  // Use WooCommerce API hook to get single product
  const { product, loading, error } = useProduct(parseInt(fontId));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-600">Loading font details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Font not found</h1>
          <p className="text-gray-600 mb-4">{error || 'The requested font could not be found.'}</p>
          <Link
            href="/fonts"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to fonts
          </Link>
        </div>
      </div>
    );
  }

  // Convert WooCommerce product to display format
  const font = convertToDisplayFormat(product);

  // TODO: Get related products from WooCommerce API
  const relatedFonts: ReturnType<typeof convertToDisplayFormat>[] = []; // Will be implemented with related products API

  const getLicensePrice = (license: string) => {
    switch (license) {
      case 'commercial': return font.price * 2;
      case 'extended': return font.price * 5;
      default: return font.price;
    }
  };

  const handleAddToCart = () => {
    addItem(font, selectedLicense);
  };

  const handleBuyNow = () => {
    addItem(font, selectedLicense);
    router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/fonts" className="hover:text-gray-900">Fonts</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{font.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Font Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Image */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
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
                  className={`text-center font-bold text-gray-800 text-center px-4 ${font.imageUrl && font.imageUrl !== '/placeholder-font.jpg' ? 'hidden' : ''}`}
                  style={{
                    fontFamily: font.category.includes('Script') ? 'cursive' :
                               font.category.includes('Serif') ? 'serif' :
                               font.category.includes('Mono') ? 'monospace' : 'sans-serif'
                  }}
                >
                  {font.name.split(' ').slice(0, 2).join('\n')}
                </div>
                {font.on_sale && (
                  <span className="absolute top-2 right-2 bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                    Sale
                  </span>
                )}
              </div>
            </div>

            {/* Header */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <Link
                href="/fonts"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to fonts
              </Link>

              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{font.name}</h1>
                  <p className="text-lg text-gray-600 mb-1">
                    {font.category} by <span className="font-medium">{font.designer}</span>
                  </p>
                  <div className="flex items-center mb-4">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-gray-900 font-medium">{font.rating}</span>
                    <span className="ml-2 text-gray-600">({font.downloads.toLocaleString()} downloads)</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {font.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Font Preview */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Preview</h2>

              {/* Preview Controls */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preview Text</label>
                  <input
                    type="text"
                    value={previewText}
                    onChange={(e) => setPreviewText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="sm:w-32">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
                  <select
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={16}>Small (16px)</option>
                    <option value={24}>Medium (24px)</option>
                    <option value={32}>Large (32px)</option>
                    <option value={48}>Extra Large (48px)</option>
                    <option value={64}>Huge (64px)</option>
                  </select>
                </div>
              </div>

              {/* Preview Display */}
              <div className="border border-gray-200 rounded-lg p-8 bg-gray-50 min-h-[200px] flex items-center justify-center">
                <div
                  className="text-center font-bold text-gray-800 break-words max-w-full"
                  style={{
                    fontSize: `${fontSize}px`,
                    fontFamily: font.category.includes('Script') ? 'cursive' :
                               font.category.includes('Serif') ? 'serif' :
                               font.category.includes('Monospace') ? 'monospace' : 'sans-serif'
                  }}
                >
                  {previewText}
                </div>
              </div>

              {/* Sample Text Presets */}
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                  'abcdefghijklmnopqrstuvwxyz',
                  '1234567890',
                  '!@#$%^&*()_+-=[]{}|;:,.<>?'
                ].map((text, index) => (
                  <button
                    key={index}
                    onClick={() => setPreviewText(text)}
                    className="text-sm px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {index === 0 ? 'Uppercase' : index === 1 ? 'Lowercase' : index === 2 ? 'Numbers' : 'Symbols'}
                  </button>
                ))}
              </div>
            </div>

            {/* Character Set */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Character Set</h2>
              <div className="text-sm text-gray-600 space-y-2">
                <div><span className="font-medium">Supported Formats:</span> {font.fileFormats.join(', ')}</div>
                <div><span className="font-medium">Characters:</span> Complete set including uppercase, lowercase, numbers, and symbols</div>
                <div><span className="font-medium">Language Support:</span> Latin Extended, Western European</div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">About this Font</h2>
              <p className="text-gray-700 leading-relaxed">{font.description}</p>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Designer: {font.designer}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Added: {font.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Download className="h-4 w-4 mr-2 text-gray-400" />
                  <span>{font.downloads.toLocaleString()} downloads</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Purchase */}
          <div className="space-y-6">
            {/* Purchase Options */}
            <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">License & Purchase</h2>

              {/* License Selection */}
              <div className="space-y-3 mb-6">
                {licenseOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedLicense(option.value as any)}
                    className={`w-full text-left p-4 border rounded-lg transition-all ${
                      selectedLicense === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`mt-1 w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                        selectedLicense === option.value ? 'border-blue-500' : 'border-gray-300'
                      }`}>
                        {selectedLicense === option.value && (
                          <Check className="h-2 w-2 text-blue-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{option.label}</div>
                        <div className="text-sm text-gray-600">{option.description}</div>
                        <div className="text-lg font-bold text-gray-900 mt-1">
                          ${getLicensePrice(option.value)}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleBuyNow}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Buy Now - ${getLicensePrice(selectedLicense)}
                </button>
                <button
                  onClick={handleAddToCart}
                  className="w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </button>
                {font.permalink && (
                  <Link
                    href={font.permalink}
                    target="_blank"
                    className="w-full px-6 py-3 border border-blue-300 text-blue-700 font-medium rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on WooCommerce
                  </Link>
                )}
              </div>

              {/* File Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{font.fileFormats.join(', ')} files included</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-gray-400" />
                    <span>Commercial license included</span>
                  </div>
                  <div className="flex items-center">
                    <Download className="h-4 w-4 mr-2 text-gray-400" />
                    <span>Instant download</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Fonts */}
        {relatedFonts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Fonts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedFonts.map((relatedFont) => (
                <Link key={relatedFont.id} href={`/fonts/${relatedFont.id}`}>
                  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="aspect-square bg-gray-50 rounded-lg mb-4 flex items-center justify-center">
                      <div
                        className="text-2xl font-bold text-gray-800 text-center px-2"
                        style={{
                          fontFamily: relatedFont.category.includes('Script') ? 'cursive' :
                                     relatedFont.category.includes('Serif') ? 'serif' :
                                     relatedFont.category.includes('Monospace') ? 'monospace' : 'sans-serif'
                        }}
                      >
                        {relatedFont.name.split(' ').slice(0, 2).join('\n')}
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900">{relatedFont.name}</h3>
                    <p className="text-sm text-gray-600">{relatedFont.category}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="ml-1 text-xs text-gray-600">{relatedFont.rating}</span>
                      </div>
                      <div className="text-sm font-bold text-gray-900">${relatedFont.price}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}