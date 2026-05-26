"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { trpc } from "@/trpc/client";
import { useUserInfoStore } from "@/store/userInfoStore";
import PageLoader from "@/components/PageLoader";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  

  const { setUserInfo, setInitialized } = useUserInfoStore();
  const { data, isLoading, isError } = trpc.auth.getme.useQuery(undefined, {
    retry: false,
  });

  useEffect(() => {
    if (isLoading) return;
    const publicRoutes = ["/", "/signin", "/signup", "/forgot-password"];
    const isPublicRoute = publicRoutes.includes(pathname);
    if (isError || !data?.user?.id) {
      setInitialized(true);
      setUserInfo({ id: undefined, email: undefined, fullname: undefined });
      if (!isPublicRoute) {
        router.replace("/signin");
      }
      return;
    }
    if (data?.user?.id) {
      setUserInfo({
        id: data.user.id,
        email: data.user.email,
        fullname: data.user.fullName,
      });
      setInitialized(true);
    }
  }, [data, isLoading, isError, pathname, router, setInitialized, setUserInfo]);

  if (!useUserInfoStore.getState().isInitialized && isLoading) {
    return (
      <PageLoader/>
    );
  }
  return <>{children}</>;
}