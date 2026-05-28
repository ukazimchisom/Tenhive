"use client";

import Link from "next/link";
import { useOrders } from "@/hooks/useOrders";
import { formatCurrency, formatDate, truncateId } from "@/utils/format";
import Badge, {
  getOrderStatusVariant,
  getPaymentStatusVariant,
} from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";

export default function OrdersPage() {
  const { orders, isLoading, error, refetch } = useOrders();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-40 bg-gray-200 rounded-lg animate-pulse" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-red-700 text-sm mb-3">{error}</p>
        <button
          onClick={refetch}
          className="text-sm text-red-600 font-medium hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">My Orders</h1>
        <p className="text-sm text-gray-600 mt-1">
          {orders.length} order{orders.length !== 1 ? "s" : ""} total
        </p>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="When you place an order, it will appear here."
          action={
            <Link
              href="/products"
              className="text-sm text-blue-600 font-medium hover:underline"
            >
              Browse products →
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/dashboard/orders/${order.id}`}
              className="block bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-200 transition-all"
            >
              {/* Order header */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-50">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-mono text-sm font-bold text-gray-900">
                    #{truncateId(order.id)}
                  </span>
                  <Badge
                    label={order.status}
                    variant={getOrderStatusVariant(order.status)}
                  />
                  <Badge
                    label={order.payment_status}
                    variant={getPaymentStatusVariant(order.payment_status)}
                  />
                </div>
                <span className="text-xs text-gray-400">
                  {formatDate(order.created_at)}
                </span>
              </div>

              {/* Order body */}
              <div className="px-5 py-4 flex items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900">
                    {order.order_items?.length ?? 0} item
                    {(order.order_items?.length ?? 0) !== 1 ? "s" : ""}
                  </span>
                  {order.shipping_address && (
                    <span className="text-gray-400">
                      {" "}
                      · {order.shipping_address}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-base font-bold text-gray-900">
                    {formatCurrency(order.total_amount)}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
