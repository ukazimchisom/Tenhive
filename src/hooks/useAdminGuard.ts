"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

export function useAdminGuard() {
  const { profile, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && profile && profile.role !== "admin") {
      router.replace("/");
    }
  }, [profile, isLoading, router]);

  return { isLoading, isAdmin: profile?.role === "admin" };
}
