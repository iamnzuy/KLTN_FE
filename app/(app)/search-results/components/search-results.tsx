'use client';

import { useState, useEffect } from 'react';
import { Funnel, LayoutGrid, List, Search as SearchIcon, Scale, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card2 } from '@/app/(app)/components/common/card2';
import { Card3 } from '@/app/(app)/components/common/card3';
import { StoreClientFiltersSheet } from '@/app/(app)/components/sheets/filters-sheet';
import { ComparisonView } from './comparison-view';
import ChatWindow from '@/components/chatbot/components/chat-window';
import { useSearchParams } from 'next/navigation';
import { cn, configSWR } from '@/lib/utils';
import Selection from '@/components/selection';
import useSWR from 'swr';
import { useDebounceCallback } from 'usehooks-ts';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable-panel';
import { ComparisonStore } from '@/app/(app)/search-results/hooks/comparison-store';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination';

export function SearchResults() {
  const searchParams = useSearchParams();
  const isChatbotOpen = !!searchParams.get("chatbot");

  const [searchInput, setSearchInput] = useState(searchParams.get("search") || '');
  const [activePeriod, setActivePeriod] = useState('Week');
  const [activeTab, setActiveTab] = useState<'card' | 'list'>("card");
  const [activeViewTab, setActiveViewTab] = useState<'results' | 'comparison'>('results');
  const [chatbotProducts, setChatbotProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;
  const { products: comparisonProducts } = ComparisonStore();

  const productsSWRKey = `/api/products/search?title=${searchInput || ""}&page=${currentPage}&page_size=${pageSize}`

  const { data } = useSWR(productsSWRKey, configSWR);
  const products = data?.data?.content;
  const totalPages = data?.data?.totalPages || 0;
  const totalElements = data?.data?.totalElements || 0;

  const handleSearch = useDebounceCallback((value: string) => {
    setSearchInput(value);
    setCurrentPage(1);
  }, 2000);

  useEffect(() => {
    if (comparisonProducts.length === 2 && activeViewTab !== 'comparison') {
      setActiveViewTab('comparison');
    }
  }, [comparisonProducts.length]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const resultsContainer = document.querySelector('.search-results-container');
    if (resultsContainer) {
      resultsContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    items.push(
      <PaginationItem key="prev">
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="gap-1 px-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Trước</span>
        </Button>
      </PaginationItem>
    );

    if (startPage > 1) {
      items.push(
        <PaginationItem key={1}>
          <Button
            variant={currentPage === 1 ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => handlePageChange(1)}
            className="w-9 h-9"
          >
            1
          </Button>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <Button
            variant={currentPage === i ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => handlePageChange(i)}
            className={cn("w-9 h-9", currentPage === i && "bg-accent text-accent-foreground")}
          >
            {i}
          </Button>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key={totalPages}>
          <Button
            variant={currentPage === totalPages ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            className="w-9 h-9"
          >
            {totalPages}
          </Button>
        </PaginationItem>
      );
    }

    items.push(
      <PaginationItem key="next">
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="gap-1 px-2"
        >
          <span>Sau</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </PaginationItem>
    );

    return items;
  };

  return (
    <ResizablePanelGroup autoSaveId="review-layout" direction="horizontal" className="flex z-0 h-full items-stretch overflow-hidden">
      <ResizablePanel className="w-full h-full flex flex-col overflow-hidden" defaultSize={70} minSize={30}>
        <div className="flex flex-col h-full items-stretch gap-7 container min-h-0 search-results-container overflow-hidden">
          <div className="flex items-center gap-3 w-full shrink-0">
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
            </div>

            <StoreClientFiltersSheet
              trigger={
                <Button>
                  <Funnel /> Filter
                </Button>
              }
            />
          </div>

          <Tabs value={activeViewTab} onValueChange={(v) => setActiveViewTab(v as 'results' | 'comparison')} className="w-full flex-1 flex flex-col min-h-0">
            <div className="flex items-center justify-between w-full mt-3 mb-4 shrink-0">
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
                    {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalElements)} over {totalElements} {searchInput && 'results for'}
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
              )}
            </div>

            <TabsContent value="results" className="mt-0 flex-1 min-h-0 overflow-y-auto pr-2">
              <div
                className={
                  activeTab == 'card'
                    ? "flex w-full flex-wrap gap-y-5 gap-x-2 items-center justify-evenly mb-2"
                    : 'flex flex-col gap-5'
                }
              >
                {(chatbotProducts.length > 0 ? chatbotProducts : products)?.map((item: any, index: number) => {
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

              {totalPages > 1 && (
                <div className="py-10 border-t mt-10">
                  <Pagination>
                    <PaginationContent>
                      {renderPaginationItems()}
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </TabsContent>

            <TabsContent value="comparison" className="mt-0 flex-1 min-h-0 overflow-y-auto">
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
