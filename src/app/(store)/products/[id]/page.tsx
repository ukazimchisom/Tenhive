import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getProductById, getDiscountedPrice } from "@/lib/api/products";
import StarRating from "@/components/ui/StarRating";
import AddToCartButton from "@/components/ui/AddToCartButton";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const product = await getProductById(id);
    return {
      title: product.title,
      description: product.description,
    };
  } catch {
    return { title: "Product Not Found" };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  let product;
  try {
    product = await getProductById(id);
  } catch {
    notFound();
  }

  const discountedPrice = getDiscountedPrice(
    product.price,
    product.discountPercentage,
  );
  const hasDiscount = product.discountPercentage > 0;
  const savings = (product.price - discountedPrice).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-gray-900 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          href="/products"
          className="hover:text-gray-900 transition-colors"
        >
          Products
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-[200px]">
          {product.title}
        </span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
            <Image
              src={product.images[0] ?? product.thumbnail}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
            {hasDiscount && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                -{Math.round(product.discountPercentage)}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail strip */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.slice(0, 5).map((img, index) => (
                <div
                  key={index}
                  className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100"
                >
                  <Image
                    src={img}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {/* Category + Brand */}
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full capitalize">
              {product.category}
            </span>
            {product.brand && (
              <span className="text-sm text-gray-500">{product.brand}</span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {product.title}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-5">
            <StarRating rating={product.rating} size="md" />
            <span className="text-sm text-gray-500">
              ({product.rating} out of 5)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3 mb-2">
            <span className="text-4xl font-extrabold text-gray-900">
              ${discountedPrice}
            </span>
            {hasDiscount && (
              <span className="text-xl text-gray-400 line-through mb-1">
                ${product.price}
              </span>
            )}
          </div>

          {hasDiscount && (
            <p className="text-sm text-green-600 font-medium mb-5">
              You save ${savings} ({Math.round(product.discountPercentage)}%
              off)
            </p>
          )}

          {/* Stock status */}
          <div className="flex items-center gap-2 mb-6">
            {product.stock === 0 ? (
              <span className="flex items-center gap-1.5 text-sm text-red-600">
                <span className="w-2 h-2 bg-red-500 rounded-full" />
                Out of stock
              </span>
            ) : product.stock < 10 ? (
              <span className="flex items-center gap-1.5 text-sm text-amber-600">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                Only {product.stock} left in stock
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-sm text-green-600">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                In stock ({product.stock} available)
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Add to Cart */}
          <div className="mt-auto">
            <AddToCartButton product={product} />
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-gray-100">
            {[
              { label: "Free Shipping", sub: "Orders over $50" },
              { label: "Easy Returns", sub: "30-day policy" },
              { label: "Secure Payment", sub: "Encrypted checkout" },
            ].map((badge) => (
              <div key={badge.label} className="text-center">
                <p className="text-xs font-semibold text-gray-700">
                  {badge.label}
                </p>
                <p className="text-[11px] text-gray-400">{badge.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
