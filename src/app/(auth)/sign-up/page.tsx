"use client";

import React, { useEffect, useState } from "react";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { Loader2, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { signUpSchema } from "@/schemas/signUpSchema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const SignUpForm = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500);

  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${username}`,
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username",
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };

    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);

      toast.success("Success", {
        description: (
          <span className="text-emerald-600 font-medium">
            {response.data.message}
          </span>
        ),
      });

      // Directly sign in the user after successful signup
      const result = await signIn("credentials", {
        redirect: false,
        identifier: data.email, // Use email as identifier
        password: data.password,
      });

      if (result?.error) {
        toast.error("Login failed", {
          description: (
            <span className="text-red-500">Please try signing in manually</span>
          ),
        });
      } else if (result?.url) {
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Error during sign up", error);
      const axiosError = error as AxiosError<ApiResponse>;

      let errorMessage =
        axiosError.response?.data.message ||
        "There was a problem with your sign up. Please try again";

      toast.error("Sign Up Failed", {
        description: <span className="text-red-500">{errorMessage}</span>,
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
            <MessageSquare className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Join Open Feedback
          </h1>
          <p className="text-sm text-gray-500">
            Create an account to start your anonymous adventure
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Username</FormLabel>
                  <Input
                    placeholder="Your unique username"
                    className="transition-all duration-200 focus-visible:ring-primary/20"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />
                  <div className="h-5 mt-1 flex items-center">
                    {isCheckingUsername ? (
                      <div className="flex items-center text-xs text-gray-500">
                        <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                        Checking availability...
                      </div>
                    ) : usernameMessage ? (
                      <p
                        className={`text-xs font-medium ${
                          usernameMessage === "Username is available"
                            ? "text-emerald-500"
                            : "text-red-500"
                        }`}
                      >
                        {username === ""
                          ? "Please enter a username"
                          : usernameMessage}
                      </p>
                    ) : null}
                  </div>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email Address</FormLabel>
                  <Input
                    placeholder="you@example.com"
                    className="transition-all duration-200 focus-visible:ring-primary/20"
                    {...field}
                  />
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Your secure password"
                    className="transition-all duration-200 focus-visible:ring-primary/20"
                    {...field}
                  />
                  <FormMessage className="text-xs" />
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
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
