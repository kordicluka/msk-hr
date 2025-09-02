"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/atoms/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/atoms/form";
import { Input } from "@/components/atoms/input";
import { createUser } from "@/actions/UserActions";

const formSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setGeneralError(null);
    try {
      const result = await createUser({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      if (result.success) {
        router.push("/sign-in");
      } else {
        setGeneralError(result.error || "Došlo je do greške");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setGeneralError("User already exists with the provided email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full 2xl:w-2/5 xl:w-2/5 lg:w-1/2 md:w-full bg-background px-8 sm:px-24 xl:px-28 2xl:px-[10%] relative">
      <Link
        href="/sign-in"
        className="absolute right-8 xl:right-12 xl:top-12 top-8 text-sm text-foreground flex items-center"
      >
        <span className="mr-2">Already have an account?</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
          />
        </svg>
      </Link>

      <h6 className="text-foreground font-semibold text-[1.6rem] mb-3 text-center">
        Register
      </h6>
      <p className="text-muted-foreground font-light text-sm mb-4 text-center">
        Create an account to get started
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name"
                    {...field}
                    className="rounded border border-gray-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Email"
                    {...field}
                    className="rounded border border-gray-200"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      {...field}
                      className="rounded border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-2 pb-2">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="********"
                      {...field}
                      className="rounded border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {generalError && (
            <div className="text-destructive text-sm">{generalError}</div>
          )}
          <Button
            type="submit"
            className="w-full bg-blue-900 rounded-sm flex justify-center items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing up...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>
      <div className="mt-6 text-center">
        <Link
          href="/forgot-password"
          className="text-sm underline text-muted-foreground"
        >
          Forgot password?
        </Link>
      </div>
      <div className="absolute bottom-0 left-0 w-full flex justify-between items-center p-8 xl:p-12 text-sm text-muted-foreground">
        <p className="font-light">© 2024. All rights reserved.</p>
        <div className="">
          <Link
            href="https://www.msk.hr"
            className="ml-1 font-semibold underline"
          >
            msk.hr
          </Link>
        </div>
      </div>
    </div>
  );
}
