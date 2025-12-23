'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, Check, X as XIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/utils/currency';
import { Rating } from '../rating';
import { ComparisonStore } from '@/app/(app)/search-results/hooks/comparison-store';
import AxiosAPI from '@/lib/axios';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

const variants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: '100%' },
};

interface ComparisonSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComparisonSheet({ open, onOpenChange }: ComparisonSheetProps) {
  const { products, removeProduct, clearProducts } = ComparisonStore();
  const [comparisonData, setComparisonData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && products.length === 2) {
      fetchComparison();
    } else {
      setComparisonData(null);
      setError(null);
    }
  }, [open, products]);

  const fetchComparison = async () => {
    if (products.length !== 2) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await AxiosAPI.post('/compare', {
        product_a_id: products[0].id,
        product_b_id: products[1].id,
      });

      setComparisonData(response.data);
    } catch (err: any) {
      console.error('Error fetching comparison:', err);
      setError(err.response?.data?.error || 'Không thể so sánh sản phẩm. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <>
      <div className='fixed top-0 left-0 w-screen h-screen bg-black/30 [backdrop-filter:blur(4px)] z-50' onClick={handleClose} />
      <motion.nav
        initial="closed"
        animate={open ? "open" : "closed"}
        variants={variants}
        transition={{ duration: 0.2 }}
        className="fixed border-s z-50 sm:w-[90vw] max-w-6xl bg-background sm:max-w-none inset-5 start-auto rounded-lg p-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex flex-col gap-4 h-full w-full rounded-lg'>
          <div className='border-b py-3.5 px-5 border-border flex items-center justify-between text-base font-medium'>
            <span>So sánh sản phẩm</span>
            <X className="text-foreground opacity-70 hover:opacity-100 transition-opacity cursor-pointer w-5 h-5" onClick={handleClose} />
          </div>

          <div className='px-5 py-0 h-[calc(100dvh-12rem)] pe-3 -me-3 overflow-y-scroll'>
            {products.length < 2 ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                <p className="text-muted-foreground">Vui lòng chọn 2 sản phẩm để so sánh</p>
                <p className="text-sm text-muted-foreground">Hiện tại bạn đã chọn {products.length}/2 sản phẩm</p>
              </div>
            ) : isLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Đang so sánh sản phẩm...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                <XIcon className="w-8 h-8 text-destructive" />
                <p className="text-destructive">{error}</p>
                <Button onClick={fetchComparison} variant="outline">
                  Thử lại
                </Button>
              </div>
            ) : comparisonData ? (
              <div className="space-y-6 py-4">
                {/* Summary từ AI */}
                {comparisonData.summary && (
                  <Card className="p-4 bg-primary/5 border-primary/20">
                    <h3 className="font-semibold mb-2 text-primary">💡 Tư vấn từ AI</h3>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{comparisonData.summary}</p>
                  </Card>
                )}

                {/* Thông tin sản phẩm */}
                <div className="grid grid-cols-2 gap-4">
                  {products.map((product, index) => (
                    <Card key={product.id} className="p-4">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Link href={`/product-details/${product.id}`} target="_blank">
                              <h3 className="font-semibold text-base hover:text-primary transition-colors">
                                {product.title}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-2 mt-2">
                              <Rating rating={product.averageRating || 0} />
                              <span className="text-sm text-muted-foreground">
                                {product.averageRating?.toFixed(1) || '0.0'}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeProduct(product.id)}
                            className="h-7 w-7 rounded-full bg-gray-500/90 hover:bg-red-500 text-white shadow-sm transition-colors duration-150 flex items-center justify-center"
                            aria-label="Xóa sản phẩm"
                            title="Xóa"
                          >
                            <X className="h-3.5 w-3.5" strokeWidth={3} />
                          </button>
                        </div>

                        <div className="relative w-full h-48 bg-accent/50 rounded-lg overflow-hidden">
                          <Image
                            src={product.imurl || ''}
                            alt={product.title || ''}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>

                        <div className="space-y-2">
                          <div>
                            <span className="text-sm text-muted-foreground">Giá: </span>
                            <span className="text-lg font-semibold text-primary">
                              {formatCurrency(product.sale || product.price || 0)}
                            </span>
                            {product.sale && product.price && (
                              <span className="text-sm text-muted-foreground line-through ml-2">
                                {formatCurrency(product.price)}
                              </span>
                            )}
                          </div>
                        </div>

                        <Link href={`/product-details/${product.id}`} target="_blank">
                          <Button variant="outline" className="w-full">
                            Xem chi tiết
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Bảng so sánh chi tiết */}
                {comparisonData.comparison && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-4">So sánh chi tiết</h3>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Tiêu chí</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold">{products[0]?.title}</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold">{products[1]?.title}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(comparisonData.comparison).map(([key, value]: [string, any]) => (
                            <tr key={key} className="border-t">
                              <td className="px-4 py-3 text-sm font-medium">{key}</td>
                              <td className="px-4 py-3 text-center text-sm">
                                {typeof value === 'object' && value.product_a !== undefined
                                  ? String(value.product_a)
                                  : String(value)}
                              </td>
                              <td className="px-4 py-3 text-center text-sm">
                                {typeof value === 'object' && value.product_b !== undefined
                                  ? String(value.product_b)
                                  : String(value)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Khuyến nghị */}
                {comparisonData.recommendation && (
                  <Card className="p-4 bg-accent/50">
                    <h3 className="font-semibold mb-2">Khuyến nghị</h3>
                    <p className="text-sm text-foreground">
                      {comparisonData.recommendation.recommended_product === 'product_a'
                        ? products[0]?.title
                        : products[1]?.title}
                      {' - '}
                      {comparisonData.recommendation.reason}
                    </p>
                  </Card>
                )}
              </div>
            ) : null}
          </div>

          <div className='w-full flex items-center justify-between px-5 py-3.5 border-t border-border'>
            <Button variant="outline" onClick={clearProducts}>
              Xóa tất cả
            </Button>
            <Button onClick={handleClose}>
              Đóng
            </Button>
          </div>
        </div>
      </motion.nav>
    </>
  );
}

