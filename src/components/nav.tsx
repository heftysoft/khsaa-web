'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function MainNav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isActive = (path: string) => pathname === path;

  return (
    <motion.nav
      className="flex items-center space-x-4 lg:space-x-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href="/"
        className={`text-sm font-medium transition-colors hover:text-primary ${
          isActive('/') ? 'text-black dark:text-white' : 'text-muted-foreground'
        }`}
      >
        Home
      </Link>
      {session ? (
        <>
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
            href="/directory"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/directory')
                ? 'text-black dark:text-white'
                : 'text-muted-foreground'
            }`}
          >
            Directory
          </Link>
          <Link
            href="/membership"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/membership')
                ? 'text-black dark:text-white'
                : 'text-muted-foreground'
            }`}
          >
            Membership
          </Link>
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
    </motion.nav>
  );
}

export function UserNav() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return null;
  }

  return session ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <span className="sr-only">Open user menu</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {session.user?.name?.[0] || session.user?.email?.[0] || 'U'}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/api/auth/signout">Sign out</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <div className="flex items-center space-x-2">
      <Link href="/login">
        <Button variant="ghost">Sign in</Button>
      </Link>
      <Link href="/register">
        <Button>Join Now</Button>
      </Link>
    </div>
  );
}