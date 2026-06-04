"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/products";
import { getDiscountedPrice } from "@/lib/api/products";
import StarRating from "./StarRating";
import { formatCurrency } from "@/utils/format";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discountedPrice = getDiscountedPrice(
    product.price,
    product.discountPercentage,
  );
  const hasDiscount = product.discountPercentage > 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-200 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-orange-50">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority
        />
        {hasDiscount && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
            -{Math.round(product.discountPercentage)}%
          </span>
        )}
        {product.stock < 10 && product.stock > 0 && (
          <span className="absolute top-2 right-2 px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded-full">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1 rounded-full border">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-0.5">
          {product.brand ?? product.category}
        </p>
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 flex-1">
          {product.title}
        </h3>

        <StarRating rating={product.rating} />

        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-col">
            <span className="text-base font-bold text-gray-900">
              {formatCurrency(discountedPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          <span className="px-3 py-1.5 text-xs font-semibold text-orange-600 bg-orange-100 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-colors">
            View
          </span>
        </div>
      </div>
    </Link>
  );
}
