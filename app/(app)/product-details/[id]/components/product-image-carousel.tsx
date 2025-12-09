'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { calculateDiscount } from '@/utils/currency';
import { cn } from '@/lib/utils';

interface ProductImageCarouselProps {
  product: any;
}

export function ProductImageCarousel({ product }: ProductImageCarouselProps) {
  // Generate multiple images from product (if product has images array, use it, otherwise use imurl)
  const images = product?.images?.length > 0 
    ? product.images.map((img: any) => img.url || img)
    : product?.imurl 
      ? [product.imurl, product.imurl, product.imurl, product.imurl, product.imurl] // Duplicate for demo
      : ['/no_photo.png'];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
  const thumbnailsPerPage = 5;

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handlePrevThumbnail = () => {
    if (thumbnailStartIndex > 0) {
      setThumbnailStartIndex(thumbnailStartIndex - 1);
    }
  };

  const handleNextThumbnail = () => {
    if (thumbnailStartIndex < images.length - thumbnailsPerPage) {
      setThumbnailStartIndex(thumbnailStartIndex + 1);
    }
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const visibleThumbnails = images.slice(thumbnailStartIndex, thumbnailStartIndex + thumbnailsPerPage);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square w-full bg-accent/50 rounded-xl border border-border overflow-hidden group">
        <Image
          src={images[selectedImageIndex] || '/no_photo.png'}
          alt={product?.title || 'Product image'}
          fill
          className="object-contain"
          unoptimized
        />
        
        {/* Sale Badge */}
        {product?.sale && (
          <Badge
            size="sm"
            variant="destructive"
            className="absolute top-4 right-4 uppercase"
          >
            Giảm {calculateDiscount(product?.price, product?.sale)}%
          </Badge>
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
              onClick={handlePrevImage}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
              onClick={handleNextImage}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex items-center gap-2">
          {thumbnailStartIndex > 0 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={handlePrevThumbnail}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="flex gap-2 flex-1 overflow-hidden">
            {visibleThumbnails.map((image: string, index: number) => {
              const actualIndex = thumbnailStartIndex + index;
              return (
                <button
                  key={actualIndex}
                  onClick={() => handleThumbnailClick(actualIndex)}
                  className={cn(
                    "relative aspect-square w-20 h-20 rounded-lg border-2 overflow-hidden transition-all shrink-0",
                    selectedImageIndex === actualIndex
                      ? "border-primary"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <Image
                    src={image || '/no_photo.png'}
                    alt={`Thumbnail ${actualIndex + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              );
            })}
          </div>

          {thumbnailStartIndex < images.length - thumbnailsPerPage && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={handleNextThumbnail}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

