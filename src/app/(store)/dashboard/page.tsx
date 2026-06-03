"use client";

import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { useOrders } from "@/hooks/useOrders";
import { formatCurrency, formatDate, truncateId } from "@/utils/format";
import Badge, { getOrderStatusVariant } from "@/components/ui/Badge";
import { ShoppingBag, RefreshCw, CheckCheck, Wallet } from "lucide-react";

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
      icon: ShoppingBag,
      color: "bg-sky-100 text-sky-700",
    },
    {
      label: "Total Spent",
      value: isLoading ? "—" : formatCurrency(totalSpent),
      icon: Wallet,
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Processing",
      value: isLoading
        ? "—"
        : orders.filter((o) => o.status === "processing").length,
      icon: RefreshCw,
      color: "bg-orange-300 text-orange-600",
    },
    {
      label: "Delivered",
      value: isLoading
        ? "—"
        : orders.filter((o) => o.status === "delivered").length,
      icon: CheckCheck,
      color: "bg-amber-100 text-amber-700",
    },
  ];

  return (
    <main className="space-y-6 mb-5">
      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="bg-white border text-center border-gray-100 rounded-lg p-4 shadow-sm hover:transition-transform hover:scale-105 hover:bg-gray-50 cursor-pointer "
            >
              <div className="flex items-center justify-center mb-3">
                <div
                  className={`grid h-11 w-11 place-items-center rounded-lg ${stat.color}`}
                >
                  <stat.icon size={20} />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
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
          <div className="overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {orders.slice(0, 5).map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() =>
                        (window.location.href = `/dashboard/orders/${order.id}`)
                      }
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        #{truncateId(order.id)}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(order.created_at)}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {order.order_items?.length ?? 0}
                      </td>

                      <td className="px-6 py-4">
                        <Badge
                          label={order.status}
                          variant={getOrderStatusVariant(order.status)}
                        />
                      </td>

                      <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                        {formatCurrency(order.total_amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200">
              {orders.slice(0, 5).map((order) => (
                <Link
                  key={order.id}
                  href={`/dashboard/orders/${order.id}`}
                  className="block p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">
                        #{truncateId(order.id)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(order.created_at)}
                      </p>
                    </div>

                    <Badge
                      label={order.status}
                      variant={getOrderStatusVariant(order.status)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {order.order_items?.length ?? 0} item
                      {(order.order_items?.length ?? 0) !== 1 ? "s" : ""}
                    </span>

                    <span className="font-bold text-gray-900">
                      {formatCurrency(order.total_amount)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
