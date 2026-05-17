"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";

import {
  useForm,
  type FieldErrors,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { API } from "@/lib/axios";

import { getDashboardPathForRole } from "@/lib/auth-cookies";
import { useAuthStore } from "@/store/auth-store";

import {
  LoginInput,
  loginSchema,
} from "@/schemas/auth-schema";

import { getApiErrorMessage } from "@/lib/api-error";

export default function LoginForm() {

  const router = useRouter();

  const { setAuth } =
    useAuthStore();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginInput>({
    resolver:
      zodResolver(
        loginSchema
      ),
  });

  const onValidationError =
    (
      fieldErrors:
        FieldErrors<LoginInput>
    ) => {

      const first =
        Object.values(
          fieldErrors
        )[0];

      toast.error(
        first?.message ??
          "Please fix the errors below"
      );
    };

  const onSubmit =
    async (
      data: LoginInput
    ) => {

      try {

        const response =
          await API.post(
            "/auth/login",
            data
          );

        const result =
          response.data;

        if (
          !result?.user ||
          !result?.token
        ) {

          toast.error(
            "Invalid response from server"
          );

          return;
        }

        // SAVE AUTH

        setAuth(result.user, result.token);

        toast.success("Login successful", { duration: 3000 });

        setTimeout(() => {
          router.push(getDashboardPathForRole(result.user.role));
        }, 600);
      } catch (
        error: unknown
      ) {

        toast.error(
          getApiErrorMessage(
            error,
            "Login failed"
          )
        );
      }
    };

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit,
        onValidationError
      )}
      className="space-y-5"
    >

      {/* EMAIL */}

      <div className="space-y-2">

        <label className="text-sm text-slate-300">
          Email
        </label>

        <Input
          type="email"
          placeholder="john@example.com"
          className="
            h-12
            bg-white/5
            border-white/10
          "
          {...register("email")}
        />

        {errors.email && (

          <p className="
            text-sm
            text-red-400
          ">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* PASSWORD */}

      <div className="space-y-2">

        <label className="text-sm text-slate-300">
          Password
        </label>

        <Input
          type="password"
          placeholder="Enter your password"
          className="
            h-12
            bg-white/5
            border-white/10
          "
          {...register("password")}
        />

        {errors.password && (

          <p className="
            text-sm
            text-red-400
          ">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* BUTTON */}

      <Button
        disabled={isSubmitting}
        className="
          w-full
          h-12
          rounded-xl
          bg-[#7C5CFF]
          hover:bg-[#6D4EFF]
        "
      >

        {isSubmitting ? (

          <Loader2 className="animate-spin" />

        ) : (

          "Sign In"
        )}
      </Button>

      {/* SIGNUP LINK */}

      <p className="
        text-center
        text-sm
        text-slate-400
      ">
        Don&apos;t have an account?{" "}

        <Link
          href="/auth/signup"
          className="
            text-white
            hover:text-[#7C5CFF]
          "
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}