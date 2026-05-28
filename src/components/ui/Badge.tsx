type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "purple";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-gray-100 text-gray-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-700",
  error: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  purple: "bg-purple-100 text-purple-700",
};

export default function Badge({ label, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variantStyles[variant]}`}
    >
      {label}
    </span>
  );
}

// Helper: map order status → badge variant
export function getOrderStatusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    pending: "warning",
    processing: "info",
    shipped: "purple",
    delivered: "success",
    cancelled: "error",
  };
  return map[status] ?? "default";
}

// Helper: map payment status → badge variant
export function getPaymentStatusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    unpaid: "error",
    paid: "success",
    refunded: "warning",
  };
  return map[status] ?? "default";
}
