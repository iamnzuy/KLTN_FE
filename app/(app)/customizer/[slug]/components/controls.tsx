import { CustomizablePart } from '@prisma/client';
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ControlsProps {
  parts: CustomizablePart[];
  colors: Record<string, string>;
  onColorChange: (meshName: string, color: string) => void;
}

const Controls = ({ parts, colors, onColorChange }: ControlsProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Customize</h2>
      <div className="space-y-4">
        {parts.map((part) => (
          <div key={part.id}>
            <Label htmlFor={`${part.meshName}-color`}>{part.name}</Label>
            <Input
              type="color"
              id={`${part.meshName}-color`}
              value={colors[part.meshName]}
              onChange={(e) => onColorChange(part.meshName, e.target.value)}
              className="w-full h-10 p-1"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Controls; 