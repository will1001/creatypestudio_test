'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import {
  Package,
  Calendar,
  DollarSign,
  User,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Loader2,
  ArrowLeft,
  Eye,
  Download
} from 'lucide-react';
import { wooCommerceAPI, WooCommerceOrder } from '@/lib/woocommerce';

interface OrderStatus {
  status: string;
  label: string;
  color: string;
  icon: React.ReactNode;
}

function OrdersContent() {
  const [orders, setOrders] = useState<WooCommerceOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const orderData = await wooCommerceAPI.getOrders({ per_page: 10 });
      setOrders(orderData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Unable to load your orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatus = (status: string): OrderStatus => {
    const statusMap: Record<string, OrderStatus> = {
      'pending': {
        status: 'pending',
        label: 'Pending Payment',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: <Clock className="h-4 w-4" />
      },
      'processing': {
        status: 'processing',
        label: 'Processing',
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: <Truck className="h-4 w-4" />
      },
      'completed': {
        status: 'completed',
        label: 'Completed',
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: <CheckCircle className="h-4 w-4" />
      },
      'cancelled': {
        status: 'cancelled',
        label: 'Cancelled',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <XCircle className="h-4 w-4" />
      },
      'refunded': {
        status: 'refunded',
        label: 'Refunded',
        color: 'bg-gray-100 text-gray-800 border-gray-200',
        icon: <DollarSign className="h-4 w-4" />
      },
      'failed': {
        status: 'failed',
        label: 'Failed',
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: <XCircle className="h-4 w-4" />
      }
    };

    return statusMap[status] || statusMap['pending'];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Loading Your Orders</h2>
          <p className="text-gray-600">Please wait while we fetch your order history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg p-8 text-center">
          <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Orders</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={fetchOrders}
              className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
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
              <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
            </div>
            <div className="text-sm text-gray-500">
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start browsing our font collection!</p>
            <Link
              href="/fonts"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Fonts
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const orderStatus = getOrderStatus(order.status);

              return (
                <div key={order.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  {/* Order Header */}
                  <div className="p-6 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.number}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(order.date_created)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            ${parseFloat(order.total).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.currency}
                          </p>
                        </div>

                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${orderStatus.color}`}>
                          {orderStatus.icon}
                          <span className="ml-2">{orderStatus.label}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Customer Info */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Customer Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p className="text-gray-600">
                            <span className="font-medium">{order.billing.first_name} {order.billing.last_name}</span>
                            {order.billing.company && <><br/>{order.billing.company}</>}
                          </p>
                          <p className="text-gray-600 flex items-center">
                            <Mail className="h-3 w-3 mr-2" />
                            {order.billing.email}
                          </p>
                          <p className="text-gray-600 flex items-center">
                            <Phone className="h-3 w-3 mr-2" />
                            {order.billing.phone}
                          </p>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          Shipping Address
                        </h4>
                        <div className="text-sm text-gray-600">
                          <p>{order.billing.first_name} {order.billing.last_name}</p>
                          {order.billing.company && <p>{order.billing.company}</p>}
                          <p>{order.billing.address_1}</p>
                          {order.billing.address_2 && <p>{order.billing.address_2}</p>}
                          <p>{order.billing.city}, {order.billing.state} {order.billing.postcode}</p>
                          <p>{order.billing.country}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <Package className="h-4 w-4 mr-2" />
                        Order Items ({order.line_items.length})
                      </h4>
                      <div className="space-y-3">
                        {order.line_items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">{item.name}</h5>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity} × ${parseFloat(item.total).toFixed(2)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                ${parseFloat(item.total).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Actions */}
                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                      <Link
                        href={`/checkout/success?orderId=${order.id}&productIds=${order.line_items.map(item => item.product_id).join(',')}`}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Files
                      </Link>
                      <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Loading...</h2>
        </div>
      </div>
    }>
      <OrdersContent />
    </Suspense>
  );
}