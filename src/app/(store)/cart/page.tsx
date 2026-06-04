"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import {
  ArrowRight,
  Lock,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";

export default function CartPage() {
  const {
    items,
    totalItems,
    totalPrice,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Start shopping and your items will appear here."
          action={
            <Link href="/products">
              <Button size="lg">Browse Products</Button>
            </Link>
          }
          icon={<ShoppingCart />}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
          <p className="text-gray-500 mt-1">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </p>
        </div>
        <button
          onClick={() => {
            if (confirm("Clear your entire cart?")) clearCart();
          }}
          className="text-sm text-red-500 hover:text-red-700 hover:underline transition-colors"
        >
          Clear cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity, unitPrice }) => (
            <div
              key={product.id}
              className="flex gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
            >
              {/* Product image */}
              <Link href={`/products/${product.id}`} className="flex-shrink-0">
                <div className="relative w-24 h-24 bg-gray-50 rounded-xl overflow-hidden">
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    sizes="96px"
                    className="object-cover hover:scale-105 transition-transform"
                  />
                </div>
              </Link>

              {/* Product details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">
                      {product.brand ?? product.category}
                    </p>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                        {product.title}
                      </h3>
                    </Link>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeItem(product.id)}
                    className="flex-shrink-0 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>

                {/* Price + Quantity */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" strokeWidth={2} />
                    </button>

                    <span className="w-10 text-center text-sm font-semibold text-gray-900">
                      {quantity}
                    </span>

                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" strokeWidth={2} />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-base font-bold text-gray-900">
                      ${(unitPrice * quantity).toFixed(2)}
                    </p>
                    {quantity > 1 && (
                      <p className="text-xs text-gray-400">${unitPrice} each</p>
                    )}
                  </div>
                </div>

                {/* Stock warning */}
                {product.stock < 10 && (
                  <p className="text-xs text-amber-600 mt-2">
                    Only {product.stock} in stock
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              Order Summary
            </h2>

            {/* Line items */}
            <div className="space-y-3 mb-5">
              {items.map(({ product, quantity, unitPrice }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate max-w-[170px]">
                    {product.title}{" "}
                    <span className="text-gray-400">×{quantity}</span>
                  </span>
                  <span className="font-medium text-gray-900 flex-shrink-0">
                    ${(unitPrice * quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 pt-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600">
                  {totalPrice >= 50 ? "Free" : "$4.99"}
                </span>
              </div>
              {totalPrice < 50 && (
                <p className="text-xs text-gray-400">
                  Add ${(50 - totalPrice).toFixed(2)} more for free shipping
                </p>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between font-bold text-gray-900 text-lg border-t border-gray-100 pt-4 mb-6">
              <span>Total</span>
              <span>
                ${(totalPrice + (totalPrice >= 50 ? 0 : 4.99)).toFixed(2)}
              </span>
            </div>

            {/* Checkout button */}
            <Link href="/checkout">
              <Button size="lg" className="w-full">
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" strokeWidth={2} />
              </Button>
            </Link>

            <Link href="/products">
              <Button variant="ghost" size="md" className="w-full mt-3">
                Continue Shopping
              </Button>
            </Link>

            {/* Trust note */}
            <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
              <Lock className="h-3.5 w-3.5" strokeWidth={2} />
              Secure & encrypted checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
