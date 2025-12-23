'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Loader2, Check, ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { formatCurrency } from '@/utils/currency';
import { Rating } from '@/app/(app)/components/rating';
import { ComparisonStore } from '@/app/(app)/search-results/hooks/comparison-store';
import { ChatbotStore } from '@/app/(app)/search-results/hooks/chatbot-store';
import { AxiosChatbot } from '@/lib/axios';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export function ComparisonView() {
  const { products, removeProduct, clearProducts, comparisonData: cachedData, productsKey, setComparisonData } = ComparisonStore();
  const addPendingMessage = ChatbotStore((state: any) => state.addPendingMessage);
  const searchParams = useSearchParams();
  const isChatbotOpen = !!searchParams.get("chatbot");
  const [comparisonData, setComparisonDataLocal] = useState<any>(cachedData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastRequestedKeyRef = useRef<string | null>(null);

  // Tạo key để check cache
  const currentKey = products.length === 2 ? `${products[0].id}-${products[1].id}` : null;
  const hasValidCache = cachedData && productsKey === currentKey && products.length === 2;

  // Sync cached data khi có thay đổi
  useEffect(() => {
    if (hasValidCache && cachedData) {
      setComparisonDataLocal(cachedData);
      setError(null);
      setIsLoading(false);
    }
  }, [cachedData, hasValidCache]);

  useEffect(() => {
    if (hasValidCache) {
      lastRequestedKeyRef.current = currentKey;
      return; // Đã xử lý ở useEffect trên
    }
    
    if (products.length === 2 && currentKey) {
      if (lastRequestedKeyRef.current === currentKey) {
        return; // Ngăn gọi lặp lại cùng một cặp sản phẩm (vd: StrictMode)
      }

      lastRequestedKeyRef.current = currentKey;
      fetchComparison();
    } else {
      setComparisonDataLocal(null);
      setError(null);
      setIsLoading(false);
      lastRequestedKeyRef.current = null;
    }
  }, [products.length, currentKey, productsKey, hasValidCache]);

  const fetchComparison = async () => {
    if (products.length !== 2) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await AxiosChatbot.post('/compare', {
        product_a_id: products[0].id,
        product_b_id: products[1].id,
      });

      setComparisonDataLocal(response.data);
      setComparisonData(response.data, currentKey);

      // Gửi summary vào chatbot nếu chatbot đang mở và chưa gửi
      if (isChatbotOpen && response.data.summary && !hasValidCache) {
        const summaryMessage = `💡 **So sánh ${products[0].title} và ${products[1].title}:**\n\n${response.data.summary}\n\n${response.data.follow_up || ''}`;
        addPendingMessage({
          role: "assistant",
          reply: summaryMessage,
          products: [],
          comparisonData: response.data
        });
      }
    } catch (err: any) {
      console.error('Error fetching comparison:', err);
      setError(err.response?.data?.error || 'Không thể so sánh sản phẩm. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  if (products.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center gap-4 p-8">
        <div className="w-20 h-20 rounded-full bg-accent/50 flex items-center justify-center">
          <ArrowUpDown className="w-10 h-10 text-muted-foreground" />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Chưa có sản phẩm để so sánh</h3>
          <p className="text-sm text-muted-foreground">
            Vui lòng chọn 2 sản phẩm để so sánh. Bạn có thể thêm sản phẩm từ kết quả tìm kiếm hoặc từ chatbot.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Hiện tại: {products.length}/2 sản phẩm</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Đang so sánh sản phẩm...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4 text-center p-8">
        <X className="w-8 h-8 text-destructive" />
        <p className="text-destructive">{error}</p>
        <Button onClick={fetchComparison} variant="outline">
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Products Comparison Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {products.map((product, index) => {
          const ribbonText = index === 0 ? 'Sản phẩm A' : 'Sản phẩm B';
          const accentRing = index === 0 ? 'ring-primary/30' : 'ring-accent/30';
          const gradient = index === 0
            ? 'from-primary/10 via-background to-background'
            : 'from-accent/20 via-background to-background';

          return (
            <Card
              key={product.id}
              className={`group relative overflow-hidden border border-border/70 bg-card/95 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl`}
            >
              <div className="absolute inset-x-6 top-6 flex items-center justify-between text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <Badge variant="secondary" className="rounded-full border border-border/70 bg-transparent px-3 py-1 text-[11px] text-muted-foreground">
                  {ribbonText}
                </Badge>
                {product.brand && (
                  <Badge variant="secondary" className="rounded-full border border-border/70 bg-background/80 px-3 py-1 text-[11px]">
                    {product.brand}
                  </Badge>
                )}
              </div>

              <div className="flex flex-col gap-5 pt-10">
                {/* Header with remove button */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <Link href={`/product-details/${product.id}`} target="_blank">
                      <h3 className="text-lg font-semibold leading-tight text-foreground transition-colors hover:text-primary line-clamp-2">
                        {product.title}
                      </h3>
                    </Link>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Rating rating={product.averageRating || 0} />
                        <span>{product.averageRating?.toFixed(1) || '0.0'}</span>
                      </div>
                      {product.category && (
                        <Badge variant="secondary" className="rounded-full border border-border/60 bg-transparent px-3 py-0.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                          {product.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="h-7 w-7 shrink-0 rounded-full bg-gray-500/90 hover:bg-red-500 text-white shadow-sm transition-colors duration-150 flex items-center justify-center"
                    aria-label="Xóa sản phẩm"
                    title="Xóa"
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={3} />
                  </button>
                </div>

                {/* Product Image */}
                <div className={`relative flex h-64 w-full items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} ring-1 ring-inset ${accentRing}`}>
                  <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 transition group-hover:opacity-100" />
                  <Image
                    src={product.imurl || ''}
                    alt={product.title || ''}
                    fill
                    className="object-contain p-6"
                    unoptimized
                  />
                </div>

                {/* Price */}
                <div className="rounded-2xl border border-dashed border-border/70 bg-muted/30 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Giá tốt nhất
                  </p>
                  <div className="mt-2 flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-primary">
                      {formatCurrency(product.sale || product.price || 0)}
                    </span>
                    {product.sale && product.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        {formatCurrency(product.price)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link href={`/product-details/${product.id}`} target="_blank" className="flex-1">
                    <Button variant="secondary" className="w-full rounded-xl border-border/80">
                      Xem chi tiết
                    </Button>
                  </Link>
                  <Button className="flex-1 rounded-xl shadow-md">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Thêm vào giỏ
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Detailed Comparison Table */}
      {comparisonData?.comparison && (
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5" />
            So sánh chi tiết
          </h3>
          <div className="overflow-hidden rounded-2xl border border-border/70 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr className="divide-x divide-border/60">
                    <th className="sticky left-0 bg-muted/50 px-5 py-4 text-left font-semibold">
                      Tiêu chí
                    </th>
                    <th className="min-w-[220px] px-5 py-4 text-center font-semibold">
                      {products[0]?.title}
                    </th>
                    <th className="min-w-[220px] px-5 py-4 text-center font-semibold">
                      {products[1]?.title}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(comparisonData.comparison).map(([key, value]: [string, any], idx) => {
                    // Backend trả về format {"a": ..., "b": ...}
                    const productAValue: any = typeof value === 'object' && value.a !== undefined
                      ? value.a
                      : typeof value === 'object' && value.product_a !== undefined
                      ? value.product_a
                      : value;
                    const productBValue: any = typeof value === 'object' && value.b !== undefined
                      ? value.b
                      : typeof value === 'object' && value.product_b !== undefined
                      ? value.product_b
                      : value;
                    
                    // Format dữ liệu theo loại
                    const formatValue = (val: any, key: string): string => {
                      if (val === null || val === undefined) return 'N/A';
                      
                      // Format giá tiền
                      if (key === 'price') {
                        const num = typeof val === 'number' ? val : parseFloat(String(val));
                        if (!isNaN(num)) {
                          return formatCurrency(num);
                        }
                      }
                      
                      // Format rating
                      if (key === 'rating') {
                        const num = typeof val === 'number' ? val : parseFloat(String(val));
                        if (!isNaN(num)) {
                          return `${num.toFixed(1)} ⭐`;
                        }
                      }
                      
                      // Format battery (thêm mAh)
                      if (key === 'battery') {
                        const num = typeof val === 'number' ? val : parseFloat(String(val));
                        if (!isNaN(num)) {
                          return `${num} mAh`;
                        }
                      }
                      
                      // Format screen (thêm inch)
                      if (key === 'screen') {
                        const num = typeof val === 'number' ? val : parseFloat(String(val));
                        if (!isNaN(num)) {
                          return `${num}"`;
                        }
                      }
                      
                      return String(val);
                    };
                    
                    const formattedA = formatValue(productAValue, key);
                    const formattedB = formatValue(productBValue, key);
                    
                    // So sánh số nếu có thể
                    const numA = typeof productAValue === 'number' ? productAValue : parseFloat(String(productAValue));
                    const numB = typeof productBValue === 'number' ? productBValue : parseFloat(String(productBValue));
                    const isNumeric = !isNaN(numA) && !isNaN(numB);
                    const isBetter = isNumeric ? numA !== numB : formattedA !== formattedB;
                    const aIsBetter = isNumeric && numA > numB;
                    const bIsBetter = isNumeric && numB > numA;
                    
                    // Map key sang tiếng Việt
                    const keyMap: Record<string, string> = {
                      price: 'Giá',
                      rating: 'Đánh giá',
                      battery: 'Pin',
                      chipset: 'Chipset',
                      screen: 'Màn hình',
                    };
                    
                    const badgeClass = (isWinner: boolean) =>
                      isWinner
                        ? 'bg-primary/10 text-primary font-semibold shadow-inner ring-1 ring-primary/20'
                        : 'text-foreground';

                    return (
                      <tr key={key} className={`border-t ${idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}>
                        <td className="sticky left-0 bg-inherit px-5 py-4 text-sm font-medium text-foreground">
                          <span className="rounded-full bg-muted/60 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            {keyMap[key] || key}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm">
                          <div className={`rounded-2xl px-4 py-2 text-center transition ${badgeClass(isBetter && aIsBetter)}`}>
                            {formattedA}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm">
                          <div className={`rounded-2xl px-4 py-2 text-center transition ${badgeClass(isBetter && bIsBetter)}`}>
                            {formattedB}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      {/* Recommendation */}
      {comparisonData?.recommendation && (
        <Card className="p-6 bg-accent/30 border-primary/20">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Check className="w-5 h-5 text-primary" />
            Khuyến nghị
          </h3>
          <div className="space-y-2">
            <p className="text-sm text-foreground">
              <span className="font-semibold text-primary">
                {comparisonData.recommendation.recommended_product === 'product_a'
                  ? products[0]?.title
                  : products[1]?.title}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              {comparisonData.recommendation.reason}
            </p>
          </div>
        </Card>
      )}

      {/* Clear Button */}
      <div className="flex justify-end pt-4 border-t">
        <Button variant="outline" onClick={clearProducts}>
          <X className="w-4 h-4 mr-2" />
          Xóa tất cả
        </Button>
      </div>
    </div>
  );
}

