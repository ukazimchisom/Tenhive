"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";

const NAV_ITEMS = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: (
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
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    label: "My Orders",
    href: "/dashboard/orders",
    icon: (
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
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: (
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
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { profile, user } = useUser();

  return (
    <div className="max-w-7xl mx-auto px-8 lg:pl-0 lg:min-h-screen bg-slate-100 rounded-2xl mt-5 lg:mt-0">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 bg-white border-gray-100 p-5 shadow-sm sticky  lg:min-h-screen lg:w-64 left-0 border-r rounded-2xl lg:rounded-none mt-5 lg:mt-0">
          <div className="flex flex-col">
            {/* User avatar */}
            <div className="flex flex-col items-center lg:items-start lg:pl-5 pb-5 border-b border-gray-100 mb-4">
              <div className="w-14 h-14 rounded-full bg-orange-600 flex items-center justify-center text-white text-xl font-bold mb-3">
                {profile?.full_name?.[0]?.toUpperCase() ??
                  user?.email?.[0]?.toUpperCase() ??
                  "U"}
              </div>
              <p className="font-semibold text-gray-900 text-sm">
                {profile?.full_name ?? "My Account"}
              </p>
              <p className="text-xs text-gray-400 truncate max-w-full mt-0.5">
                {user?.email}
              </p>
            </div>

            {/* Nav links */}
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-orange-50 text-orange-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span
                      className={isActive ? "text-orange-600" : "text-gray-400"}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="lg:col-span-3 mb-5">{children}</main>
      </div>
    </div>
  );
}
