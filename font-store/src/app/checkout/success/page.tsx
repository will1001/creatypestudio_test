import Link from 'next/link';
import { CheckCircle2, Download } from 'lucide-react';
import { wooCommerceAPI } from '@/lib/woocommerce';

interface SuccessPageProps {
  searchParams?: {
    orderId?: string;
    productIds?: string;
  };
}

interface ProductDownloadGroup {
  productId: number;
  productName: string;
  permalink?: string;
  downloads: Array<{
    id: string;
    name: string;
    file: string;
  }>;
}

async function getDownloadGroups(productIds: number[]): Promise<ProductDownloadGroup[]> {
  if (!productIds.length) {
    return [];
  }

  const results = await Promise.allSettled(productIds.map(id => wooCommerceAPI.getProduct(id)));

  const groups: ProductDownloadGroup[] = [];

  results.forEach((result, index) => {
    if (result.status !== 'fulfilled') {
      console.error('Failed to fetch product downloads', {
        productId: productIds[index],
        error: result.reason,
      });
      return;
    }

    const product = result.value;
    const downloads = product.downloads || [];

    if (!downloads.length) {
      return;
    }

    groups.push({
      productId: product.id,
      productName: product.name,
      permalink: product.permalink,
      downloads,
    });
  });

  return groups;
}

export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const orderId = searchParams?.orderId;
  const productIdsParam = searchParams?.productIds || '';
  const uniqueProductIds = Array.from(
    new Set(
      productIdsParam
        .split(',')
        .map(id => parseInt(id, 10))
        .filter(id => !Number.isNaN(id))
    )
  );

  const downloadGroups = await getDownloadGroups(uniqueProductIds);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-green-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-3">Terima kasih, pembayaran berhasil!</h1>
          <p className="text-gray-600">
            Unduhan digital Anda siap. Simpan tautan berikut atau kunjungi lagi halaman ini melalui email konfirmasi yang kami kirimkan.
          </p>
          {orderId && (
            <p className="mt-4 text-sm text-gray-500">
              ID Pesanan: <span className="font-semibold text-gray-700">#{orderId}</span>
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Link unduhan</h2>
              <p className="text-sm text-gray-500">Klik tombol unduh di tiap produk untuk mendapatkan file ZIP font.</p>
            </div>
            <Link
              href="/fonts"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Kembali belanja
            </Link>
          </div>

          {downloadGroups.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center">
              <p className="text-gray-600">
                Tidak ada file unduhan yang tersedia untuk pesanan ini. Pastikan produk Anda bertipe digital/downloadable atau hubungi support.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {downloadGroups.map(group => (
                <div key={group.productId} className="rounded-xl border border-gray-100 bg-gray-50/60 p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Produk</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {group.permalink ? (
                          <Link
                            href={group.permalink}
                            className="hover:text-blue-600"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {group.productName}
                          </Link>
                        ) : (
                          group.productName
                        )}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">{group.downloads.length} file tersedia</p>
                  </div>

                  <div className="space-y-3">
                    {group.downloads.map(download => (
                      <div
                        key={download.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border border-white bg-white p-4 shadow-sm"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{download.name}</p>
                          <p className="text-sm text-gray-500 break-all">{download.file}</p>
                        </div>
                        <Link
                          href={download.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          <Download className="h-4 w-4" />
                          Unduh
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
