import useSWR from 'swr';
import { configSWR } from '@/lib/utils';
import { useMemo } from 'react';

export const useWishlistProducts = () => {
    const {data, isLoading, error, mutate} = useSWR('/api/products/wishlist/products', configSWR);
    const listId = useMemo(() => {
        return data?.data?.map((item: any) => item.id);
    }, [data?.data]);
    return {
        data: data?.data,
        isLoading,
        error,
        mutate,
        listId
    };
};

