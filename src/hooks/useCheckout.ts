"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/hooks/useCart";
import { useUser } from "@/hooks/useUser";
import { checkoutSchema, type CheckoutFormData } from "@/utils/validation";
import { sendOrderConfirmationEmail } from "@/lib/emailjs";
import { formatCurrency, truncateId } from "@/utils/format";

export function useCheckout() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const { user, profile } = useUser();
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const shippingCost = totalPrice >= 50 ? 0 : 4.99;
  const grandTotal = parseFloat((totalPrice + shippingCost).toFixed(2));

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      full_name: profile?.full_name ?? "",
      email: user?.email ?? "",
      phone: profile?.phone ?? "",
      address: profile?.address ?? "",
      city: "",
      state: "",
      zip_code: "",
    },
  });

  const handlePaymentSuccess = async (reference: string) => {
    setIsSavingOrder(true);

    try {
      const supabase = createClient();

      // Fetch current user directly from Supabase to ensure we have the latest auth state
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) throw new Error("User not authenticated");

      const formData = form.getValues();

      const shippingAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip_code}`;

      // Save order to database
      const { error: orderError } = await supabase.from("orders").insert({
        user_id: currentUser.id,
        status: "processing",
        total_amount: grandTotal,
        payment_reference: reference,
        payment_status: "paid",
        shipping_address: shippingAddress,
      });

      if (orderError) throw orderError;

      // Ensure we have the order ID after insertion
      const { data: orderRow, error: fetchError } = await supabase
        .from("orders")
        .select("id")
        .eq("payment_reference", reference)
        .eq("user_id", currentUser.id)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!orderRow) throw new Error("Order not found after insert");

      // Insert order items
      const orderItems = items.map((item) => ({
        order_id: orderRow.id,
        product_id: item.product.id,
        product_title: item.product.title,
        product_image: item.product.thumbnail,
        quantity: item.quantity,
        unit_price: item.unitPrice,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Prepare order items summary for email
      const itemsSummary = items
        .map(
          (item) =>
            `${item.product.title} x${item.quantity} — ${formatCurrency(
              item.unitPrice * item.quantity,
            )}`,
        )
        .join("\n");

      // Send order confirmation email
      await sendOrderConfirmationEmail({
        to_name: formData.full_name,
        to_email: formData.email,
        order_id: truncateId(orderRow.id),
        order_total: formatCurrency(grandTotal),
        order_items: itemsSummary,
        shipping_address: shippingAddress,
      });

      router.push(`/checkout/success?orderId=${orderRow.id}`);
      clearCart();
      toast.success("Order placed successfully!");
    } catch (err) {
      console.error("❌ Order save error:", err);
      toast.error("Payment received but order save failed. Contact support.");
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handlePaymentClose = () => {
    toast("Payment cancelled. Your cart is still saved.", {
      icon: "⚠️",
    });
  };

  return {
    form,
    items,
    totalPrice,
    shippingCost,
    grandTotal,
    user,
    isSavingOrder,
    handlePaymentSuccess,
    handlePaymentClose,
  };
}
