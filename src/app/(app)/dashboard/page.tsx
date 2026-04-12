"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Message } from "@/model/User";
import { acceptMessagesSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import {
  Loader2,
  RefreshCcw,
  Copy,
  Inbox,
  Link as LinkIcon,
  Settings2,
} from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const UserDashboard = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageId: string) => {
    setMessages(
      messages.filter((message) => message._id.toString() !== messageId),
    );
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessagesSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", {
        description: (
          <span className="text-red-500">
            {axiosError.response?.data.message || "Failed to fetch settings"}
          </span>
        ),
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(false);

    try {
      const response = await axios.get("/api/get-messages");
      setMessages(response.data.messages || []);
      if (refresh) {
        toast.success("Messages Refreshed", {
          description: (
            <span className="text-emerald-600 font-medium">
              Showing latest messages
            </span>
          ),
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", {
        description: (
          <span className="text-red-500">
            {axiosError.response?.data.message || "Failed to fetch messages"}
          </span>
        ),
      });
    } finally {
      setIsLoading(false);
      setIsSwitchLoading(false);
    }
  }, []);

  // fetch intial state from server
  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessages();
  }, [session, setValue, fetchAcceptMessages, fetchMessages]);
  // handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success("Success", {
        description: (
          <span className="text-emerald-600 font-medium">
            {response.data.message}
          </span>
        ),
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error("Error", {
        description: (
          <span className="text-red-500">
            {axiosError.response?.data.message || "Failed to update settings"}
          </span>
        ),
      });
    }
  };

  if (!session || !session.user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-100 p-8 text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900">Please log in</h1>
          <p className="text-gray-500">
            You need to be authenticated to view your dashboard.
          </p>
        </div>
      </div>
    );
  }
  const { username } = session.user as User;
  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "";
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Link Copied!", {
      description: (
        <span className="text-emerald-600 font-medium">
          Profile URL has been copied to clipboard
        </span>
      ),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Welcome back, <span className="text-primary">@{username}</span>
            </h1>
            <p className="text-gray-500 mt-2">
              Manage your anonymous messages and profile settings.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <div className="flex items-center gap-2 mb-4">
            <LinkIcon className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">
              Share Your Link
            </h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Share this link on your social media to start receiving anonymous
            feedback.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Input
              type="text"
              value={profileUrl}
              readOnly
              className="bg-gray-50 border-gray-200 text-gray-600 focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
            />
            <Button
              onClick={copyToClipboard}
              className="w-full sm:w-auto shrink-0 transition-all"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Switch Setting */}
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <Settings2 className="w-5 h-5 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-900">
                Accept Messages
              </span>
              <span className="text-sm text-gray-500">
                {acceptMessages
                  ? "People can send you messages"
                  : "Your inbox is paused"}
              </span>
            </div>
            <div className="ml-auto sm:ml-4">
              <Switch
                {...register("acceptMessages")}
                checked={acceptMessages}
                onCheckedChange={handleSwitchChange}
                disabled={isSwitchLoading}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>

          <Separator className="sm:hidden" />
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCcw className="h-4 w-4 mr-2 text-gray-500" />
            )}
            Refresh Messages
          </Button>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Your Messages
          </h2>

          {messages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {messages.map((message) => (
                <MessageCard
                  key={message._id.toString()}
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                <Inbox className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                No messages yet
              </h3>
              <p className="text-gray-500 max-w-sm">
                Share your profile link with friends or on social media to start
                receiving anonymous messages.
              </p>
              <Button
                variant="default"
                className="mt-6"
                onClick={copyToClipboard}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Profile Link
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
