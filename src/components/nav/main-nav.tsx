"use client";
import Link from "next/link"
import { usePathname } from "next/navigation"

import { siteConfig } from "@/configs/site"
import { Icons } from "@/components/common/icons"
import { useSession } from "next-auth/react";

export function MainNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path: string) => pathname?.startsWith(path);

  return (
    <div className="mr-4 hidden md:flex">
    <Link href="/" className="mr-4 flex items-center gap-2 lg:mr-6">
      <Icons.logo className="h-16 w-16" />
      <span className="hidden font-bold lg:inline-block">
        {siteConfig.name}
      </span>
    </Link>
    <nav className="flex items-center gap-4 text-sm xl:gap-6">
      <Link
        href="/about"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          isActive('/about')
            ? 'text-black dark:text-white'
            : 'text-muted-foreground'
        }`}
      >
        About
      </Link>
      <Link
        href="/events"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          isActive('/events')
            ? 'text-black dark:text-white'
            : 'text-muted-foreground'
        }`}
      >
        Events
      </Link>
      <Link
        href="/gallery"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          isActive('/gallery')
            ? 'text-black dark:text-white'
            : 'text-muted-foreground'
        }`}
      >
        Gallery
      </Link>
      {session ? (<Link
        href="/directory"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          isActive('/directory')
            ? 'text-black dark:text-white'
            : 'text-muted-foreground'
        }`}
      >
        Directory
      </Link>) : null}
      <Link
        href="/contact"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          isActive('/contact')
          ? 'text-black dark:text-white'
          : 'text-muted-foreground'
        }`}
        >
        Contact
      </Link>
      {session ? (
        <>
          {session.user.role === 'ADMIN' && (
            <Link
              href="/admin"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/admin')
                  ? 'text-black dark:text-white'
                  : 'text-muted-foreground'
              }`}
            >
              Admin
            </Link>
          )}
        </>
      ) : null}
    </nav>
  </div>
  );
}