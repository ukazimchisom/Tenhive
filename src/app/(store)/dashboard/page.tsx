"use client";

import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { useOrders } from "@/hooks/useOrders";
import { formatCurrency, formatDate, truncateId } from "@/utils/format";
import Badge, { getOrderStatusVariant } from "@/components/ui/Badge";

export default function DashboardPage() {
  const { profile } = useUser();
  const { orders, isLoading } = useOrders();

  const totalSpent = orders
    .filter((o) => o.payment_status === "paid")
    .reduce((sum, o) => sum + o.total_amount, 0);

  const stats = [
    {
      label: "Total Orders",
      value: isLoading ? "—" : orders.length,
    },
    {
      label: "Total Spent",
      value: isLoading ? "—" : formatCurrency(totalSpent),
    },
    {
      label: "Processing",
      value: isLoading
        ? "—"
        : orders.filter((o) => o.status === "processing").length,
    },
    {
      label: "Delivered",
      value: isLoading
        ? "—"
        : orders.filter((o) => o.status === "delivered").length,
    },
  ];

  return (
    <div className="space-y-6">
      <div className=" text-center text-white">
        <h1 className="text-2xl font-bold mb-1">
          Here’s an overview of your account activity.
        </h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border text-center border-gray-100 rounded-2xl p-4 shadow-sm"
          >
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <Link
            href="/dashboard/orders"
            className="text-sm text-orange-500 hover:underline"
          >
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-12 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-gray-500 text-sm mb-3">No orders yet.</p>
            <Link
              href="/products"
              className="text-sm text-orange-600 font-medium hover:underline"
            >
              Start shopping →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {orders.slice(0, 5).map((order) => (
              <Link
                key={order.id}
                href={`/dashboard/orders/${order.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    #{truncateId(order.id)}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatDate(order.created_at)} ·{" "}
                    {order.order_items?.length ?? 0} item
                    {(order.order_items?.length ?? 0) !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    label={order.status}
                    variant={getOrderStatusVariant(order.status)}
                  />
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(order.total_amount)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
