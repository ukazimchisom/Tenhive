"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import { formatCurrency, formatDateLong, truncateId } from "@/utils/format";
import Badge, {
  getOrderStatusVariant,
  getPaymentStatusVariant,
} from "@/components/ui/Badge";
import type { OrderWithItems } from "@/types/database";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderWithItems | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("orders")
          .select("*, order_items(*)")
          .eq("id", id)
          .single();

        if (error) throw error;
        setOrder(data as OrderWithItems);
      } catch {
        setError("Order not found.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded-lg" />
        <div className="h-40 bg-gray-100 rounded-2xl" />
        <div className="h-64 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-4">{error ?? "Order not found."}</p>
        <Link
          href="/dashboard/orders"
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Back + header */}
      <div>
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to orders
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{truncateId(order.id)}
          </h1>
          <Badge
            label={order.status}
            variant={getOrderStatusVariant(order.status)}
          />
          <Badge
            label={order.payment_status}
            variant={getPaymentStatusVariant(order.payment_status)}
          />
        </div>
        <p className="text-sm text-gray-400 mt-1">
          Placed on {formatDateLong(order.created_at)}
        </p>
      </div>

      {/* Order items */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">
            Items ({order.order_items?.length ?? 0})
          </h2>
        </div>
        <div className="divide-y divide-gray-50">
          {order.order_items?.map((item) => (
            <div key={item.id} className="flex gap-4 px-5 py-4">
              {item.product_image && (
                <div className="relative w-16 h-16 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
                  <Image
                    src={item.product_image}
                    alt={item.product_title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                  {item.product_title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatCurrency(item.unit_price)} × {item.quantity}
                </p>
              </div>
              <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                {formatCurrency(item.unit_price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary + shipping */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Order summary */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatCurrency(order.total_amount)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>Included</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-2 mt-2">
              <span>Total</span>
              <span>{formatCurrency(order.total_amount)}</span>
            </div>
          </div>

          {order.payment_reference && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400">Payment reference</p>
              <p className="text-xs font-mono text-gray-600 break-all mt-0.5">
                {order.payment_reference}
              </p>
            </div>
          )}
        </div>

        {/* Shipping info */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">Shipping Address</h2>
          {order.shipping_address ? (
            <p className="text-sm text-gray-600 leading-relaxed">
              {order.shipping_address}
            </p>
          ) : (
            <p className="text-sm text-gray-400">
              No shipping address recorded.
            </p>
          )}

          {/* Order timeline */}
          <div className="mt-5 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
              Status Timeline
            </p>
            <div className="flex items-center gap-1.5">
              {["pending", "processing", "shipped", "delivered"].map(
                (step, idx, arr) => {
                  const statuses = [
                    "pending",
                    "processing",
                    "shipped",
                    "delivered",
                  ];
                  const currentIdx = statuses.indexOf(order.status);
                  const stepIdx = statuses.indexOf(step);
                  const isDone = stepIdx <= currentIdx;
                  const isLast = idx === arr.length - 1;

                  return (
                    <div
                      key={step}
                      className="flex items-center gap-1.5 flex-1"
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                          isDone ? "bg-blue-600" : "bg-gray-200"
                        }`}
                      />
                      {!isLast && (
                        <div
                          className={`h-0.5 flex-1 ${
                            isDone ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  );
                },
              )}
            </div>
            <div className="flex justify-between mt-1.5">
              {["Pending", "Processing", "Shipped", "Delivered"].map(
                (label) => (
                  <span key={label} className="text-[10px] text-gray-400">
                    {label}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
