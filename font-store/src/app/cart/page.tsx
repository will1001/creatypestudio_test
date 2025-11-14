'use client';

import Link from 'next/link';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, CreditCard, Shield, Download } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();

  const getLicensePrice = (font: any, license: string) => {
    switch (license) {
      case 'commercial': return font.price * 2;
      case 'extended': return font.price * 5;
      default: return font.price;
    }
  };

  const getLicenseLabel = (license: string) => {
    switch (license) {
      case 'commercial': return 'Commercial License';
      case 'extended': return 'Extended License';
      default: return 'Personal License';
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="text-gray-400 mb-4">
              <ShoppingBag className="h-16 w-16 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any fonts to your cart yet. Browse our collection and find the perfect fonts for your project.
            </p>
            <Link
              href="/fonts"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Fonts
              <ShoppingBag className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <Link
              href="/fonts"
              className="mr-4 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <span className="ml-4 text-gray-600">
              ({items.length} {items.length === 1 ? 'item' : 'items'})
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={`${item.font.id}-${item.license}`} className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Font Preview */}
                  <div className="sm:w-32 sm:h-32 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div
                      className="text-lg font-bold text-gray-800 text-center px-2"
                      style={{
                        fontFamily: item.font.category.includes('Script') ? 'cursive' :
                                   item.font.category.includes('Serif') ? 'serif' :
                                   item.font.category.includes('Monospace') ? 'monospace' : 'sans-serif'
                      }}
                    >
                      {item.font.name.split(' ').slice(0, 2).join('\n')}
                    </div>
                  </div>

                  {/* Font Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link
                          href={`/fonts/${item.font.id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {item.font.name}
                        </Link>
                        <p className="text-sm text-gray-600">{item.font.category} by {item.font.designer}</p>
                        <div className="mt-2">
                          <span className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                            {getLicenseLabel(item.license)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.font.id)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Quantity and Price */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-600">Quantity:</span>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.font.id, item.quantity - 1)}
                            className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.font.id, parseInt(e.target.value) || 1)}
                            className="w-16 text-center border-0 focus:ring-0"
                          />
                          <button
                            onClick={() => updateQuantity(item.font.id, item.quantity + 1)}
                            className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm text-gray-600">
                          ${getLicensePrice(item.font, item.license)} × {item.quantity}
                        </div>
                        <div className="text-lg font-bold text-gray-900">
                          ${getLicensePrice(item.font, item.license) * item.quantity}
                        </div>
                      </div>
                    </div>

                    {/* File Formats */}
                    <div className="mt-3 text-sm text-gray-600">
                      Formats: {item.font.fileFormats.join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Clear Cart Button */}
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 font-medium transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 border border-gray-200 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-center text-gray-600">
                  <Download className="h-4 w-4 mr-2 text-green-600" />
                  <span>Instant download</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Shield className="h-4 w-4 mr-2 text-blue-600" />
                  <span>Commercial license included</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <CreditCard className="h-4 w-4 mr-2 text-purple-600" />
                  <span>Secure payment</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="block w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Proceed to Checkout
              </Link>

              {/* Continue Shopping */}
              <Link
                href="/fonts"
                className="block w-full mt-4 text-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}