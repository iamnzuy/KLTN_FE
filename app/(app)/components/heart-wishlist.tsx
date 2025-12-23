import { ReactNode, useEffect, useRef, useState } from "react";
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import AxiosAPI from "@/lib/axios";
import { useSWRConfig } from "swr";

type HeartWishlistProps = {
    handleToggleWishlist?: (nextState: boolean) => void;
    children?: ReactNode;
    className?: string;
    size?: "md" | "icon" | "lg" | "sm" | null | undefined;
    productId?: string;
    initiallyWishlisted?: boolean;
};

export const HeartWishlist = ({ handleToggleWishlist, children, className = '', size = 'md', productId = '', initiallyWishlisted }: HeartWishlistProps) => {
    const [isWishlisted, setIsWishlisted] = useState(Boolean(initiallyWishlisted));
    const [isBursting, setIsBursting] = useState(false);
    const burstTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const hasLabel = !!children;
    const { mutate } = useSWRConfig();

    useEffect(() => {
        if (typeof initiallyWishlisted === 'boolean') {
            setIsWishlisted(initiallyWishlisted);
        }
    }, [initiallyWishlisted]);

    useEffect(() => {
        if (initiallyWishlisted !== undefined || !productId) return;
        let isMounted = true;
        AxiosAPI.get(`/api/products/wishlist/check?productId=${productId}`)
            .then((response) => {
                if (isMounted) {
                    setIsWishlisted(Boolean(response?.data));
                }
            })
            .catch((error) => {
                console.error('Failed to fetch wishlist status', error);
            });
        return () => {
            isMounted = false;
        };
    }, [initiallyWishlisted, productId]);

    const refreshWishlistCaches = () => {
        mutate('/api/products/wishlist');
        mutate('/api/products/wishlist/products');
    };

    const toggleWishlist = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (!productId) return;

        try {
            if (!isWishlisted) {
                await AxiosAPI.post(`/api/products/wishlist`, { productId });
            } else {
                await AxiosAPI.delete(`/api/products/wishlist?productId=${productId}`);
            }
            refreshWishlistCaches();
            setIsWishlisted((prev) => {
                const next = !prev;
                if (burstTimeoutRef.current) clearTimeout(burstTimeoutRef.current);
                if (next) {
                    setIsBursting(true);
                    burstTimeoutRef.current = setTimeout(() => {
                        setIsBursting(false);
                    }, 700);
                } else setIsBursting(false);
                return next;
            });
            handleToggleWishlist?.(!isWishlisted);
        } catch (error) {
            console.error('Failed to toggle wishlist state', error);
        }
    };

    useEffect(() => {
        return () => {
            if (burstTimeoutRef.current) clearTimeout(burstTimeoutRef.current);
        };
    }, []);

    const mode = hasLabel ? 'default' : 'icon';
    const shape = hasLabel ? 'default' : 'circle';

    return (
        <Button
            type="button"
            variant="ghost"
            size={size}
            mode={mode}
            shape={shape}
            onClick={toggleWishlist}
            aria-pressed={isWishlisted}
            data-active={isWishlisted}
            data-bursting={isBursting}
            className={cn(
                "wishlist-heart border border-border bg-background/80 backdrop-blur text-muted-foreground hover:text-destructive flex items-center justify-center gap-1.5",
                isWishlisted && "text-destructive",
                hasLabel
                    ? "rounded-full px-3 py-1.5 min-h-8"
                    : "size-8.5 rounded-full",
                className
            )}
        >
            <span className="wishlist-heart-sparks" aria-hidden="true">
                <span />
                <span />
                <span />
            </span>
            <Heart className={`wishlist-heart-icon ${isWishlisted ? 'fill-current' : ''}`} />
            {hasLabel && (
                <span className={cn("wishlist-heart-label", isWishlisted ? "text-destructive" : "text-white")}>
                    {children}
                </span>
            )}
        </Button>
    )
}