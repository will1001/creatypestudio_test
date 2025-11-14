import { useState, useEffect } from 'react';
import { WooCommerceProduct, WooCommerceApiParams } from '@/lib/woocommerce';

interface UseProductsOptions extends WooCommerceApiParams {
  immediate?: boolean;
}

interface UseProductsResult {
  products: WooCommerceProduct[];
  loading: boolean;
  error: string | null;
  total: number;
  fetchProducts: (params?: WooCommerceApiParams) => Promise<void>;
  refetch: () => Promise<void>;
}

interface UseProductResult {
  product: WooCommerceProduct | null;
  loading: boolean;
  error: string | null;
  fetchProduct: (id: number) => Promise<void>;
}

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const [products, setProducts] = useState<WooCommerceProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentParams, setCurrentParams] = useState<WooCommerceApiParams>(options);

  const fetchProducts = async (params?: WooCommerceApiParams) => {
    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();
      const finalParams = { ...currentParams, ...params };

      Object.entries(finalParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/products?${searchParams.toString()}`);
      const result = await response.json();

      if (result.success) {
        setProducts(result.data);
        setTotal(result.total);
      } else {
        setError(result.error || 'Failed to fetch products');
        setProducts([]);
        setTotal(0);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await fetchProducts(currentParams);
  };

  useEffect(() => {
    if (options.immediate !== false) {
      fetchProducts();
    }
  }, []);

  return {
    products,
    loading,
    error,
    total,
    fetchProducts,
    refetch,
  };
}

export function useProduct(id?: number): UseProductResult {
  const [product, setProduct] = useState<WooCommerceProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = async (productId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/products/${productId}`);
      const result = await response.json();

      if (result.success) {
        setProduct(result.data);
      } else {
        setError(result.error || 'Failed to fetch product');
        setProduct(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  return {
    product,
    loading,
    error,
    fetchProduct,
  };
}