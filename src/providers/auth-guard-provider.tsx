'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/loading-spinner';

export default function AuthGuardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isProfilePage = pathname.startsWith('/dashboard/profile');
  const isDashboardPage = pathname.startsWith('/dashboard');

  useEffect(() => {
    if (status === 'loading') return;

    if (isAuthPage && session) {
      router.push('/dashboard');
      return;
    }

    if (!session && isDashboardPage) {
      router.push('/login');
      return;
    }

    if (session?.user.status !== 'VERIFIED' && isDashboardPage && !isProfilePage) {
      router.push('/dashboard/profile');
      return;
    }
  }, [session, status, pathname, router, isAuthPage, isDashboardPage, isProfilePage]);

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}