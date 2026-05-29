"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/utils/format";
import Badge from "@/components/ui/Badge";
import type { Profile } from "@/types/database";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data ?? []);
    } catch {
      toast.error("Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleSuspend = async (user: Profile) => {
    setActionId(user.id);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({ is_suspended: !user.is_suspended })
        .eq("id", user.id);

      if (error) throw error;

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, is_suspended: !u.is_suspended } : u,
        ),
      );

      toast.success(
        user.is_suspended
          ? `${user.full_name ?? user.email} unsuspended.`
          : `${user.full_name ?? user.email} suspended.`,
      );
    } catch {
      toast.error("Failed to update user.");
    } finally {
      setActionId(null);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.full_name ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">User Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          {users.length} registered users
        </p>
      </div>

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
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-300 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-12 bg-gray-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-gray-800 text-sm">
            {search ? `No users matching "${search}".` : "No users found."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  {["User", "Role", "Status", "Joined", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-300/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {(user.full_name ?? user.email)[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-black font-medium text-sm truncate">
                            {user.full_name ?? "—"}
                          </p>
                          <p className="text-gray-400 text-xs truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <Badge
                        label={user.role}
                        variant={user.role === "admin" ? "info" : "default"}
                      />
                    </td>

                    <td className="px-6 py-4">
                      <Badge
                        label={user.is_suspended ? "Suspended" : "Active"}
                        variant={user.is_suspended ? "error" : "success"}
                      />
                    </td>

                    <td className="px-6 py-4 text-gray-800 text-xs">
                      {formatDate(user.created_at)}
                    </td>

                    <td className="px-6 py-4">
                      {user.role !== "admin" ? (
                        <button
                          onClick={() => toggleSuspend(user)}
                          disabled={actionId === user.id}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 ${
                            user.is_suspended
                              ? "bg-green-500/10 text-green-400 hover:bg-green-500/20"
                              : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                          }`}
                        >
                          {actionId === user.id
                            ? "..."
                            : user.is_suspended
                              ? "Unsuspend"
                              : "Suspend"}
                        </button>
                      ) : (
                        <span className="text-xs text-gray-600">—</span>
                      )}
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
