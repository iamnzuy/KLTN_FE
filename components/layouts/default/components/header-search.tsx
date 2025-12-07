'use client';

import { useEffect, useState } from 'react';
import { Search as SearchInput } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { usePathname, useRouter } from 'next/navigation';

export function HeaderSearch() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const isMobile = useIsMobile();
  const router = useRouter();
  const pathname = usePathname();

  function handlePopoverOpenChange(open: boolean) {
    setPopoverOpen(open);
  }

  const handleSearch = () => {
    const searchQuery = (document.getElementById('search-input') as HTMLInputElement)?.value;
    if (!searchQuery?.trim()) return;
    router.push(`/search-results?q=${searchQuery.trim()}`);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleSearch();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => { document.removeEventListener('keydown', handleKeyDown); };
  }, []);

  if (pathname.includes('/search-results')) return <></>;

  return (
    <>
      {isMobile ? (
        <Popover open={popoverOpen} onOpenChange={handlePopoverOpenChange}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="lg"
              mode="icon"
              shape="circle"
              className="hover:text-primary data-[state=open]:text-primary"
            >
              <SearchInput className="size-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3">
            <div className="relative flex items-center">
              <SearchInput className="absolute start-2 text-muted-foreground" size={18} />
              <Input
                id="search-input-mobile"
                placeholder="Search shop"
                className="ps-9 pe-10 w-full"
                autoFocus={popoverOpen}
              />
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <div className="relative flex items-center gap-2 max-w-[175px] md:max-w-[325px] w-[80%] border rounded-md p-2">
          <SearchInput
            className="text-muted-foreground"
            size={18}
          />
          <input
            id="search-input"
            placeholder="Search shop"
            className="text-foreground placeholder:text-muted-foreground/80 !outline-none"
          />
        </div>
      )}
    </>
  );
}


