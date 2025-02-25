"use client";

import { UserNav } from "@/components/nav/user-nav";

import { motion } from "framer-motion";
import { MainNav } from "@/components/nav/main-nav";
import { ModeSwitcher } from "../nav/mode-switcher";
import { Button } from "../ui/button";
import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useSession } from "next-auth/react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { status, data } = useSession();
  return (
    <motion.header
      className="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container-wrapper">
        <div className="container flex h-16 items-center">
          <MainNav />
          <div className="flex flex-1 items-center justify-end space-x-4">
            <UserNav user={data?.user} />
            {status !== "authenticated" && (
              <div className="hidden md:flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Join Now</Link>
                </Button>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <ModeSwitcher />
          </div>

        </div>
      </div>
    </motion.header>
  );
}
