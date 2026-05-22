"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { createClient } from "@/lib/supabase/client";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/utils/validation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setEmailSent(true);
      toast.success("Password reset email sent!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Email sent!</h2>
        <p className="text-sm text-gray-500 mb-6">
          If an account exists for that email, you&apos;ll receive a password
          reset link shortly.
        </p>
        <Link
          href="/login"
          className="text-blue-600 font-medium text-sm hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <main className="w-full flex mb-8 items-center justify-center px-4 py-8 gap-8">
      <div className="flex-1 hidden md:block  ">
        <Image
          src="/forgot-password.png"
          alt="Digital Marketplace"
          width={700}
          height={700}
          priority
          className="h-full w-full rounded-3xl object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="mb-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to sign in
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Forgot password?</h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <Input
            label="Email address"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />

          <Button
            type="submit"
            className="w-full mt-2"
            size="lg"
            isLoading={isLoading}
          >
            {isLoading ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      </div>
    </main>
  );
}
