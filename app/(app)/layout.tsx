'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StoreClientProvider, useStoreClient } from '@/app/(app)/components/context';
import { DefaultLayout } from '@/components/layouts/default';
import { ScreenLoader } from '@/components/screen-loader';
import ChatbotFloatingButton from '@/components/chatbot';
import { ComparisonSheet } from '@/app/(app)/components/sheets/comparison-sheet';
import useAuth from '@/hooks/use-auth';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { state, closeComparisonSheet } = useStoreClient();
  
  return (
    <>
      <DefaultLayout>
        {children}
        <ChatbotFloatingButton />
      </DefaultLayout>
      <ComparisonSheet 
        open={state.isComparisonSheetOpen} 
        onOpenChange={(open) => {
          if (!open) {
            closeComparisonSheet();
          }
        }} 
      />
    </>
  );
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const {isLogin, isLoading} = useAuth({revalidateOnMount: true});

  useEffect(() => {
    if (!isLogin && !isLoading) router.push('/signin');
  }, [isLogin, isLoading]);

  if (isLoading) {
    return <ScreenLoader />;
  }

  return isLogin ? (
    <StoreClientProvider>
      <LayoutContent>{children}</LayoutContent>
    </StoreClientProvider>
  ) : null;
}
