/**
 * Utility functions for handling product images
 * Maps all product images to mock images from the public directory
 */

// Mock images available in public directory (prod1.jpg to prod20.jpg)
const MOCK_IMAGES = Array.from({ length: 20 }, (_, index) => `/prod${index + 1}.jpg`);
const FALLBACK_IMAGE = '/no_photo.png';

/**
 * Simple hash function to convert string to number
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Get a mock image for a product based on its ID
 * Uses hash-based mapping so the same product always gets the same image
 * but different products get different images
 */
export function getMockImageForProduct(productId: string | undefined): string {
  if (!productId) {
    return FALLBACK_IMAGE;
  }

  // Use hash to deterministically select an image based on product ID
  const hash = hashString(productId);
  const imageIndex = hash % MOCK_IMAGES.length;
  
  return MOCK_IMAGES[imageIndex];
}

/**
 * Enrich a single product with mock image
 */
export function enrichProductWithMockImage(product: any): any {
  if (!product) return product;

  const mockImage = getMockImageForProduct(product.id);
  
  // Generate additional images for gallery using product ID variations
  const additionalImages = Array.from({ length: 3 }, (_, index) => {
    const variantId = `${product.id}-img${index + 1}`;
    const hash = hashString(variantId);
    return MOCK_IMAGES[hash % MOCK_IMAGES.length];
  });
  
  return {
    ...product,
    // Store original image URL for reference
    originalImurl: product.imurl || product.imgUrl || product.imageUrl || product.image,
    // Replace with mock image
    imurl: mockImage,
    imgUrl: mockImage,
    // Also update images array if it exists
    images: product.images?.length > 0 
      ? product.images.map((img: any, index: number) => ({
          ...img,
          originalUrl: img.url,
          url: index === 0 ? mockImage : additionalImages[index - 1] || additionalImages[0]
        }))
      : [
          { url: mockImage, altText: product.title || 'Product image', order: 0 },
          ...additionalImages.map((img, idx) => ({
            url: img,
            altText: `${product.title || 'Product'} - Image ${idx + 2}`,
            order: idx + 1
          }))
        ]
  };
}

/**
 * Enrich an array of products with mock images
 */
export function enrichProductsWithMockImages(products: any[]): any[] {
  if (!Array.isArray(products)) return [];
  return products.map(product => enrichProductWithMockImage(product));
}

/**
 * Get a random mock image (for cases where we don't have a product ID)
 */
export function getRandomMockImage(): string {
  return MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)];
}

