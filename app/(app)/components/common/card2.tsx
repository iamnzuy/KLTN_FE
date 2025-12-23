'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { formatCurrency } from '@/utils/currency';
import { Plus, ShoppingCart, Star, Scale } from 'lucide-react';
import useSWR from 'swr';
import AxiosAPI from '@/lib/axios';
import { configSWR } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HeartWishlist } from '../heart-wishlist';
import { useSearchParams } from 'next/navigation';
import { ChatbotStore } from '../../search-results/hooks/chatbot-store';
import { ComparisonStore } from '@/app/(app)/search-results/hooks/comparison-store';
import { useStoreClient } from '../context';

export function Card2({ item }: any) {
  const searchParams = useSearchParams();
  const isChatbot = searchParams.get('chatbot') === 'true';
  const { mutate } = useSWR('/api/carts', {
    ...configSWR,
    revalidateOnMount: false,
  });
  const { data: wishlistData } = useSWR('/api/products/wishlist', {
    ...configSWR,
    revalidateOnMount: false,
  });
  const { productInChatbot, setProductInChatbot }: any = ChatbotStore();
  const { addProduct, products: comparisonProducts, canAddProduct, clearProducts: clearComparisonProducts } = ComparisonStore();
  const { showComparisonSheet } = useStoreClient();

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

  const handleAddToComparison = (product: any, event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (canAddProduct()) {
      addProduct(product);
    }
    // Không cần mở sheet nữa, sẽ tự động chuyển tab trong search-results
  };

  const wishlistIds = useMemo(() => {
    const wishlistItems = wishlistData?.data;
    if (!Array.isArray(wishlistItems)) {
      return new Set<string>();
    }
    return new Set(wishlistItems.map((wishlistItem: any) => wishlistItem.productId));
  }, [wishlistData?.data]);

  const initiallyWishlisted = item?.id ? wishlistIds.has(item.id) : false;

  const addToCart = () => {
    AxiosAPI.post(`/api/carts/items`, {
      productId: item?.id,
      quantity: 1,
      unitPrice: item?.sale ? item?.sale : item?.price,
    })
      .then((res) => {
        console.log('res', res);
        mutate();
      })
      .catch((err) => {
        console.log('err', err);
      });
  };
  return (
    <>
      <Card>
        <CardContent className="flex flex-col justify-between p-2.5 gap-4 max-w-[327px] group">
          <Link href={`/product-details/${item?.id}`} target="_blank" className="mb-2.5">
            <Card className="flex items-center justify-center relative bg-accent/50 w-full h-[180px] mb-4 shadow-none">
              <HeartWishlist
                size="icon"
                className="absolute top-2 left-2"
                productId={item?.id}
                initiallyWishlisted={initiallyWishlisted}
              />
              {/* {item?.sale && (
                <Badge
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 uppercase"
                >
                  save ${calculateDiscount(item?.price, item?.sale)}%
                </Badge>
              )} */}
              {isChatbot && (
                <div onClick={(event) => handleAddProductToChatbot(item, event)} className="absolute flex gap-0 items-center top-2 right-2 min-w-8 min-h-8 justify-center bg-background/80 rounded-full p-1 border overflow-hidden transition-all duration-300 group-hover:gap-2 group-hover:px-3">
                  <Plus className="w-4 h-4 shrink-0 group-hover:text-primary" />
                  <div className="text-sm font-medium text-mono whitespace-nowrap opacity-0 max-w-0 transition-all group-hover:text-primary duration-500 ease-in-out group-hover:opacity-100 group-hover:max-w-[200px]">
                    Thêm vào chatbot
                  </div>
                </div>
              )}

              <Image
                src={item?.imurl}
                className="h-[180px] shrink-0 cursor-pointer"
                alt="image"
                unoptimized={true}
                width={180}
                height={180}
              />
            </Card>

            <div
              className="hover:text-primary text-sm font-medium text-mono px-2.5 leading-5.5 block"
            >
              {item?.title}
            </div>
          </Link>

          <div className="flex items-center justify-between px-2.5 pb-1">
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
              {item?.averageRating}
            </Badge>

            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium text-mono">
                {formatCurrency(item?.price)}
              </span>

              <Button
                size="sm"
                variant="outline"
                className="ms-1"
                onClick={addToCart}
              >
                <ShoppingCart /> Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
