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

  useEffect(() => {
    if (session?.user) {
      if (session.user.status !== 'VERIFIED' && !isProfilePage) {
        router.push('/dashboard/profile');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [session, isProfilePage, router]);

  if (!isAuthorized) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}