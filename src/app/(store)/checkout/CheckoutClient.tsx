"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePaystackPayment } from "react-paystack";

import { useCheckout } from "@/hooks/useCheckout";
import { useCart } from "@/hooks/useCart";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { ChevronLeft, Lock, ShieldCheck, TriangleAlert } from "lucide-react";
import { formatCurrency } from "@/utils/format";

export default function CheckoutClient() {
  const router = useRouter();
  const { items } = useCart();

  const {
    form,
    totalPrice,
    shippingCost,
    grandTotal,
    user,
    isSavingOrder,
    handlePaymentSuccess,
    handlePaymentClose,
  } = useCheckout();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  const emailValue = watch("email");

  const isRedirectingRef = useRef(false);

  useEffect(() => {
    if (items.length === 0 && !isRedirectingRef.current) {
      router.replace("/cart");
    }
  }, [items, router]);

  // Generate a unique payment reference
  const paymentRef = useRef(
    `SW-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
  );

  const paystackConfig = {
    reference: paymentRef.current,
    email: emailValue || user?.email || "",
    amount: Math.round(grandTotal * 100),
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    currency: "NGN",
    metadata: {
      custom_fields: [
        {
          display_name: "Customer",
          variable_name: "customer",
          value: user?.email ?? "guest",
        },
      ],
    },
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const onSubmit = () => {
    initializePayment({
      onSuccess: (transaction: { reference: string }) => {
        isRedirectingRef.current = true;
        handlePaymentSuccess(transaction.reference);
      },
      onClose: handlePaymentClose,
    });
  };

  if (items.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
          Back to cart
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        <p className="text-gray-500 mt-1">Complete your order below</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* LEFT — Shipping Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Contact info */}
            <section className="bg-white border border-gray-100 rounded-2xl p-6 mb-5 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-6 h-6 bg-orange-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  1
                </span>
                Contact Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Full name"
                    placeholder="Your Full Name"
                    error={errors.full_name?.message}
                    {...register("full_name")}
                  />
                </div>
                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                  {...register("email")}
                />
                <Input
                  label="Phone number"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  error={errors.phone?.message}
                  {...register("phone")}
                />
              </div>
            </section>

            {/* Shipping address */}
            <section className="bg-white border border-gray-100 rounded-2xl p-6 mb-5 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-6 h-6 bg-orange-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  2
                </span>
                Shipping Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Input
                    label="Street address"
                    placeholder="45 Euphrates Street, Maitama District"
                    error={errors.address?.message}
                    {...register("address")}
                  />
                </div>
                <Input
                  label="City"
                  placeholder="Abuja"
                  error={errors.city?.message}
                  {...register("city")}
                />
                <Input
                  label="State / Province"
                  placeholder="FCT"
                  error={errors.state?.message}
                  {...register("state")}
                />
                <Input
                  label="ZIP / Postal code"
                  placeholder="10001"
                  error={errors.zip_code?.message}
                  {...register("zip_code")}
                />
              </div>
            </section>

            {/* Payment section */}
            <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-900 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-orange-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  3
                </span>
                Payment
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Secured by Paystack. You&apos;ll be redirected to complete
                payment.
              </p>

              <div className="flex items-start gap-3 p-3.5 bg-amber-50 border border-amber-200 rounded-xl mb-5">
                <TriangleAlert className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">
                    Test Mode Active
                  </p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Use test card: <strong>4084 0840 8408 4081</strong>{" "}
                    &nbsp;|&nbsp; CVV: <strong>408</strong> &nbsp;|&nbsp;
                    Expiry: any future date &nbsp;|&nbsp; PIN:{" "}
                    <strong>0000</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <span className="text-xs text-gray-400">We accept:</span>
                {["Visa", "Mastercard", "Verve"].map((card) => (
                  <span
                    key={card}
                    className="px-2.5 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded border border-gray-200"
                  >
                    {card}
                  </span>
                ))}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                isLoading={isSavingOrder}
              >
                {isSavingOrder ? (
                  "Saving your order..."
                ) : (
                  <>
                    <Lock className="h-5 w-5" strokeWidth={2} />
                    Pay {formatCurrency(grandTotal)} securely
                  </>
                )}
              </Button>
            </section>
          </form>
        </div>

        {/* RIGHT — Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
            <h2 className="text-base font-bold text-gray-900 mb-5">
              Order Summary
            </h2>

            <div className="space-y-3 mb-5 max-h-72 overflow-y-auto pr-1">
              {items.map(({ product, quantity, unitPrice }) => (
                <div key={product.id} className="flex gap-3">
                  <div className="relative w-14 h-14 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                      {product.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatCurrency(unitPrice)} × {quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                    {formatCurrency(unitPrice * quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2.5">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className={shippingCost === 0 ? "text-green-600" : ""}>
                  {shippingCost === 0
                    ? "Free"
                    : `#${formatCurrency(shippingCost)}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-100 pt-3">
                <span>Total</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-1.5 text-xs text-gray-400">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
              SSL encrypted & secure
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
