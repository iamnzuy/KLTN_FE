import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Customizer from './components/customizer';

interface CustomizerPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getProductBySlug(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        slug: slug,
        isCustomizable: true,
      },
      include: {
        customizableParts: true,
      },
    });
    return product;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

const CustomizerPage = async ({ params }: CustomizerPageProps) => {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <Customizer product={product} />;
};

export default CustomizerPage; 