"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { createClient } from "@/lib/supabase/client";
import { signupSchema, type SignupFormData } from "@/utils/validation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Image from "next/image";
import { sendWelcomeEmail } from "@/lib/emailjs";
import { Mail } from "lucide-react";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    setIsLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("An account with this email already exists.");
        } else {
          toast.error(error.message);
        }
        return;
      }

      await sendWelcomeEmail({
        to_name: data.full_name,
        to_email: data.email,
      });

      setEmailSent(true);
      toast.success("Account created! Please check your email.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (emailSent) {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Check your email
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          We sent a confirmation link to your email address. Click it to
          activate your account.
        </p>
        <Link
          href="/login"
          className="text-orange-500 font-medium text-sm hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <main>
      <div className="hidden lg:block">
        <p className="text-right text-sm text-gray-500 mb-2">
          Already have an account?
          <Link
            href="/login"
            className="text-orange-500 font-medium hover:underline"
          >
            <Button variant="outline" size="sm" className="ml-2">
              Sign in
            </Button>
          </Link>
        </p>
      </div>
      <div className="w-full flex flex-1 items-center justify-center px-4 py-8 gap-8 ">
        <div className="flex-1 hidden md:block ">
          <Image
            src="/Digital-marketplace.png"
            alt="Digital Marketplace"
            width={700}
            height={700}
            priority
            className="h-full w-full rounded-3xl object-cover"
          />
        </div>

        <div>
          <div className="mb-6">
            <h1 className="text-center text-2xl font-bold text-gray-900">
              Create Your Account
            </h1>
            <p className="text-sm text-gray-500 mt-1 text-center">
              Join Tenhive and start shopping today!
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <Input
              label="Full name"
              type="text"
              placeholder="Enter Your Full Name"
              autoComplete="name"
              error={errors.full_name?.message}
              {...register("full_name")}
            />

            <Input
              label="Email address"
              type="email"
              placeholder="Enter Your Email address"
              autoComplete="email"
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              label="Password"
              showPasswordToggle
              placeholder="Min. 6 characters"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register("password")}
            />

            <Input
              label="Confirm password"
              showPasswordToggle
              placeholder="Confirm your password"
              autoComplete="new-password"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            <p className="text-xs text-gray-400">
              Password must be at least 6 characters with one uppercase letter
              and one number.
            </p>

            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              isLoading={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-orange-500 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
