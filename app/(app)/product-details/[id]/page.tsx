'use client';

import { useParams } from 'next/navigation';
import { ProductDetailsContent } from './content';

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params?.id as string;

  return (
    <div className="container mx-auto px-4 py-6">
      <ProductDetailsContent productId={productId} />
    </div>
  );
}

