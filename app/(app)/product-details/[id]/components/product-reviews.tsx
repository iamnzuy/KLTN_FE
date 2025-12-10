'use client';

import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Rating } from '@/app/(app)/components/rating';
import { CircularProgressBar } from './circular-progress-bar';
import dayjs from 'dayjs';

export function ProductReviews({ reviews = [], rating = 0 }: {reviews: any, rating: number}) {
  const countReviewsByRating = reviews.length > 0 ? reviews.reduce((acc: any, review: any) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {}) : {};
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  // Filter reviews based on review type
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage,
  );

  // Format total reviews
  const formatTotalReviews = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}k`.replace('.', ',');
    }
    return num.toLocaleString('vi-VN');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Đánh giá sản phẩm</h2>

      <div className="relative p-10 rounded-lg border border-dashed border-border">
        <div className="flex flex-col md:flex-row gap-8 relative z-10">
          <div className="flex gap-7 items-center justify-center p-6">
            <div className="relative w-24 h-24 flex items-center justify-center mb-3">
              <CircularProgressBar rating={rating} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-3xl font-bold text-orange-500">
                  {rating}
                </div>
              </div>
            </div>
            <div>
              <Rating rating={rating} />
              <p className="text-sm text-muted-foreground mt-2">
                từ {formatTotalReviews(reviews.length)} lượt đánh giá
              </p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 flex flex-col justify-between">
            {Array.from({ length: 5 }).map((_, index) => {
              const stars = `${5 - index}`;
              const count = countReviewsByRating[stars] || 0;
              const barWidth = count > 0 ? (count / reviews.length) * 100 : 0;

              return (
                <div key={stars} className="flex items-center gap-3">
                  <span className="text-sm w-16">{stars} sao</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {count}
                  </span>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </div>
      <div className="w-[90%]">
        {paginatedReviews.map((review: any, index: number) => (
          <div key={review.id} className={cn("py-8 space-y-3", index !== 0 && "border-t")}>
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={review?.user?.avatar || undefined} />
                <AvatarFallback>
                  {review?.user?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-2">
                  <Rating rating={review?.rating} />
                </div>

                <h4 className="font-medium text-base mb-1">{review?.comment}</h4>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-muted-foreground">
                    {review?.createdAt && `Ngày ${dayjs(review.createdAt).format('DD/MM/YYYY HH:mm')}`}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-sm font-medium">
                    {review?.username || "Khách hàng"}
                  </span>
                </div>

                {/* Engagement Buttons */}
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ThumbsUp className="h-4 w-4" />
                    {review?.likes}
                  </button>
                  <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    <ThumbsDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
            ) {
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    currentPage === page &&
                      'bg-primary hover:bg-primary/90 text-primary-foreground border-primary',
                  )}
                >
                  {page}
                </Button>
              );
            } else if (page === currentPage - 2 || page === currentPage + 2) {
              return (
                <span key={page} className="px-2">
                  ...
                </span>
              );
            }
            return null;
          })}

          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
