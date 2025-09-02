"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/atoms/admin/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/atoms/form";
import { Input } from "@/components/atoms/input";
import { ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (res?.ok) {
      router.push("/admin");
    } else if (res?.error) {
      setError(res.error);
    }
    setIsLoading(false);
  }

  return (
    <div className="flex flex-col items-center justify-center h-full w-full 2xl:w-2/5 xl:w-2/5 lg:w-1/2 md:w-full bg-background px-8 sm:px-24 xl:px-28 2xl:px-[10%] relative">
      <Link
        href="/sign-up"
        className="absolute right-8 xl:right-12 xl:top-12 top-8 text-sm text-foreground flex items-center"
      >
        <span className="mr-2">Don&apos;t have an account?</span>
        <ArrowRight className="h-4 w-4" />
      </Link>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h4>Login</h4>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
                      className="rounded border  border-gray-200"
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
                <FormItem className="pb-2 space-y-2">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        className="rounded border border-gray-200"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
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
            {error && <div className="text-destructive text-sm">{error}</div>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center">
          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground underline"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0  left-0 w-full flex justify-between items-center p-8 xl:p-12 text-sm text-muted-foreground">
        <p className="font-light">
          © {new Date().getFullYear()}. All rights reserved.
        </p>
        <div className="flex items-center">
          <p className="font-light"> Made by: </p>
          <Link
            href="https://www.msk.hr"
            className="ml-1 font-semibold hover:underline"
          >
            msk.hr
          </Link>
        </div>
      </div>
    </div>
  );
}
