"use client";

import { useRouter } from "next/navigation";
import useSWR from "swr";
import { setCookie, deleteCookie } from "cookies-next";
import { configSWR } from "@/lib/utils";

const useAuth = (options: any = {}) => {
    const { data, mutate, isLoading }: any = useSWR("/api/users/me", { ...configSWR, revalidateOnMount: false, ...options });
    const profile = data?.data || {};
    const isLogin = isLoading ? null : !!profile.userId;
    const router = useRouter();

    const handleLogin = async (access_token: string, expired: number = 60 * 60 * 24 * 7) => {
        setCookie("auth_token", access_token, { maxAge: expired, path: '/', sameSite: 'lax' });
        await mutate();
        router.push("/");
    };

    const handleLogout = async () => {
        // try {
        //     AxiosAPI.post("/auth/logout");
        // } catch (error) { }
        deleteCookie("auth_token");
        mutate({ data: null }, { revalidate: false });
        router.push("/signin");
    };
    return {
        profile,
        isLogin,
        mutate,
        handleLogin,
        handleLogout,
        isLoading,
    };
};

export default useAuth;
