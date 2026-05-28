"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/hooks/useUser";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const settingsSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { user, profile } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      full_name: "",
      phone: "",
      address: "",
    },
  });

  // Pre-fill form once profile loads
  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name ?? "",
        phone: profile.phone ?? "",
        address: profile.address ?? "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: SettingsFormData) => {
    setIsSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.full_name,
          phone: data.phone ?? null,
          address: data.address ?? null,
        })
        .eq("id", user?.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
      reset(data); // reset dirty state
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setIsChangingPassword(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      toast.success("Password reset email sent! Check your inbox.");
    } catch {
      toast.error("Failed to send reset email.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your personal information
        </p>
      </div>

      {/* Profile form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-5"
      >
        <h2 className="font-bold text-gray-900 pb-3 border-b border-gray-100">
          Personal Information
        </h2>

        {/* Email — read only */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span>{user?.email}</span>
            <span className="ml-auto text-xs text-gray-400">
              Cannot be changed
            </span>
          </div>
        </div>

        <Input
          label="Full name"
          placeholder="Your full name"
          error={errors.full_name?.message}
          {...register("full_name")}
        />

        <Input
          label="Phone number"
          type="tel"
          placeholder="Your phone number"
          error={errors.phone?.message}
          {...register("phone")}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Default shipping address
          </label>
          <textarea
            placeholder="Your shipping address"
            rows={3}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            {...register("address")}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" isLoading={isSaving} disabled={!isDirty}>
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>

      {/* Password section */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-1">Password</h2>
        <p className="text-sm text-gray-500 mb-5">
          We&apos;ll send a password reset link to your email address.
        </p>
        <Button
          variant="outline"
          onClick={handlePasswordReset}
          isLoading={isChangingPassword}
        >
          {isChangingPassword ? "Sending..." : "Send password reset email"}
        </Button>
      </div>

      {/* Account info */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-4">Account Information</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Account type</span>
            <span className="font-medium text-gray-900 capitalize">
              {profile?.role ?? "customer"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Member since</span>
            <span className="font-medium text-gray-900">
              {profile?.created_at
                ? new Intl.DateTimeFormat("en-US", {
                    month: "long",
                    year: "numeric",
                  }).format(new Date(profile.created_at))
                : "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Account status</span>
            <span
              className={`font-medium ${
                profile?.is_suspended ? "text-red-600" : "text-green-600"
              }`}
            >
              {profile?.is_suspended ? "Suspended" : "Active"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
