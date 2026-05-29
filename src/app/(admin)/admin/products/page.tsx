"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useProducts } from "@/hooks/useProduct";
import { getDiscountedPrice } from "@/lib/api/products";
import { formatCurrency } from "@/utils/format";
import Button from "@/components/ui/Button";

export default function AdminProductsPage() {
  const { products, isLoading } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    stock: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.category || !form.stock) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      // DummyJSON create endpoint (test/demo only)
      const res = await fetch("https://dummyjson.com/products/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          price: parseFloat(form.price),
          category: form.category,
          stock: parseInt(form.stock),
          description: form.description,
        }),
      });

      if (!res.ok) throw new Error("Failed to create product");
      const data = await res.json();

      toast.success(`Product "${data.title}" created (ID: ${data.id})`);
      setForm({
        title: "",
        price: "",
        category: "",
        stock: "",
        description: "",
      });
      setShowForm(false);
    } catch {
      toast.error("Failed to create product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Product Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            {products.length} products loaded from DummyJSON
          </p>
        </div>
        <Button onClick={() => setShowForm((p) => !p)}>
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          {showForm ? "Cancel" : "Add Product"}
        </Button>
      </div>

      {/* Create product form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white border border-gray-300 rounded-2xl p-6 space-y-4"
        >
          <h2 className="font-bold text-black mb-2">Create New Product</h2>
          <p className="text-xs text-gray-500 -mt-2 mb-4">
            This sends to the DummyJSON test API — for demonstration purposes.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Product title"
                className="w-full px-3 py-2.5 bg-gray-white border border-gray-300 rounded-xl text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-800 mb-1">
                Price ($) <span className="text-red-400">*</span>
              </label>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="50.55"
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-800 mb-1">
                Category <span className="text-red-400">*</span>
              </label>
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. electronics"
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-800 mb-1">
                Stock <span className="text-red-400">*</span>
              </label>
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                placeholder="50"
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-800 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Optional product description"
                className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Product"}
            </Button>
          </div>
        </form>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Products table */}
      <div className="bg-white border border-gray-300 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-16 bg-gray-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  {["Product", "Category", "Price", "Stock", "Rating"].map(
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
              <tbody className="divide-y divide-gray-300">
                {filtered.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-300/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
                          <Image
                            src={product.thumbnail}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-black font-medium line-clamp-1 max-w-[200px]">
                          {product.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 capitalize text-xs">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-medium">
                      {formatCurrency(
                        getDiscountedPrice(
                          product.price,
                          product.discountPercentage,
                        ),
                      )}
                      {product.discountPercentage > 0 && (
                        <span className="ml-1.5 text-xs text-red-400">
                          -{Math.round(product.discountPercentage)}%
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold ${
                          product.stock === 0
                            ? "text-red-400"
                            : product.stock < 10
                              ? "text-amber-400"
                              : "text-green-400"
                        }`}
                      >
                        {product.stock === 0 ? "Out of stock" : product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      ⭐ {product.rating}
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
