'use client';

import { ReactNode, useState } from 'react';
import { RiMoneyDollarCircleLine } from '@remixicon/react';
import { Info, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input, InputAddon, InputGroup } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface FilterState {
  status: 'All' | 'Sale' | 'New' | 'Trend';
  minPrice: string;
  maxPrice: string;
  selectedCategories: string[];
  selectedRatings: number[];
}

const items = [
  { label: 'Sneakers' },
  { label: 'Running Shoes' },
  { label: 'Boots' },
  { label: 'Golf' },
  { label: 'Sandals' },
  { label: 'Work Shoes' },
  { label: 'Casual Wear' },
  { label: 'Outdoor Gear' },
  { label: 'Sportswear' },
  { label: 'Chelsea Boots' },
  { label: 'Loafers' },
  { label: 'Slip-On' },
  { label: 'Winter' },
  { label: 'Espadrilles' },
  { label: 'Basketball' },
];

const ratings = [
  { number: 5 },
  { number: 4 },
  { number: 3 },
  { number: 2 },
  { number: 1 },
];

interface StoreClientFiltersSheetProps {
  trigger: ReactNode;
  onApplyFilters?: (filters: FilterState) => void;
}

export function StoreClientFiltersSheet({ trigger, onApplyFilters }: StoreClientFiltersSheetProps) {
  const [activePeriod, setActivePeriod] = useState<'All' | 'Sale' | 'New' | 'Trend'>('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryClick = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleRatingChange = (rating: number, checked: boolean) => {
    setSelectedRatings(prev => 
      checked 
        ? [...prev, rating]
        : prev.filter(r => r !== rating)
    );
  };

  const handleReset = () => {
    setActivePeriod('All');
    setMinPrice('');
    setMaxPrice('');
    setSelectedCategories([]);
    setSelectedRatings([]);
  };

  const handleApply = () => {
    const filters: FilterState = {
      status: activePeriod,
      minPrice,
      maxPrice,
      selectedCategories,
      selectedRatings,
    };
    onApplyFilters?.(filters);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="sm:w-[320px] sm:max-w-none inset-5 start-auto h-auto rounded-lg p-0 [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">
        <SheetHeader className="border-b py-3.5 px-5 border-border">
          <SheetTitle>Filter</SheetTitle>
        </SheetHeader>
        <SheetBody className="py-0">
          <ScrollArea className="h-[calc(100dvh-11.5rem)] pe-3 -me-3">
            <div className="flex items-center gap-1 mb-3 px-5">
              <span className="text-sm font-medium text-mono">Status</span>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="text-muted-foreground size-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Get detailed information.</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <ToggleGroup
              type="single"
              variant="outline"
              value={activePeriod}
              onValueChange={(value) => {
                if (value) setActivePeriod(value);
              }}
              className="grid grid-cols-4 mx-5"
            >
              {['All', 'Sale', 'New', 'Trend'].map((period) => (
                <ToggleGroupItem key={period} value={period}>
                  {period}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>

            <div className="border-b border-border mb-4 mt-5"></div>

            <div className="flex flex-col gap-2.5 px-5">
              <span className="text-sm font-medium text-mono">Price</span>

              <InputGroup>
                <InputAddon mode="icon">
                  <RiMoneyDollarCircleLine />
                </InputAddon>
                <Input 
                  placeholder="Min price" 
                  type="number" 
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </InputGroup>

              <InputGroup>
                <InputAddon mode="icon">
                  <RiMoneyDollarCircleLine />
                </InputAddon>
                <Input 
                  placeholder="Max price" 
                  type="number" 
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </InputGroup>
            </div>

            <div className="border-b border-border mb-4 mt-5"></div>

            <div className="flex flex-col gap-3 px-5">
              <span className="text-sm font-medium text-mono">Categories</span>

              <div className="flex flex-wrap gap-2.5 mb-2">
                {items.map((item, index) => (
                  <Badge
                    key={item.label ?? index}
                    size="sm"
                    shape="circle"
                    className={`border-border px-2 py-2.5 cursor-pointer transition-colors ${
                      selectedCategories.includes(item.label)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-accent/50 hover:bg-accent'
                    }`}
                    onClick={() => handleCategoryClick(item.label)}
                  >
                    {item.label}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="border-b border-border mt-3 mb-4"></div>

            <div className="flex flex-col gap-3 lg:mb-10 px-5">
              <span className="text-sm font-medium text-mono">Rating</span>

              <div className="flex flex-col gap-2.5">
                {ratings.map((rating) => (
                  <div key={rating.number} className="flex items-center gap-2">
                    <Checkbox
                      id={`rating-${rating.number}`}
                      checked={selectedRatings.includes(rating.number)}
                      onCheckedChange={(checked) => 
                        handleRatingChange(rating.number, checked as boolean)
                      }
                    />
                    <label 
                      htmlFor={`rating-${rating.number}`}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <Star
                        className="text-yellow-400 -mt-[1px] w-4 h-4"
                        fill="currentColor"
                      />
                      <span className="text-sm font-medium text-mono">
                        {rating.number}+
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </SheetBody>
        <SheetFooter className="border-t py-3.5 px-5 border-border flex gap-3">
          <Button 
            variant="outline" 
            className="justify-center basis-1/2"
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button 
            variant="primary" 
            className="justify-center basis-1/2"
            onClick={handleApply}
          >
            Apply
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
