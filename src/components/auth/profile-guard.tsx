'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LoadingSpinner } from '@/components/loading-spinner';

export function ProfileGuard({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  const isProfilePage = pathname.startsWith('/dashboard/profile');
  const isMembershipPage = pathname.startsWith('/dashboard/membership');

  useEffect(() => {
    if (session?.user) {
      const { status } = session.user;

      if (status === 'VERIFIED') {
        setIsAuthorized(true);
      } else if (status === 'PAYMENT_PENDING') {
        if (isMembershipPage) {
          setIsAuthorized(true);
        } else {
          router.push('/dashboard/membership');
        }
      } else {
        if (isProfilePage) {
          setIsAuthorized(true);
        } else {
          router.push('/dashboard/profile');
        }
      }
    }
  }, [session, isProfilePage, isMembershipPage, router]);

  if (!isAuthorized) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}