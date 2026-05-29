import emailjs from "@emailjs/browser";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;
const WELCOME_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_WELCOME_TEMPLATE_ID!;
const ORDER_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_ORDER_TEMPLATE_ID!;

// Initialize EmailJS once
emailjs.init(PUBLIC_KEY);

// ─────────────────────────────────────────
// Send welcome email after signup
// ─────────────────────────────────────────
export async function sendWelcomeEmail({
  to_name,
  to_email,
}: {
  to_name: string;
  to_email: string;
}): Promise<void> {
  try {
    await emailjs.send(SERVICE_ID, WELCOME_TEMPLATE_ID, {
      to_name,
      to_email,
    });
    console.log("[EmailJS] Welcome email sent to", to_email);
  } catch (error) {
    console.error("[EmailJS] Failed to send welcome email:", error);
  }
}

// ─────────────────────────────────────────
// Send order confirmation after payment
// ─────────────────────────────────────────
export async function sendOrderConfirmationEmail({
  to_name,
  to_email,
  order_id,
  order_total,
  order_items,
  shipping_address,
}: {
  to_name: string;
  to_email: string;
  order_id: string;
  order_total: string;
  order_items: string;
  shipping_address: string;
}): Promise<void> {
  try {
    await emailjs.send(SERVICE_ID, ORDER_TEMPLATE_ID, {
      to_name,
      to_email,
      order_id,
      order_total,
      order_items,
      shipping_address,
    });
    console.log("[EmailJS] Order confirmation sent to", to_email);
  } catch (error) {
    console.error("[EmailJS] Failed to send order confirmation:", error);
  }
}
