import { NextRequest, NextResponse } from 'next/server';
import { wooCommerceAPI } from '@/lib/woocommerce';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idParam } = await params;
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const product = await wooCommerceAPI.getProduct(id);

    return NextResponse.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Product API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch product'
      },
      { status: 500 }
    );
  }
}
