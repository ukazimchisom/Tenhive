"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { OrderWithItems } from "@/types/database";

interface UseOrdersReturn {
  orders: OrderWithItems[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useOrders(): UseOrdersReturn {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const supabase = createClient();

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setOrders([]);
          return;
        }

        const { data, error } = await supabase
          .from("orders")
          .select(
            `
            *,
            order_items (*)
          `,
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setOrders((data as OrderWithItems[]) ?? []);
      } catch (err) {
        setError("Failed to load orders. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [tick]);

  const refetch = () => setTick((t) => t + 1);

  return { orders, isLoading, error, refetch };
}
