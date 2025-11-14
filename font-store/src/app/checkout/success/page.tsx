'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, Download, ShoppingBag, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { wooCommerceAPI, WooCommerceProduct } from '@/lib/woocommerce';

interface DownloadItem {
  id: string;
  name: string;
  file: string;
}

interface ProductData {
  id: number;
  name: string;
  slug: string;
  downloads: DownloadItem[];
  images: Array<{
    src: string;
    name: string;
    alt: string;
  }>;
  price: string;
  regular_price?: string;
  on_sale: boolean;
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const productIdsParam = searchParams.get('productIds');

  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingFiles, setDownloadingFiles] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (orderId && productIdsParam) {
      fetchProductDetails();
    } else {
      setError('Order information not found');
      setLoading(false);
    }
  }, [orderId, productIdsParam]);

  const fetchProductDetails = async () => {
    try {
      if (!productIdsParam) {
        throw new Error('Product IDs not found');
      }
      const productIds = productIdsParam.split(',').filter(id => id.trim());
      const productPromises = productIds.map(async (productId) => {
        const product = await wooCommerceAPI.getProduct(parseInt(productId));

        // Transform WooCommerce product data to match our interface
        const transformedProduct: ProductData = {
          id: product.id,
          name: product.name,
          slug: product.slug,
          downloads: product.downloads || [],
          images: product.images,
          price: product.price,
          regular_price: product.regular_price,
          on_sale: product.on_sale
        };

        return transformedProduct;
      });

      const productData = await Promise.all(productPromises);
      setProducts(productData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch product details:', err);
      setError('Unable to load download information. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (downloadItem: DownloadItem, productName: string) => {
    try {
      setDownloadingFiles(prev => new Set(prev).add(downloadItem.id));

      // Create download link
      const link = document.createElement('a');
      link.href = downloadItem.file;
      link.download = `${productName} - ${downloadItem.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open(downloadItem.file, '_blank');
    } finally {
      setDownloadingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(downloadItem.id);
        return newSet;
      });
    }
  };

  const handleDownloadAll = async () => {
    for (const product of products) {
      for (const downloadItem of product.downloads) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between downloads
        handleDownload(downloadItem, product.name);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Processing Your Order...</h2>
          <p className="text-gray-600">Please wait while we prepare your downloads</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Processing Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchProductDetails}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
            <Link
              href="/fonts"
              className="block w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Browse Fonts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalDownloads = products.reduce((sum, product) => sum + product.downloads.length, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/fonts"
                className="mr-4 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Thank You For Your Purchase!</h1>
            </div>
            <div className="text-sm text-gray-500">
              Order #{orderId}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <Check className="h-6 w-6 text-green-600 mt-1 mr-4" />
            <div>
              <h2 className="text-lg font-semibold text-green-900 mb-2">
                Payment Successful!
              </h2>
              <p className="text-green-800">
                Your order has been processed successfully. You can now download your purchased fonts below.
              </p>
            </div>
          </div>
        </div>

        {/* Download All Button */}
        {totalDownloads > 1 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-1">
                  Quick Download
                </h3>
                <p className="text-blue-800">
                  Download all {totalDownloads} files at once
                </p>
              </div>
              <button
                onClick={handleDownloadAll}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download All Files
              </button>
            </div>
          </div>
        )}

        {/* Products and Downloads */}
        <div className="space-y-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Product Image */}
                  <div className="sm:w-32 h-32 bg-gray-100 rounded-lg flex-shrink-0">
                    {product.images.length > 0 ? (
                      <img
                        src={product.images[0].src}
                        alt={product.images[0].alt}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center rounded-lg">
                        <span className="text-2xl font-bold text-gray-400">
                          {product.name.split(' ').slice(0, 2).join('\n')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>

                    <div className="flex items-center mb-4">
                      {product.on_sale && product.regular_price ? (
                        <>
                          <span className="text-lg text-gray-400 line-through mr-2">
                            ${product.regular_price}
                          </span>
                          <span className="text-xl font-bold text-green-600">
                            ${product.price}
                          </span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-gray-900">
                          ${product.price}
                        </span>
                      )}
                    </div>

                    <div className="mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Downloadable Product
                      </span>
                    </div>

                    {/* Downloads List */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 mb-2">Download Files:</h4>
                      {product.downloads.map((download) => (
                        <div
                          key={download.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center">
                            <Download className="h-4 w-4 text-gray-500 mr-3" />
                            <div>
                              <div className="font-medium text-gray-900 text-sm">
                                {download.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new URL(download.file).pathname.split('/').pop()}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDownload(download, product.name)}
                            disabled={downloadingFiles.has(download.id)}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                          >
                            {downloadingFiles.has(download.id) ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                                Downloading...
                              </>
                            ) : (
                              <>
                                Download
                                <Download className="h-3 w-3 ml-2" />
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href="/fonts"
            className="flex-1 px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Browse More Fonts
          </Link>
          <Link
            href="/account/orders"
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            View Order History
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Need help? Contact our support team</p>
          <p>Download links are valid for your account. Save them for future use.</p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Loading...</h2>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
