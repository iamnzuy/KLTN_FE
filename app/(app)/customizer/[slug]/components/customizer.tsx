'use client';

import { Product, CustomizablePart } from '@prisma/client';
import React, { useState } from 'react';
import CanvasViewer from './canvas-viewer';
import Controls from './controls';

type ProductWithParts = Product & {
  customizableParts: CustomizablePart[];
};

interface CustomizerProps {
  product: ProductWithParts;
}

const Customizer = ({ product }: CustomizerProps) => {
  const [partColors, setPartColors] = useState<Record<string, string>>(() => {
    const initialColors: Record<string, string> = {};
    product.customizableParts.forEach((part) => {
      initialColors[part.meshName] = part.defaultColor || '#ffffff';
    });
    return initialColors;
  });

  const handleColorChange = (meshName: string, color: string) => {
    setPartColors((prevColors) => ({
      ...prevColors,
      [meshName]: color,
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 h-full">
      {/* Controls Panel */}
      <div className="md:col-span-1 p-6 border-r overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">Customize {product.name}</h2>
        <Controls
          parts={product.customizableParts}
          colors={partColors}
          onColorChange={handleColorChange}
        />
      </div>

      {/* 3D Canvas Viewer */}
      <div className="md:col-span-2 relative">
        <CanvasViewer modelPath={product.modelPath!} partColors={partColors} />
      </div>
    </div>
  );
};

export default Customizer; 