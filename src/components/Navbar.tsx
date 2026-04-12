"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";
import Image from "next/image";
import { LogOut, User as UserIcon } from "lucide-react";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 md:h-18">
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-80"
        >
          <Image
            src={"/open-feedback-logo.png"}
            alt="open-feedback-logo"
            width={100}
            height={32}
            priority
            className="object-contain"
          />
          <span className="text-lg md:text-xl font-bold tracking-tight text-gray-900 hidden sm:block">
            Open Feedback
          </span>
        </Link>

        <div className="flex items-center gap-3 md:gap-4">
          {session ? (
            <>
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full">
                <UserIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.username || user?.email}
                </span>
              </div>

              <Link href="/dashboard" className="hidden sm:block">
                <Button
                  variant="ghost"
                  className="font-medium text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </Button>
              </Link>

              <Button
                onClick={() => signOut()}
                variant="outline"
                className="font-medium border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2 hidden sm:block" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="font-medium text-gray-600 hover:text-gray-900 hidden sm:flex"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button className="font-medium rounded-full px-6 shadow-sm shadow-primary/20 hover:shadow-md transition-all">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
