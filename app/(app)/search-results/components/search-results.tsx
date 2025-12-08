'use client';

import { useState } from 'react';
import { Funnel, LayoutGrid, List, Search as SearchIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Card2 } from '@/app/(app)/components/common/card2';
import { Card3 } from '@/app/(app)/components/common/card3';
import { StoreClientFiltersSheet } from '@/app/(app)/components/sheets/filters-sheet';
import ChatWindow from '@/components/chatbot/components/chat-window';
import { useSearchParams } from 'next/navigation';
import { cn, configSWR } from '@/lib/utils';
import Selection from '@/components/selection';
import useSWR from 'swr';
import { useDebounceCallback } from 'usehooks-ts';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable-panel';

export function SearchResults() {
  const searchParams = useSearchParams();
  const isChatbotOpen = !!searchParams.get("chatbot");

  const [searchInput, setSearchInput] = useState(searchParams.get("q") || '');
  const [activePeriod, setActivePeriod] = useState('Week');
  const [activeTab, setActiveTab] = useState<'card' | 'list'>("card");
  const [chatbotProducts, setChatbotProducts] = useState<any[]>([]);

  const productsSWRKey = searchInput ? `/api/products/search?title=${searchInput}` : '/api/products?page=1&page_size=24';

  const { data } = useSWR(productsSWRKey, configSWR);
  const products = data?.data?.content;

  const handleSearch = useDebounceCallback((value: string) => {
    setSearchInput(value);
  }, 2000);


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
                <Button>
                  <Funnel /> Filter
                </Button>
              }
            />
          </div>

          <div className="flex flex-wrap items-center gap-5 justify-between mt-3">
            <h3 className="text-sm text-mono font-medium">
              1 - {products?.length} over {data?.data?.totalElements} {searchInput && 'results for'}
              <span className="text-destructive"> {searchInput}</span>
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

          <div
            className={
              activeTab == 'card'
                ? "flex w-full flex-wrap gap-y-5 gap-x-2 items-center justify-evenly mb-2"
                : 'flex flex-col gap-5'
            }
          >
            {(chatbotProducts.length > 0 ? chatbotProducts : products)?.map((item: any, index: number) => {
              return activeTab === 'card' ? (
                <div className='min-w-[266px] max-w-[301px] flex-1'>
                  <Card2 key={index} item={item} />
                </div>
              ) : (
                <Card3 key={index} item={item} />
              );
            })}
          </div>
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
