"use client";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { useState } from "react";

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
  SignupInput,
  signupSchema,
} from "@/schemas/auth-schema";

import { getApiErrorMessage } from "@/lib/api-error";

export default function SignupForm() {

  const router = useRouter();

  const [role, setRole] =
    useState("member");

  const { setAuth } =
    useAuthStore();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<SignupInput>({
    resolver:
      zodResolver(
        signupSchema
      ),
  });

  const onValidationError =
    (
      fieldErrors:
        FieldErrors<SignupInput>
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
    data: SignupInput
  ) => {

    try {

      const payload = {
        ...data,
        role,
      };

      const response =
        await API.post(
          "/auth/signup",
          payload
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

      // SAVE AUTH IN ZUSTAND

      setAuth(result.user, result.token);

      toast.success("Account created successfully", { duration: 3000 });

      setTimeout(() => {
        router.push(getDashboardPathForRole(result.user.role));
      }, 600);

    } catch (
      error: unknown
    ) {

      toast.error(
        getApiErrorMessage(
          error,
          "Signup failed"
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

      {/* NAME */}

      <div className="space-y-2">

        <label className="text-sm text-slate-300">
          Full Name
        </label>

        <Input
          placeholder="John Doe"
          className="h-12 bg-white/5 border-white/10"
          {...register("name")}
        />

        {errors.name && (

          <p className="text-sm text-red-400">
            {errors.name.message}
          </p>
        )}
      </div>

      {/* EMAIL */}

      <div className="space-y-2">

        <label className="text-sm text-slate-300">
          Email
        </label>

        <Input
          type="email"
          placeholder="john@example.com"
          className="h-12 bg-white/5 border-white/10"
          {...register("email")}
        />

        {errors.email && (

          <p className="text-sm text-red-400">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* ROLE */}

      <div className="space-y-2">

        <label className="text-sm text-slate-300">
          Role
        </label>

        <select
          value={role}
          onChange={(e) =>
            setRole(
              e.target.value
            )
          }
          className="
            h-12
            w-full
            rounded-2xl
            bg-[#121A2B]
            text-white
            border
            border-white/10
            px-4
            outline-none
            shadow-lg
            hover:border-[#7C5CFF]/40
            focus:border-[#7C5CFF]
            transition-all
          "
        >

          <option
            value="member"
            className="
              bg-[#121A2B]
            "
          >
            Member
          </option>

          <option
            value="manager"
            className="
              bg-[#121A2B]
            "
          >
            Manager
          </option>

          <option
            value="admin"
            className="
              bg-[#121A2B]
            "
          >
            Admin
          </option>

        </select>

        <p className="
          text-xs
          text-slate-500
        ">
          Select your role access.
        </p>
      </div>

      {/* PASSWORD */}

      <div className="space-y-2">

        <label className="text-sm text-slate-300">
          Password
        </label>

        <Input
          type="password"
          placeholder="Create a strong password"
          className="h-12 bg-white/5 border-white/10"
          {...register("password")}
        />

        <p className="text-xs text-slate-500">
          Must contain uppercase,
          lowercase, number,
          and special character.
        </p>

        {errors.password && (

          <p className="text-sm text-red-400">
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

          "Create Account"
        )}
      </Button>

      {/* LOGIN LINK */}

      <p className="
        text-center
        text-sm
        text-slate-400
      ">
        Already have an account?{" "}

        <Link
          href="/auth/login"
          className="
            text-white
            hover:text-[#7C5CFF]
          "
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}