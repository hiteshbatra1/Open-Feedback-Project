"use client";

import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-gray-100 py-6 md:py-8 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3 text-sm text-gray-500">
        <p>© {currentYear} Open Feedback. All rights reserved.</p>
        <span className="hidden md:block text-gray-300">•</span>

        <p className="flex items-center gap-1.5">
          Created by{" "}
          <Link
            href="https://www.linkedin.com/in/hitesh-batra-h"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-semibold text-gray-800 hover:text-primary transition-colors duration-200"
          >
            Hitesh Batra
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
