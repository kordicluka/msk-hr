"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsletterSubscribeSchema } from "@/schemas/newsletter";
import { subscribeToNewsletter } from "@/actions/NewsletterAction";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import type { NewsletterSubscribeData } from "@/types/newsletter";
import { Loader2 } from "lucide-react";

export default function NewsletterSignup({
  successMessage,
  errorMessage,
}: {
  successMessage: string;
  errorMessage: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterSubscribeData>({
    resolver: zodResolver(newsletterSubscribeSchema),
    mode: "onSubmit",
  });

  const onSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await subscribeToNewsletter(data);

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "Uspješno ste se pretplatili na newsletter!",
        });
        reset(); // Očisti formu
      } else {
        setMessage({
          type: "error",
          text: result.error || "Greška pri pretplati na newsletter.",
        });
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setMessage({
        type: "error",
        text: "Greška pri pretplati na newsletter. Molimo pokušajte ponovo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={onSubmit} className="flex gap-2">
        <div className="flex-1">
          <Input
            type="email"
            placeholder="Email address"
            className="px-4 text-base py-4 h-12  rounded bg-white text-black"
            {...register("email")}
            disabled={isSubmitting}
          />
        </div>
        <Button
          type="submit"
          className="rounded h-12 w-40"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            "Pošalji"
          )}
        </Button>
      </form>

      {/* Error/Success Messages */}
      {errors.email ? (
        <p className="mt-6 text-xs">{errorMessage}</p>
      ) : (
        message && <p className="mt-6 text-xs">{successMessage}</p>
      )}
    </div>
  );
}
