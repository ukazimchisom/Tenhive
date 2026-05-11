"use client";

import toast from "react-hot-toast";
import Button from "./Button";
import type { Product } from "@/types/products";

interface Props {
  product: Product;
}

export default function AddToCartButton({ product }: Props) {
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    // Cart store wiring comes in the next step
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        size="lg"
        className="flex-1"
        onClick={handleAddToCart}
        disabled={isOutOfStock}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
      </Button>
    </div>
  );
}
