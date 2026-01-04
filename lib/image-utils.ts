/**
 * Utility functions for handling product images
 * Maps all product images to mock images from the public directory
 */

// Mock images available in public directory (prod1.jpg to prod20.jpg)
const MOCK_IMAGES = Array.from({ length: 20 }, (_, index) => `/prod${index + 1}.jpg`);
const FALLBACK_IMAGE = '/no_photo.png';

// Shuffle function for randomization
function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Create a consistent mapping from product ID to image
const productImageMap = new Map<string, string>();
let shuffledImages = shuffleArray([...MOCK_IMAGES]);
let imageIndex = 0;

/**
 * Get a mock image for a product based on its ID
 * Uses consistent mapping so the same product always gets the same image
 */
export function getMockImageForProduct(productId: string | undefined): string {
  if (!productId) {
    return FALLBACK_IMAGE;
  }

  // Check if we already have a mapping for this product
  if (productImageMap.has(productId)) {
    return productImageMap.get(productId)!;
  }

  // Assign a new image from the shuffled pool
  const mockImage = shuffledImages[imageIndex % shuffledImages.length];
  productImageMap.set(productId, mockImage);
  imageIndex++;

  // Reshuffle when we've used all images
  if (imageIndex >= shuffledImages.length * 2) {
    shuffledImages = shuffleArray([...MOCK_IMAGES]);
    imageIndex = 0;
  }

  return mockImage;
}

/**
 * Enrich a single product with mock image
 */
export function enrichProductWithMockImage(product: any): any {
  if (!product) return product;

  const mockImage = getMockImageForProduct(product.id);
  
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
          url: index === 0 ? mockImage : MOCK_IMAGES[(imageIndex + index) % MOCK_IMAGES.length]
        }))
      : [{ url: mockImage, altText: product.title || 'Product image', order: 0 }]
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

/**
 * Reset the image mapping (useful for testing)
 */
export function resetImageMapping(): void {
  productImageMap.clear();
  shuffledImages = shuffleArray([...MOCK_IMAGES]);
  imageIndex = 0;
}

