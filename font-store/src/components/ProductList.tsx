import React from 'react';
import { useProducts } from '@/hooks/use-woocommerce';
import { WooCommerceProduct } from '@/lib/woocommerce';

interface ProductListProps {
  params?: {
    category?: string;
    search?: string;
    featured?: boolean;
    on_sale?: boolean;
    per_page?: number;
    page?: number;
    orderby?: 'date' | 'id' | 'title' | 'price' | 'popularity' | 'rating';
    order?: 'asc' | 'desc';
  };
}

const ProductCard: React.FC<{ product: WooCommerceProduct }> = ({ product }) => {
  const imageUrl = product.images?.[0]?.src || '/placeholder-product.jpg';
  const price = parseFloat(product.price);
  const regularPrice = parseFloat(product.regular_price);
  const hasDiscount = product.on_sale && regularPrice > price;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="aspect-w-16 aspect-h-9 bg-gray-100">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-product.jpg';
          }}
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        <div className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.short_description || product.description}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                ${regularPrice.toFixed(2)}
              </span>
            )}
          </div>

          {product.on_sale && (
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
              Sale
            </span>
          )}
        </div>

        {product.featured && (
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">
            Featured
          </span>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <span>⭐ {parseFloat(product.average_rating).toFixed(1)}</span>
            <span className="ml-2">({product.rating_count} reviews)</span>
          </div>

          <div className="text-sm text-gray-500">
            {product.stock_status === 'instock' ? (
              <span className="text-green-600">In Stock</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>
        </div>

        <a
          href={product.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block w-full bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200"
        >
          View Product
        </a>
      </div>
    </div>
  );
};

const ProductList: React.FC<ProductListProps> = ({ params }) => {
  const { products, loading, error, total, fetchProducts } = useProducts({
    ...params,
    immediate: true,
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p className="font-medium">Error loading products</p>
        <p className="text-sm">{error}</p>
        <button
          onClick={() => fetchProducts()}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No products found</div>
        <p className="text-gray-400">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Products ({total})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {total > products.length && (
        <div className="mt-8 text-center">
          <button
            onClick={() => {
              const nextPage = (params?.page || 1) + 1;
              fetchProducts({ ...params, page: nextPage });
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
          >
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;