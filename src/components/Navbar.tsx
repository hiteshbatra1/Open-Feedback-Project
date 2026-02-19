"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { User } from "next-auth";
import Image from "next/image";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user;
  return (
    <nav className="w-full border-b border-gray-800 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-18">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image
            src={"/open-feedback-logo.png"}
            alt="open-feedback-logo"
            width={120}
            height={30}
            priority
            className="object-contain"
          />
          <span className="text-lg md:text-xl font-semibold tracking-tight">
            Open Feedback
          </span>
        </Link>
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="hidden lg:block text-sm text-gray-300">
                Welcome, {user.username || user.email}
              </span>
              <Button
                onClick={() => signOut()}
                className="bg-slate-100 text-black hover:bg-slate-200"
                variant="outline"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button
                className="w-full md:w-auto bg-slate-100 text-black"
                variant={"outline"}
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
