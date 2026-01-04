'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import Link from 'next/dist/client/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { LoaderCircleIcon } from 'lucide-react';

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState<string | null>('Đang xác minh...');
  const [error, setError] = useState<string | null>(null);

  const verify = useCallback(
    async (token: string) => {
      try {
        const res = await apiFetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.status === 200) {
          setError(null);
          setMessage('Email của bạn đã được xác minh thành công!');
          setTimeout(() => {
            router.push('/signin'); // Redirect to sign-in page or another page
          }, 2000);
        } else {
          setMessage(null);
          setError(data.message || 'Xác minh thất bại.');
        }
      } catch {
        setMessage(null);
        setError('Đã xảy ra lỗi trong quá trình xác minh.');
      }
    },
    [router],
  );

  useEffect(() => {
    const token = searchParams?.get('token');

    if (!token) {
      setMessage(null);
      setError('Mã thông báo không hợp lệ hoặc bị thiếu.');
      return;
    }

    verify(token);
  }, [searchParams, verify]);

  return (
    <Suspense>
      <div className="w-full space-y-6">
        <h1 className="text-2x font-semibold">Xác minh Email</h1>
        {error && (
          <>
            <Alert variant="destructive">
              <AlertIcon>
                <AlertCircle />
              </AlertIcon>
              <AlertTitle>{error}</AlertTitle>
            </Alert>

            <Button asChild>
              <Link href="/signin" className="text-primary">
                Quay lại trang đăng nhập
              </Link>
            </Button>
          </>
        )}

        {message && (
          <Alert>
            <AlertIcon>
              <LoaderCircleIcon className="size-4 animate-spin stroke-muted-foreground" />
            </AlertIcon>
            <AlertTitle>{message}</AlertTitle>
          </Alert>
        )}
      </div>
    </Suspense>
  );
}
