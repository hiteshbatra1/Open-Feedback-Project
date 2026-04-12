"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, Send, Sparkles, User, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// const specialChar = "||";

// const parseStringMessages = (messageString: string): string[] => {
//   return messageString.split(specialChar);
// };
const suggestedMessagesPool = [
  "Your dedication towards development is inspiring.",
  "You are improving every day. Keep going!",
  "You have strong problem-solving skills.",
  "Your project structure is very clean and professional.",
  "Your UI design looks very modern and responsive.",
  "Your project structure is very clean and professional.",
  "I love how consistent you are with your work.",
  "You're doing an incredible job!",
  "I admire your consistency and dedication.",
  "What's your favorite movie?",
  "Do you have any pets?",
  "What's your dream job?",
  "What motivates you the most?",
  "What's your favorite food?",
  "Do you like traveling?",
  "What's your biggest goal in life?",
  "Are you a morning or night person?",
  "What is your hobby?",
  "What's your favorite book?",
  "What makes you happy?",
  "Do you like coding?",
];

const SendMessage = () => {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [displayedMessages, setDisplayedMessages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch("content");

  const handleMessageClick = (message: string) => {
    form.setValue("content", message);
  };

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        ...data,
        username,
      });

      toast.success("Success", {
        description: (
          <span className="text-emerald-600 font-medium">
            {response.data.message}
          </span>
        ),
      });
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error("Error", {
        description: (
          <span className="text-red-500">
            {axiosError.response?.data.message || "Failed to send message"}
          </span>
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };
  // const fetchSuggestedMethod = async () => {
  //   setIsSuggestLoading(true);
  //   try {
  //     const response = await axios.post<ApiResponse>("/api/suggest-messages");
  //     console.log(response);
  //   } catch (error) {
  //     const axiosError = error as AxiosError<ApiResponse>;
  //     toast.error("Error", {
  //       description: (
  //         <span className="text-red-500">
  //           {axiosError.response?.data.message}
  //         </span>
  //       ),
  //     });
  //   } finally {
  //     setIsSuggestLoading(false);
  //   }
  // };
  const fetchSuggestedMethod = () => {
    setIsSuggestLoading(true);

    const nextMessages = suggestedMessagesPool.slice(
      currentIndex,
      currentIndex + 3,
    );

    if (nextMessages.length === 0) {
      setCurrentIndex(0);
      setDisplayedMessages(suggestedMessagesPool.slice(0, 3));
    } else {
      setDisplayedMessages(nextMessages);
      setCurrentIndex((prev) => prev + 3);
    }

    setIsSuggestLoading(false);
  };

  useEffect(() => {
    setDisplayedMessages(suggestedMessagesPool.slice(0, 3));
    setCurrentIndex(3);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      {/* Main Messaging Card */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-100 p-6 md:p-10 space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
              Public Profile
            </h1>
            <p className="text-gray-500 mt-1">
              Send an anonymous message to{" "}
              <span className="font-semibold text-gray-800">@{username}</span>
            </p>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="content"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Type your secret message here..."
                      className="resize-none min-h-[120px] transition-all duration-200 focus-visible:ring-primary/20 text-base p-4 bg-gray-50 hover:bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                disabled={isLoading || !messageContent}
                className="w-full sm:w-auto px-8 transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
        <div className="pt-6 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Need inspiration?
              </h3>
              <p className="text-sm text-gray-500">
                Click a message below to select it.
              </p>
            </div>
            <Button
              type="button"
              onClick={fetchSuggestedMethod}
              variant="outline"
              size="sm"
              disabled={isSuggestLoading}
              className="text-primary border-primary/20 hover:bg-primary/5 transition-colors"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Suggest New
            </Button>
          </div>

          <div className="grid gap-3">
            {displayedMessages.map((message, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleMessageClick(message)}
                className="w-full text-left px-5 py-3.5 text-sm md:text-base text-gray-700 bg-white border border-gray-200 hover:border-primary/40 hover:bg-primary/5 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {message}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-2xl mt-8 pt-8">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-center shadow-lg text-white">
          <div className="flex justify-center mb-4">
            <div className="bg-white/10 p-3 rounded-full">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="text-xl md:text-2xl font-bold mb-2">
            Want your own message board?
          </h2>
          <p className="text-gray-300 mb-6 max-w-md mx-auto text-sm md:text-base">
            Create an account to get your personal link and start receiving
            anonymous feedback from your friends and audience.
          </p>
          <Link href="/sign-up">
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 rounded-full px-8 font-semibold transition-transform hover:scale-105"
            >
              Create Your Account Free
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SendMessage;
