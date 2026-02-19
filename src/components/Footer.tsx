"use client";
import Link from "next/link";

const Footer = () => {
  return (
    <div>
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © 2026 Open Feedback. Created by{" "}
        <span className="text-blue-200">
          <Link href="https://www.linkedin.com/in/hitesh-batra-h">
            Hitesh Batra
          </Link>
        </span>
        . All rights reserved.
      </footer>
    </div>
  );
};

export default Footer;
