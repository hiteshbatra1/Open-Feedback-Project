"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Trash2, Clock } from "lucide-react";
import { Message } from "@/model/User";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import dayjs from "dayjs";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`,
      );

      toast.success("Message Deleted", {
        description: (
          <span className="text-emerald-600 font-medium">
            {response.data.message}
          </span>
        ),
      });

      onMessageDelete(message._id as any);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      toast.error("Error", {
        description: (
          <span className="text-red-500">
            {axiosError.response?.data.message ?? "Failed to delete message"}
          </span>
        ),
      });
    }
  };

  return (
    <Card className="rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-3 flex-1 min-w-0">
            <p className="text-gray-700 text-base md:text-lg leading-relaxed italic break-words whitespace-pre-wrap">
              {message.content}
            </p>

            <div className="flex items-center text-xs font-medium text-gray-400">
              <Clock className="w-3.5 h-3.5 mr-1.5 shrink-0" />
              {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="shrink-0 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Delete message"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this message?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently remove the
                  message from your dashboard.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-full">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="rounded-full bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}

export default MessageCard;
