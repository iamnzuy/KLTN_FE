'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StoreClientProvider } from '@/app/(app)/components/context';
import { DefaultLayout } from '@/components/layouts/default';
import { ScreenLoader } from '@/components/screen-loader';
import ChatbotFloatingButton from '@/components/chatbot';
import useAuth from '@/hooks/use-auth';

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
      <DefaultLayout>
        {children}
        <ChatbotFloatingButton />
      </DefaultLayout>
    </StoreClientProvider>
  ) : null;
}
