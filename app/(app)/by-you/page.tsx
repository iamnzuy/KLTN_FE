import prisma from '@/lib/prisma';
import Content from './content';

async function getCustomizableProducts() {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL is missing. Returning empty customizable product list for build.');
    return [];
  }
  try {
    const products = await prisma.product.findMany({
      where: {
        isCustomizable: true,
        isPublished: true,
      },
      include: {
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
    return products;
  } catch (error) {
    console.error("Failed to fetch customizable products:", error);
    return [];
  }
}

const ByYouPage = async () => {
  const products = await getCustomizableProducts();
  return <Content products={products} />;
};

export default ByYouPage; 