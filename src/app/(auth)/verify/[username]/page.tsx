"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const VerifyAccount = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams<{ username: string }>();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });
      if (response.data.message === "Account verified successfully") {
        toast.success("Verification Successful", {
          description: (
            <span className="text-emerald-600 font-medium">
              {response.data.message}
            </span>
          ),
        });

        router.replace("/sign-in");
      } else if (
        response.data.message ===
        "Verification code is not valid. Please sign up again to generate new code"
      ) {
        toast.warning("Code not valid", {
          description: (
            <span className="text-amber-500">{response.data.message}</span>
          ),
        });
      } else {
        toast.warning("Incorrect code", {
          description: (
            <span className="text-amber-500">{response.data.message}</span>
          ),
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error("Verification failed", {
        description: (
          <span className="text-red-500">
            {axiosError.response?.data.message ??
              "An error occurred. Please try again"}
          </span>
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-100 p-8 sm:p-10 space-y-8">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="bg-primary/10 p-3 rounded-full mb-2">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Verify Account
          </h1>
          <p className="text-sm text-gray-500">
            Enter the verification code sent to your email
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    Verification Code
                  </FormLabel>
                  <Input
                    placeholder="Enter code"
                    className="transition-all duration-200 focus-visible:ring-primary/20 text-center tracking-widest text-lg"
                    {...field}
                  />
                  <FormMessage className="text-xs text-center" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full mt-2 transition-all duration-200"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Account"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VerifyAccount;
