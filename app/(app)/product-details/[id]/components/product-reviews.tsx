'use client';

import { useState } from 'react';
import { Rating } from '@/app/(app)/components/rating';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProductReviewsProps {
  productId: string;
}

// Mock reviews data
const MOCK_REVIEWS = [
  {
    id: 1,
    user: { name: 'Nguyễn Văn A', avatar: null },
    rating: 5,
    comment: 'Giày xịn, đi êm',
    date: '2/7/2025 03:29 PM',
    likes: 128,
    dislikes: 0,
    hasImage: false,
    hasVideo: false
  },
  {
    id: 2,
    user: { name: 'Trần Thị B', avatar: null },
    rating: 5,
    comment: 'Sản phẩm chất lượng tốt, giao hàng nhanh',
    date: '1/7/2025 10:15 AM',
    likes: 45,
    dislikes: 2,
    hasImage: true,
    hasVideo: false
  },
  {
    id: 3,
    user: { name: 'Lê Văn C', avatar: null },
    rating: 4,
    comment: 'Đẹp nhưng giá hơi cao',
    date: '30/6/2025 08:45 PM',
    likes: 23,
    dislikes: 1,
    hasImage: false,
    hasVideo: false
  }
];

const RATING_DISTRIBUTION = [
  { stars: 5, count: 950 },
  { stars: 4, count: 38 },
  { stars: 3, count: 4 },
  { stars: 2, count: 0 },
  { stars: 1, count: 0 }
];

const TOPICS = [
  'Chất lượng sản phẩm',
  'Dịch vụ người bán',
  'Giá tiền',
  'Giao hàng'
];

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [reviewType, setReviewType] = useState<'all' | 'with-media' | 'with-description'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  const toggleStar = (star: number) => {
    setSelectedStars(prev => 
      prev.includes(star) 
        ? prev.filter(s => s !== star)
        : [...prev, star]
    );
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  // Filter reviews based on selected filters
  let filteredReviews = MOCK_REVIEWS;
  
  if (selectedStars.length > 0) {
    filteredReviews = filteredReviews.filter(r => selectedStars.includes(r.rating));
  }
  
  if (reviewType === 'with-media') {
    filteredReviews = filteredReviews.filter(r => r.hasImage || r.hasVideo);
  } else if (reviewType === 'with-description') {
    filteredReviews = filteredReviews.filter(r => r.comment && r.comment.length > 0);
  }

  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  const averageRating = 4.5;
  const totalReviews = 1250;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Đánh giá sản phẩm</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Filters */}
        <div className="lg:col-span-1 space-y-6">
          {/* Overall Rating */}
          <div className="text-center p-6 bg-accent/50 rounded-lg">
            <div className="text-4xl font-bold text-foreground mb-2">{averageRating}</div>
            <Rating rating={averageRating} />
            <p className="text-sm text-muted-foreground mt-2">
              từ {totalReviews.toLocaleString('vi-VN')} lượt đánh giá
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-3">
            <h3 className="font-semibold">Phân bố đánh giá</h3>
            {RATING_DISTRIBUTION.map(({ stars, count }) => (
              <div key={stars} className="flex items-center gap-2">
                <span className="text-sm w-12">{stars} sao</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(count / totalReviews) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">{count}</span>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <h3 className="font-semibold">Lọc đánh giá</h3>
            
            {/* Star Filter */}
            <div>
              <h4 className="text-sm font-medium mb-2">Số sao</h4>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(star => (
                  <label key={star} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedStars.includes(star)}
                      onChange={() => toggleStar(star)}
                      className="rounded"
                    />
                    <span className="text-sm">
                      {'★'.repeat(star)} {star}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Topic Filter */}
            <div>
              <h4 className="text-sm font-medium mb-2">Chủ đề</h4>
              <div className="space-y-2">
                {TOPICS.map(topic => (
                  <label key={topic} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTopics.includes(topic)}
                      onChange={() => toggleTopic(topic)}
                      className="rounded"
                    />
                    <span className="text-sm">{topic}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Reviews */}
        <div className="lg:col-span-3 space-y-4">
          {/* Review Type Tabs */}
          <div className="flex gap-2 border-b">
            <button
              onClick={() => setReviewType('all')}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                reviewType === 'all'
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Tất cả
            </button>
            <button
              onClick={() => setReviewType('with-media')}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                reviewType === 'with-media'
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Có ảnh / video
            </button>
            <button
              onClick={() => setReviewType('with-description')}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                reviewType === 'with-description'
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              Có mô tả
            </button>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {paginatedReviews.map(review => (
              <div key={review.id} className="border-b pb-4 space-y-2">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={review.user.avatar || undefined} />
                    <AvatarFallback>
                      {review.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{review.user.name}</span>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    <div className="mb-2">
                      <Rating rating={review.rating} />
                    </div>
                    <p className="text-sm text-foreground mb-2">{review.comment}</p>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                        <ThumbsUp className="h-4 w-4" />
                        {review.likes}
                      </button>
                      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                        <ThumbsDown className="h-4 w-4" />
                        {review.dislikes}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2">...</span>;
                }
                return null;
              })}
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

