'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Product, ProductImage } from '@prisma/client';

// Define a type for our product prop that includes the primary image
type ProductWithImage = Product & {
  images: ProductImage[];
};

interface ContentProps {
  products: ProductWithImage[];
}

const Content = ({ products }: ContentProps) => {
  if (!products || products.length === 0) {
    return (
      <div className='container py-10 text-center'>
        <h2 className='text-2xl font-semibold'>No Customizable Products Found</h2>
        <p className='text-muted-foreground mt-2'>
          Please check back later or contact support if you believe this is an error.
        </p>
      </div>
    );
  }

  return (
    <div className='container py-10'>
      <div className='mb-8 text-center'>
        <h1 className='text-4xl font-bold'>By You: Customize Your Gear</h1>
        <p className='text-lg text-muted-foreground mt-2'>
          Select a model to start your unique design journey.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {products.map((product) => {
          const primaryImage = product.images.find(img => img.order === 1) || product.images[0];
          return (
            <Card key={product.id}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='aspect-square relative bg-gray-100 rounded-md'>
                  {primaryImage ? (
                    <Image
                      src={primaryImage.url}
                      alt={product.name}
                      fill
                      className='object-cover'
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>
                <p className='mt-4 font-semibold text-lg'>${product.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter>
                <Link href={`/customizer/${product.slug}`} passHref legacyBehavior>
                  <Button className='w-full'>Customize</Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Content; 