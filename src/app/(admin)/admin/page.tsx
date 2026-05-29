"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/utils/format";
import Badge, { getOrderStatusVariant } from "@/components/ui/Badge";
import { formatDate, truncateId } from "@/utils/format";
import Link from "next/link";

interface Metrics {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
}

interface RecentOrder {
  id: string;
  status: string;
  total_amount: number;
  created_at: string;
  profiles: { full_name: string | null; email: string } | null;
}

export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();

        const [usersRes, ordersRes, recentRes] = await Promise.all([
          supabase.from("profiles").select("id", { count: "exact" }),
          supabase
            .from("orders")
            .select("status, total_amount, payment_status"),
          supabase
            .from("orders")
            .select(
              "id, status, total_amount, created_at, profiles(full_name, email)",
            )
            .order("created_at", { ascending: false })
            .limit(6),
        ]);

        const orders = ordersRes.data ?? [];
        const revenue = orders
          .filter((o) => o.payment_status === "paid")
          .reduce((sum, o) => sum + o.total_amount, 0);

        setMetrics({
          totalUsers: usersRes.count ?? 0,
          totalOrders: orders.length,
          totalRevenue: revenue,
          pendingOrders: orders.filter((o) => o.status === "pending").length,
        });

        setRecentOrders((recentRes.data ?? []) as RecentOrder[]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      label: "Total Users",
      value: metrics?.totalUsers ?? "—",
      color: "from-blue-500 to-blue-600",
      href: "/admin/users",
    },
    {
      label: "Total Orders",
      value: metrics?.totalOrders ?? "—",
      color: "from-purple-500 to-purple-600",
      href: "/admin/orders",
    },
    {
      label: "Revenue",
      value: metrics ? formatCurrency(metrics.totalRevenue) : "—",
      color: "from-green-500 to-green-600",
      href: "/admin/orders",
    },
    {
      label: "Pending Orders",
      value: metrics?.pendingOrders ?? "—",
      color: "from-amber-500 to-amber-600",
      href: "/admin/orders",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-black">Dashboard Overview</h1>
        <p className="text-gray-400 text-sm mt-1">
          Welcome back. Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-300 hover:bg-gray-100 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-xl"
          >
            <div
              className={`w-40 h-7 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-lg mb-4`}
            >
              <p className="text-white text-xs mt-0.5">{stat.label}</p>
            </div>
            {isLoading ? (
              <div className="h-7 w-16 bg-gray-800 rounded animate-pulse mb-1" />
            ) : (
              <p className="text-2xl font-bold text-center text-black">
                {stat.value}
              </p>
            )}
          </Link>
        ))}
      </div>

      <div className="bg-white border border-gray-300 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-400">
          <h2 className="font-bold text-black">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-orange-600 hover:text-orange-400 transition-colors"
          >
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-10 bg-gray-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="p-10 text-center text-gray-800 text-sm">
            No orders yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-400">
                  {["Order ID", "Customer", "Status", "Amount", "Date"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-400">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-400/50 transition-colors"
                  >
                    <td className="px-6 py-3 font-mono text-gray-800 text-xs">
                      #{truncateId(order.id)}
                    </td>
                    <td className="px-6 py-3 text-gray-800">
                      {order.profiles?.full_name ??
                        order.profiles?.email ??
                        "Guest"}
                    </td>
                    <td className="px-6 py-3">
                      <Badge
                        label={order.status}
                        variant={getOrderStatusVariant(order.status)}
                      />
                    </td>
                    <td className="px-6 py-3 text-gray-800 font-medium">
                      {formatCurrency(order.total_amount)}
                    </td>
                    <td className="px-6 py-3 text-gray-800 text-xs">
                      {formatDate(order.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
