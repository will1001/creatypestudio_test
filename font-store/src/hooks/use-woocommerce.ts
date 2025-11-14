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

const DEFAULT_PRODUCT_PARAMS: Pick<WooCommerceApiParams, 'page' | 'per_page'> = {
  page: 1,
  per_page: 20,
};

const PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_WC_PRODUCTS_URL ||
  'https://wp.cunindonesia.web.id/wp-json/wc/v3/products';
const PUBLIC_CONSUMER_KEY = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_KEY || 'ck_0022b503bc112022ac4af1b9b73e1b6bf4cfe890';
const PUBLIC_CONSUMER_SECRET = process.env.NEXT_PUBLIC_WOOCOMMERCE_CONSUMER_SECRET || 'cs_3340260f4ed4645c28822375f397e968a4e27996';

const getAuthHeader = () => {
  if (!PUBLIC_CONSUMER_KEY || !PUBLIC_CONSUMER_SECRET) {
    return undefined;
  }

  if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    return `Basic ${window.btoa(`${PUBLIC_CONSUMER_KEY}:${PUBLIC_CONSUMER_SECRET}`)}`;
  }

  if (typeof Buffer !== 'undefined') {
    return `Basic ${Buffer.from(`${PUBLIC_CONSUMER_KEY}:${PUBLIC_CONSUMER_SECRET}`).toString('base64')}`;
  }

  return undefined;
};

const buildProductsUrl = (params: WooCommerceApiParams) => {
  const url = new URL(PUBLIC_BASE_URL);

  const finalPage = params.page ?? DEFAULT_PRODUCT_PARAMS.page!;
  const finalPerPage = params.per_page ?? DEFAULT_PRODUCT_PARAMS.per_page!;
  url.searchParams.set('page', finalPage.toString());
  url.searchParams.set('per_page', finalPerPage.toString());

  const optionalParams: Array<[keyof WooCommerceApiParams, (value: any) => string]> = [
    ['search', (value) => value],
    ['category', (value) => value],
    ['tag', (value) => value],
    ['status', (value) => value],
    ['type', (value) => value],
    ['featured', (value) => String(value)],
    ['on_sale', (value) => String(value)],
    ['min_price', (value) => value.toString()],
    ['max_price', (value) => value.toString()],
    ['stock_status', (value) => value],
    ['orderby', (value) => value],
    ['order', (value) => value],
  ];

  optionalParams.forEach(([key, serializer]) => {
    const paramValue = params[key];
    if (paramValue !== undefined && paramValue !== null) {
      url.searchParams.set(key, serializer(paramValue));
    }
  });

  return url.toString();
};

const buildProductDetailUrl = (productId: number) => {
  const baseUrl = PUBLIC_BASE_URL.replace(/\/$/, '');
  return `${baseUrl}/${productId}`;
};

export function useProducts(options: UseProductsOptions = {}): UseProductsResult {
  const [products, setProducts] = useState<WooCommerceProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentParams, setCurrentParams] = useState<WooCommerceApiParams>({
    ...DEFAULT_PRODUCT_PARAMS,
    ...options,
  });

  const fetchProducts = async (params?: WooCommerceApiParams) => {
    setLoading(true);
    setError(null);

    try {
      const finalParams = { ...DEFAULT_PRODUCT_PARAMS, ...currentParams, ...params };
      setCurrentParams(finalParams);
      const url = buildProductsUrl(finalParams);
      const authHeader = getAuthHeader();
      const response = await fetch(url, {
        headers: authHeader ? { Authorization: authHeader } : undefined,
        mode: 'cors',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch products');
      }

      const data: WooCommerceProduct[] = await response.json();
      const totalCount = parseInt(response.headers.get('X-WP-Total') || data.length.toString(), 10);

      setProducts(data);
      setTotal(totalCount);
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
      const url = buildProductDetailUrl(productId);
      const authHeader = getAuthHeader();
      const response = await fetch(url, {
        headers: authHeader ? { Authorization: authHeader } : undefined,
        mode: 'cors',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch product');
      }

      const data: WooCommerceProduct = await response.json();
      setProduct(data);
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
