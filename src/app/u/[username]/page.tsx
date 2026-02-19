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
import { Loader2 } from "lucide-react";
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
          <span className="text-green-500">{response.data.message}</span>
        ),
      });
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error("Error", {
        description: (
          <span className="text-red-500">
            {axiosError.response?.data.message}
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
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={isLoading || !messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>
      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button
            onClick={fetchSuggestedMethod}
            className="my-4"
            disabled={isSuggestLoading}
          >
            Suggest Messages
          </Button>
          <p>Click on any message below to select it.</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {displayedMessages.map((message, index) => (
              <Button
                key={index}
                variant="outline"
                className="mb-2"
                onClick={() => handleMessageClick(message)}
              >
                {message}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={"/sign-up"}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
};

export default SendMessage;
