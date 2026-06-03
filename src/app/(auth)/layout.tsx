import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#ede7e3] to-[#f3ece8] flex items-center flex-col justify-center p-4">
      <div className="w-full">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">
            Ten<span className="text-orange-500">hive</span>
          </span>
        </Link>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mt-5">
          {children}
        </div>
      </div>
    </div>
  );
}
