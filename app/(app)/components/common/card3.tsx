'use client';

import Link from 'next/link';
import { ShoppingCart, Star, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AxiosAPI from '@/lib/axios';
import { toast } from 'sonner';
import useSWR from 'swr';
import { configSWR } from '@/lib/utils';
import { HeartWishlist } from '../heart-wishlist';
import { calculateDiscount, formatCurrency } from '@/utils/currency';
import { useSearchParams } from 'next/navigation';
import { ChatbotStore } from '@/app/(app)/search-results/hooks/chatbot-store';
import { ComparisonStore } from '@/app/(app)/search-results/hooks/comparison-store';
import { useWishlistProducts } from '@/hooks/use-wishlist';

export function Card3({ item }: any) {
  const searchParams = useSearchParams();
  const isChatbot = searchParams.get('chatbot') === 'true';
  const { productInChatbot, setProductInChatbot }: any = ChatbotStore();
  const { addProduct, clearProducts: clearComparisonProducts } = ComparisonStore();
  const { mutate } = useSWR('/api/carts', {
    ...configSWR,
    revalidateOnMount: false,
  });
  const { listId } = useWishlistProducts();
  const addToCart = () => {
    AxiosAPI.post(`/api/carts/items`, {
      productId: item?.id,
      quantity: 1,
      unitPrice: item?.sale ? item?.sale : item?.price,
    })
      .then((res) => {
        toast.success('Đã thêm sản phẩm vào giỏ hàng');
        mutate();
      })
      .catch((err) => {
        toast.error('Không thể thêm sản phẩm vào giỏ hàng');
        console.log('err', err);
      });
  };

  const handleAddProductToChatbot = (product: any, event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (productInChatbot.length >= 2) return;

    const newProducts = [...productInChatbot, product];
    setProductInChatbot(newProducts);

    // Nếu đã có 2 sản phẩm, tự động thêm vào comparison store
    if (newProducts.length === 2) {
      clearComparisonProducts();
      addProduct(newProducts[0]);
      addProduct(newProducts[1]);
    }
  };

  return (
    <Card className="relative group">
      <CardContent className="flex items-center flex-wrap justify-between p-2 pe-5 gap-4.5">
        <div className="flex w-full items-center justify-between gap-3.5">
          <div className="flex items-center gap-3.5">
            <Card className="flex items-center justify-center bg-accent/50 h-[70px] w-[90px] shadow-none overflow-hidden shrink-0">
              <Link href={`/product-details/${item?.id}`} target="_blank" className="w-full h-full flex items-center justify-center">
                <img
                  src={item.imurl}
                  className="max-h-full max-w-full object-contain cursor-pointer"
                  alt="image"
                />
              </Link>
            </Card>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2.5 -mt-1">
                <Link
                  href={`/product-details/${item?.id}`} target="_blank" className="hover:text-primary text-sm font-medium text-mono leading-5.5">
                  {item.title}
                </Link>

                {item?.sale && (
                  <Badge size="sm" variant="destructive" className="uppercase">
                    Giảm {calculateDiscount(item?.price, item?.sale)}%
                  </Badge>
                )}
              </div>

              <div className="flex items-center flex-wrap gap-3">
                <Badge
                  size="sm"
                  variant="warning"
                  shape="circle"
                  className="rounded-full gap-1"
                >
                  <Star
                    className="text-white -mt-0.5"
                    style={{ fill: 'currentColor' }}
                  />{' '}
                  {item.rating}
                </Badge>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 mr-4">
                    {item?.sale ? (
                      <>
                        <span className="text-xs font-normal text-muted-foreground line-through">
                          {formatCurrency(item.price)}
                        </span>
                        <span className="text-sm font-bold text-red-800">
                          {formatCurrency(item.sale)}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-medium text-mono">
                        {formatCurrency(item?.price || 0)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <HeartWishlist
              productId={item?.id}
              size="icon"
              initiallyWishlisted={item?.id ? listId?.includes(item.id) : false}
            />
            <Button
              variant="outline"
              className="ms-2 shrink-0 hover:text-primary"
              onClick={addToCart}
            >
              <ShoppingCart /> Thêm vào giỏ hàng
            </Button>
            {isChatbot && (
              <Button
                variant="outline"
                className="ms-2 shrink-0 hover:text-primary"
                onClick={(event: any) => handleAddProductToChatbot(item, event)}
              >
                <Plus className="w-4 h-4 shrink-0" />
                Thêm vào chatbot
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
