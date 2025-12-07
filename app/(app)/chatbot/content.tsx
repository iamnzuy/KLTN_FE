'use client';

import { useState } from 'react';
import { ChatbotPanel } from './components/chatbot-panel';
import { ProductsPanel } from './components/products-panel';
import { TopProduct } from '@/components/chatbot/types';
import { motion } from 'framer-motion';

export function ChatbotPageContent() {
  const [products, setProducts] = useState<TopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleProductsUpdate = (newProducts: TopProduct[]) => {
    setProducts(newProducts);
  };

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <div className="h-full min-h-0 flex flex-col">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
        className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4 overflow-hidden"
    >
      {/* Products Panel - Left Side */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
          className="flex-1 min-w-0 min-h-0 flex flex-col"
      >
        <ProductsPanel products={products} isLoading={isLoading} />
      </motion.div>

      {/* Chatbot Panel - Right Side */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full lg:w-[480px] flex-shrink-0 min-h-0 flex flex-col"
      >
        <ChatbotPanel
          onProductsUpdate={handleProductsUpdate}
          onLoadingChange={handleLoadingChange}
        />
      </motion.div>
    </motion.div>
    </div>
  );
}

