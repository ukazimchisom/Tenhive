"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AlarmClock,
  Headphones,
  ShieldCheck,
  Truck,
  Medal,
  Tag,
  RefreshCcw,
  Smile,
} from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { useProducts } from "@/hooks/useProduct";
import Button from "@/components/ui/Button";

const features = [
  {
    title: "Top Quality",
    description: "Premium products you can trust.",
    icon: Medal,
  },
  {
    title: "Best Prices",
    description: "Affordable deals on every product.",
    icon: Tag,
  },
  {
    title: "Easy Returns",
    description: "Hassle-free returns within 30 days.",
    icon: RefreshCcw,
  },
  {
    title: "Happy Customers",
    description: "Thousands of satisfied shoppers worldwide.",
    icon: Smile,
  },
];

export default function HomePage() {
  const { products } = useProducts(8, 8);

  return (
    <main className="min-h-screen bg-[#faf7f4] text-gray-900 mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-2">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-[#fff6ef] to-[#fffaf7]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:py-4">
          <div className="sm:mb-27 text-center lg:text-left">
            <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Shop More,
              <br />
              <span className="text-orange-500">Save More!</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8 lg:mx-0 mx-auto">
              Discover amazing products at unbeatable prices.
              <br className="hidden sm:block" />
              Quality you&apos;ll love, deals you&apos;ll adore.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Button size="lg">
                <Link href="/products">Shop Now</Link>
              </Button>

              <Button variant="outline" size="md">
                <Link href="/signup">Create Account</Link>
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <Truck className="text-orange-500" />
                <div>
                  <h4 className="font-bold">Free Shipping</h4>
                  <p className="text-sm text-gray-500">Orders over $50</p>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <ShieldCheck className="text-orange-500" />
                <div>
                  <h4 className="font-bold">Secure Payment</h4>
                  <p className="text-sm text-gray-500">100% Protected</p>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <Headphones className="text-orange-500" />
                <div>
                  <h4 className="font-bold">24/7 Support</h4>
                  <p className="text-sm text-gray-500">Always Available</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center mt-8 lg:mt-0">
            <div className="absolute h-[250px] w-[250px] sm:h-[350px] sm:w-[350px] lg:h-[500px] lg:w-[500px] rounded-full bg-orange-100 blur-3xl" />

            <Image
              src="/hero-image-3.png"
              alt="Shopping Girl"
              width={550}
              height={650}
              className="relative z-10 h-auto w-[90%] max-w-[500px] object-contain"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto mb-6 max-w-7xl px-4 sm:px-6">
        <div className="grid gap-6 rounded-2xl bg-white p-6 shadow-xl sm:p-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div key={feature.title} className="text-center md:text-left">
                <h3 className="flex items-center justify-center gap-2 text-lg font-bold sm:text-xl md:justify-start">
                  <Icon className="h-5 w-5 text-orange-500" />
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
      <section className="mb-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="flex justify-center w-full">
          <Button className="mt-8">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </section>
      <section className="px-6 pb-24">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-10 rounded-[40px] bg-gradient-to-r from-orange-100 to-orange-50 p-10 lg:flex-row lg:p-16">
          <div>
            <span className="flex gap-3 font-bold uppercase text-orange-500">
              <AlarmClock />
              Limited Time Offer
            </span>

            <h2 className="mt-5 text-5xl font-black leading-tight">
              Special Deals Up To <span className="text-orange-500">50%</span>
              OFF
            </h2>
            <p>Hurry! Grab the best deal before they&apos;re gone.</p>
            <button className="mt-8 rounded-xl bg-orange-500 px-8 py-4 font-semibold text-white">
              Shop Now
            </button>
          </div>

          <Image
            src="/shopping-cart-promo.png"
            alt="shopping cart"
            width={400}
            height={400}
            className="h-[300px] w-auto rounded-3xl  object-contain"
            priority
          />
        </div>
      </section>
    </main>
  );
}
