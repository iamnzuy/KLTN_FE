'use client';

import { useState, useEffect } from 'react';
import { Funnel, LayoutGrid, List, Search as SearchIcon, Scale } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card2 } from '@/app/(app)/components/common/card2';
import { Card3 } from '@/app/(app)/components/common/card3';
import { StoreClientFiltersSheet, FilterState } from '@/app/(app)/components/sheets/filters-sheet';
import { ComparisonView } from './comparison-view';
import AxiosAPI from '@/lib/axios';
import ChatWindow from '@/components/chatbot/components/chat-window';
import { useSearchParams } from 'next/navigation';
import { cn, configSWR } from '@/lib/utils';
import Selection from '@/components/selection';
import useSWR from 'swr';
import { useDebounceCallback } from 'usehooks-ts';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable-panel';
import { ComparisonStore } from '@/app/(app)/search-results/hooks/comparison-store';

export function SearchResults() {
  const searchParams = useSearchParams();
  const isChatbotOpen = !!searchParams.get("chatbot");

  const [searchInput, setSearchInput] = useState(searchParams.get("q") || '');
  const [activePeriod, setActivePeriod] = useState('Week');
  const [activeTab, setActiveTab] = useState<'card' | 'list'>("card");
  const [activeViewTab, setActiveViewTab] = useState<'results' | 'comparison'>('results');
  const [chatbotProducts, setChatbotProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState | null>(null);
  
  const { products: comparisonProducts } = ComparisonStore();

  const productsSWRKey = searchInput ? `/api/products/search?title=${searchInput}` : '/api/products?page=1&page_size=24';

  const { data } = useSWR(productsSWRKey, configSWR);
  const products = data?.data?.content;

  const handleSearch = useDebounceCallback((value: string) => {
    setSearchInput(value);
    setIsFiltering(false);
    setActiveFilters(null);
  }, 2000);

  const handleApplyFilters = async (filters: FilterState) => {
    try {
      setIsFiltering(true);
      setActiveFilters(filters);

      // Build filter request
      const filterRequest: any = {};

      // Add keyword if searching
      if (searchInput) {
        filterRequest.keyword = searchInput;
      }

      // Add categories
      if (filters.selectedCategories.length > 0) {
        filterRequest.categories = filters.selectedCategories;
      }

      // Add price range
      if (filters.minPrice) {
        filterRequest.minPrice = parseFloat(filters.minPrice);
      }
      if (filters.maxPrice) {
        filterRequest.maxPrice = parseFloat(filters.maxPrice);
      }

      // Add rating (get minimum rating from selected ratings)
      if (filters.selectedRatings.length > 0) {
        filterRequest.minRating = Math.min(...filters.selectedRatings);
      }

      // Add status filters
      if (filters.status === 'Sale') {
        filterRequest.hasDiscount = true;
      } else if (filters.status === 'New') {
        filterRequest.seasonType = 1; // New Arrivals
      } else if (filters.status === 'Trend') {
        filterRequest.seasonType = 0; // Special Offers/Trending
      }

      // Call filter API
      const response = await AxiosAPI.post('/api/products/filter?page=0&size=100', filterRequest);
      
      if (response.data?.data) {
        const content = response.data.data.content || response.data.data;
        setFilteredProducts(Array.isArray(content) ? content : []);
      }
    } catch (error) {
      console.error('Filter error:', error);
      setFilteredProducts([]);
    }
  };

  // Tự động chuyển sang tab so sánh khi có 2 sản phẩm
  useEffect(() => {
    if (comparisonProducts.length === 2 && activeViewTab !== 'comparison') {
      setActiveViewTab('comparison');
    }
  }, [comparisonProducts.length]);


  return (
    <ResizablePanelGroup autoSaveId="review-layout" direction="horizontal" className="flex z-0 h-full items-stretch">
      <ResizablePanel className="w-full h-full flex flex-col" defaultSize={70} minSize={30}>
        <div className={cn("flex flex-col h-full items-stretch gap-7 container", { "overflow-y-scroll": isChatbotOpen })}>
          <div className="flex items-center gap-3 w-full">
            <div className="relative flex gap-3 border py-2 px-3 rounded-lg items-center w-full mx-auto  z-1">
              <SearchIcon
                className="text-muted-foreground"
                size={16}
              />

              <input
                id="search-input"
                placeholder="Nhập sản phẩm tìm kiếm"
                defaultValue={searchInput}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full focus:outline-none"
              />

              <Badge
                className="absolute end-2 gap-1"
                appearance="outline"
                size="sm"
              >
                ⌘ K
              </Badge>
            </div>

            <StoreClientFiltersSheet
              trigger={
                <Button className={activeFilters ? 'border-primary' : ''}>
                  <Funnel /> Filter
                  {activeFilters && (
                    <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      ✓
                    </Badge>
                  )}
                </Button>
              }
              onApplyFilters={handleApplyFilters}
            />
          </div>

          <Tabs value={activeViewTab} onValueChange={(v) => setActiveViewTab(v as 'results' | 'comparison')} className="w-full">
            <div className="flex items-center justify-between w-full mt-3 mb-4">
              <TabsList variant="line" className="border-b-0 p-0 h-auto">
                <TabsTrigger value="results" className="data-[state=active]:border-b-2">
                  Kết quả tìm kiếm
                </TabsTrigger>
                <TabsTrigger value="comparison" className="data-[state=active]:border-b-2 relative">
                  <Scale className="w-4 h-4 mr-2" />
                  So sánh
                  {comparisonProducts.length > 0 && (
                    <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {comparisonProducts.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {activeViewTab === 'results' && (
                <div className="flex items-center gap-5">
                  <h3 className="text-sm text-mono font-medium">
                    {isFiltering ? (
                      <>1 - {filteredProducts?.length} filtered results</>
                    ) : (
                      <>
                        1 - {products?.length} over {data?.data?.totalElements} {searchInput && 'results for'}
                        <span className="text-destructive"> {searchInput}</span>
                      </>
                    )}
                  </h3>
                  <div className="flex items-center gap-2.5">
                    <div className='flex-1'>
                      <Selection defaultValue={'Price: High to Low'} values={['Price: Low to High', 'Price: High to Low', '$0 - $50', '$50 - $100', '$100 - $200', '$200 - $500', '$500+']} />
                    </div>
                    <ToggleGroup
                      type="single"
                      variant="outline"
                      value={activePeriod}
                      onValueChange={(value) => {
                        if (value) setActivePeriod(value);
                      }}
                      className="grid grid-cols-4"
                    >
                      {['Today', 'Week', 'Month', 'All'].map((period) => (
                        <ToggleGroupItem key={period} value={period}>
                          {period}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>

                    <ToggleGroup
                      type="single"
                      variant="outline"
                      value={activeTab}
                      onValueChange={(value) => {
                        setActiveTab(value as 'card' | 'list');
                      }}
                    >
                      <ToggleGroupItem value="card">
                        <LayoutGrid size={16} />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="list">
                        <List size={16} />
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>
              )}
            </div>

            <TabsContent value="results" className="mt-0">
              <div
                className={
                  activeTab == 'card'
                    ? "flex w-full flex-wrap gap-y-5 gap-x-2 items-center justify-evenly mb-2"
                    : 'flex flex-col gap-5'
                }
              >
                {(chatbotProducts.length > 0 
                  ? chatbotProducts 
                  : isFiltering 
                    ? filteredProducts 
                    : products
                )?.map((item: any, index: number) => {
                  const key = item?.id ?? item?.productId ?? index;
                  return activeTab === 'card' ? (
                    <div key={key} className='min-w-[266px] max-w-[301px] flex-1'>
                      <Card2 item={item} />
                    </div>
                  ) : (
                    <Card3 key={key} item={item} />
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="comparison" className="mt-0">
              <ComparisonView />
            </TabsContent>
          </Tabs>
        </div>
      </ResizablePanel>
      {isChatbotOpen && <ResizableHandle className="w-2 bg-transparent border-l" withHandle />}
      {isChatbotOpen && <ResizablePanel className="w-full flex-1 flex flex-col" defaultSize={30} minSize={30}>
        <ChatWindow setChatbotProducts={setChatbotProducts} />
      </ResizablePanel>}
    </ResizablePanelGroup>
  );
}



// 'use client';

// import { useState } from 'react';
// import { Funnel, LayoutGrid, List, Search as SearchIcon } from 'lucide-react';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
// import { Card2 } from '@/app/(app)/components/common/card2';
// import { Card3 } from '@/app/(app)/components/common/card3';
// import { StoreClientFiltersSheet } from '@/app/(app)/components/sheets/filters-sheet';
// import ChatWindow from '@/components/chatbot/components/chat-window';
// import { useSearchParams } from 'next/navigation';
// import { cn, configSWR } from '@/lib/utils';
// import Selection from '@/components/selection';
// import useSWR from 'swr';
// import { useDebounceCallback } from 'usehooks-ts';
// import { ProductDetailsSheet } from '../../components/sheets/product-details-sheet';

// export function SearchResults() {
//   const searchParams = useSearchParams();
//   const isChatbotOpen = !!searchParams.get("chatbot");

//   const [searchInput, setSearchInput] = useState(searchParams.get("q") || '');
//   const [activePeriod, setActivePeriod] = useState('Week');
//   const [activeTab, setActiveTab] = useState<'card' | 'list'>("card");
//   const [chatbotProducts, setChatbotProducts] = useState<any[]>([]);

//   const productsSWRKey = searchInput ? `/api/products/search?title=${searchInput}` : '/api/products?page=1&page_size=24';

//   const { data } = useSWR(productsSWRKey, configSWR);
//   const products = data?.data?.content;

//   const handleSearch = useDebounceCallback((value: string) => {
//     setSearchInput(value);
//   }, 2000);


//   return (
//     <div className='w-full h-full flex gap-4'>
//       <div className={cn("flex flex-col h-full items-stretch gap-7 container", { "overflow-y-scroll": isChatbotOpen })}>
//         <div className="flex items-center gap-3 w-full">
//           <div className="relative flex gap-3 border py-2 px-3 rounded-lg items-center w-full mx-auto  z-1">
//             <SearchIcon
//               className="text-muted-foreground"
//               size={16}
//             />

//             <input
//               id="search-input"
//               placeholder="Nhập sản phẩm tìm kiếm"
//               defaultValue={searchInput}
//               onChange={(e) => handleSearch(e.target.value)}
//               className="w-full focus:outline-none"
//             />

//             <Badge
//               className="absolute end-2 gap-1"
//               appearance="outline"
//               size="sm"
//             >
//               ⌘ K
//             </Badge>
//           </div>

//           <StoreClientFiltersSheet
//             trigger={
//               <Button>
//                 <Funnel /> Filter
//               </Button>
//             }
//           />
//         </div>

//         <div className="flex flex-wrap items-center gap-5 justify-between mt-3">
//           <h3 className="text-sm text-mono font-medium">
//             1 - {products?.length} over {data?.data?.totalElements} {searchInput && 'results for'}
//             <span className="text-destructive"> {searchInput}</span>
//           </h3>

//           <div className="flex items-center gap-2.5">
//             <div className='flex-1'>
//               <Selection defaultValue={'Price: High to Low'} values={['Price: Low to High', 'Price: High to Low', '$0 - $50', '$50 - $100', '$100 - $200', '$200 - $500', '$500+']} />
//             </div>
//             <ToggleGroup
//               type="single"
//               variant="outline"
//               value={activePeriod}
//               onValueChange={(value) => {
//                 if (value) setActivePeriod(value);
//               }}
//               className="grid grid-cols-4"
//             >
//               {['Today', 'Week', 'Month', 'All'].map((period) => (
//                 <ToggleGroupItem key={period} value={period}>
//                   {period}
//                 </ToggleGroupItem>
//               ))}
//             </ToggleGroup>

//             <ToggleGroup
//               type="single"
//               variant="outline"
//               value={activeTab}
//               onValueChange={(value) => {
//                 setActiveTab(value as 'card' | 'list');
//               }}
//             >
//               <ToggleGroupItem value="card">
//                 <LayoutGrid size={16} />
//               </ToggleGroupItem>
//               <ToggleGroupItem value="list">
//                 <List size={16} />
//               </ToggleGroupItem>
//             </ToggleGroup>
//           </div>
//         </div>

//         <div
//           className={
//             activeTab == 'card'
//               // ? `grid ${isChatbotOpen ? "sm:grid-cols-3" : "sm:grid-cols-4"} gap-5 mb-2`
//               ? "flex flex-wrap gap-5 mb-2"
//               : 'grid grid-cols-1 gap-5'
//           }
//         >
//           {(chatbotProducts.length > 0 ? chatbotProducts : products)?.map((item: any, index: number) => {
//             return activeTab === 'card' ? (
//               <div className='min-w-[265px] flex-1'>
//               <Card2 key={index} item={item} />
//               </div>
//             ) : (
//               <Card3 key={index} item={item} />
//             );
//           })}
//         </div>
//       </div>
//       <ChatWindow setChatbotProducts={setChatbotProducts} />
//     </div>
//   );
// }
