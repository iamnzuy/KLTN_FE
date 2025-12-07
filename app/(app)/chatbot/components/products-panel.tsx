'use client';

import { TopProduct } from '@/components/chatbot/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Sparkles } from 'lucide-react';
import { useStoreClient } from '@/app/(app)/components/context';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/hooks/use-cart';
import { useBackendUserId } from '@/lib/user-mapping';
import { toast } from 'sonner';
import { useState } from 'react';

interface ProductsPanelProps {
  products: TopProduct[];
  isLoading: boolean;
}

export function ProductsPanel({ products, isLoading }: ProductsPanelProps) {
  const { showCartSheet, showProductDetailsSheet, handleAddToCart } = useStoreClient();
  const backendUserId = useBackendUserId();
  const { addToCart: addToCartAPI, loading: cartLoading } = useCart(backendUserId);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
  };

  const handleAddProductToCart = async (product: TopProduct) => {
    if (!backendUserId) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      return;
    }

    setAddingProductId(product.id);
    try {
      const result = await addToCartAPI(product.id, 1, product.price);
      
      if (result.success) {
        toast.success('Đã thêm sản phẩm vào giỏ hàng', {
          description: product.title,
        });
        // Open cart sheet and trigger context action
        handleAddToCart({ productId: product.id });
        showCartSheet();
      } else {
        toast.error('Không thể thêm sản phẩm vào giỏ hàng', {
          description: result.error || 'Đã xảy ra lỗi',
        });
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi', {
        description: error instanceof Error ? error.message : 'Không thể thêm sản phẩm vào giỏ hàng',
      });
    } finally {
      setAddingProductId(null);
    }
  };

  if (isLoading && products.length === 0) {
    return (
      <Card className="h-full flex flex-col shadow-lg">
        <div className="h-16 bg-gradient-to-r from-primary/10 to-primary/5 flex items-center justify-between px-6 flex-shrink-0 rounded-t-xl border-b">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-base">Sản phẩm gợi ý</h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-4">
                  <Skeleton className="w-full aspect-square mb-3" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (products.length === 0) {
    return (
      <Card className="h-full flex flex-col shadow-lg">
        <div className="h-16 bg-gradient-to-r from-primary/10 to-primary/5 flex items-center justify-between px-6 flex-shrink-0 rounded-t-xl border-b">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-base">Sản phẩm gợi ý</h2>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-muted-foreground">
            <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Chưa có sản phẩm nào</p>
            <p className="text-xs mt-1">Hãy bắt đầu trò chuyện với AI để xem gợi ý</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col shadow-lg">
      {/* Header */}
      <div className="h-16 bg-gradient-to-r from-primary/10 to-primary/5 flex items-center justify-between px-6 flex-shrink-0 rounded-t-xl border-b">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-base">Sản phẩm gợi ý</h2>
          <Badge variant="secondary" size="sm" className="ml-2">
            {products.length}
          </Badge>
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-primary/5 hover:scrollbar-thumb-primary/60">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {products.map((product, index) => (
              <motion.div
                key={`${product.id}-${index}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.3,
                  delay: Math.min(index * 0.05, 1),
                  ease: [0.4, 0, 0.2, 1],
                }}
                layout
              >
                <Card className="overflow-hidden hover:shadow-md transition-all duration-300 border-2 hover:border-primary/20 group h-full flex flex-col">
                  <CardContent className="p-4 flex flex-col h-full">
                    {/* Product Image Placeholder */}
                    <div className="w-full aspect-square mb-3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                      <ShoppingCart className="w-12 h-12 text-primary/40" />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 flex flex-col">
                      <h3
                        onClick={() => showProductDetailsSheet(product.id)}
                        className="font-semibold text-sm mb-2 line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                      >
                        {product.title}
                      </h3>

                      <div className="flex items-center gap-2 mb-3">
                        <Badge
                          size="sm"
                          variant="warning"
                          shape="circle"
                          className="rounded-full gap-1"
                        >
                          <Star
                            className="w-3 h-3 text-white"
                            style={{ fill: 'currentColor' }}
                          />
                          {product.average_rating.toFixed(1)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          ID: {product.id}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-auto">
                        <span className="text-base font-bold text-primary">
                          {formatPrice(product.price)}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddProductToCart(product)}
                          disabled={addingProductId === product.id || cartLoading}
                          className="group/btn hover:bg-primary hover:text-primary-foreground transition-colors"
                        >
                          <ShoppingCart className="w-3.5 h-3.5 mr-1.5 group-hover/btn:scale-110 transition-transform" />
                          {addingProductId === product.id ? 'Đang thêm...' : 'Thêm'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}

