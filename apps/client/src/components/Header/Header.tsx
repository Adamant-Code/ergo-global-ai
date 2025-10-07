"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useSession } from "next-auth/react";

const Header = () => {
  const { logout } = useAuth();
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="relative max-w-5xl mx-auto py-3 border-b border-gray-100">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-light text-gray-900 tracking-wide">
          <span className="font-normal">
            {session ? "Welcome" : "Template"}
          </span>
          <span className="text-indigo-400 font-light">
            {session ? " Back" : ""}
          </span>
        </h1>

        <nav className="flex items-center space-x-8">
          {navItems.map((item) => {
            if (item.authType === "auth" && !session) return null;
            if (item.authType === "unauth" && session) return null;
            if (item.href === "") {
              return (
                <button
                  key={item.name}
                  onClick={handleLogout}
                  className={`text-gray-600 hover:${item.style} font-medium transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:${item.style} after:transition-all after:duration-300`}
                >
                  {item.name}
                </button>
              );
            }
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`text-gray-600 hover:${item.style} font-medium transition-colors duration-300 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:${item.style} after:transition-all after:duration-300`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div>
    </header>
  );
};

const navItems = [
  {
    authType: "unauth",
    name: "Home",
    href: "/",
    style: "text-gray-900 hover:text-blue-800 after:bg-blue-800",
  },
  {
    authType: "auth",
    name: "Chat",
    href: "/chat",
    style: "text-gray-900 hover:text-blue-800 after:bg-blue-800",
  },
  {
    authType: "unauth",
    name: "Login",
    href: "/login",
    style: "text-gray-900 hover:text-blue-800 after:bg-blue-800",
  },
  {
    authType: "unauth",
    name: "Register",
    href: "/register",
    style: "text-gray-900 hover:text-green-800 after:bg-green-800",
  },
  {
    authType: "auth",
    name: "Billing",
    href: "/billing",
    style: "text-gray-900 hover:text-green-800 after:bg-green-800",
  },
  {
    href: "",
    authType: "auth",
    name: "Logout",
    style: "text-gray-900 hover:text-red-800 after:bg-red-800",
  },
];

export default Header;
