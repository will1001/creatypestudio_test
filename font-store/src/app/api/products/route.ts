import { NextRequest, NextResponse } from 'next/server';
import { wooCommerceAPI, WooCommerceApiParams, WooCommerceProduct } from '@/lib/woocommerce';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const params: WooCommerceApiParams = {
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined,
      per_page: searchParams.get('per_page') ? parseInt(searchParams.get('per_page')!) : undefined,
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      tag: searchParams.get('tag') || undefined,
      status: searchParams.get('status') || undefined,
      type: searchParams.get('type') || undefined,
      featured: searchParams.get('featured') === 'true' ? true : undefined,
      on_sale: searchParams.get('on_sale') === 'true' ? true : undefined,
      min_price: searchParams.get('min_price') ? parseFloat(searchParams.get('min_price')!) : undefined,
      max_price: searchParams.get('max_price') ? parseFloat(searchParams.get('max_price')!) : undefined,
      stock_status: searchParams.get('stock_status') || undefined,
      orderby: searchParams.get('orderby') as any || undefined,
      order: searchParams.get('order') as any || undefined,
    };

    // Remove undefined values
    Object.keys(params).forEach(key => {
      if (params[key as keyof WooCommerceApiParams] === undefined) {
        delete params[key as keyof WooCommerceApiParams];
      }
    });

    const products = await wooCommerceAPI.getProducts(params);

    // Add pagination headers if available
    const response = NextResponse.json({
      success: true,
      data: products,
      total: products.length,
      params,
    });

    return response;

  } catch (error) {
    console.error('API Error fetching products:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch products',
        data: [],
      },
      { status: 500 }
    );
  }
}