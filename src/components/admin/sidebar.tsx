'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Users, 
  Calendar, 
  CreditCard, 
  LayoutDashboard,
  UsersRound,
  GalleryThumbnails,
} from 'lucide-react';
import TakaSvgIcon from '@/assets/icons/taka';

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
  },
  {
    label: 'Users',
    icon: Users,
    href: '/admin/users',
  },
  {
    label: 'Committee',
    icon: UsersRound,
    href: '/admin/committee',
  },
  {
    label: 'Gallery',
    icon: GalleryThumbnails,
    href: '/admin/gallery',
  },
  {
    label: 'Events',
    icon: Calendar,
    href: '/admin/events',
  },
  {
    label: 'Events Payment',
    icon: TakaSvgIcon,
    href: '/admin/events/payments',
  },
  {
    label: 'Membership Tiers',
    icon: CreditCard,
    href: '/admin/membership-tiers',
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full border-r w-64 bg-background">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">Admin Panel</h2>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                'flex items-center gap-x-2 px-4 py-2 text-sm rounded-lg transition-all hover:bg-accent hover:text-accent-foreground',
                pathname === route.href 
                  ? 'bg-accent text-accent-foreground' 
                  : 'text-muted-foreground'
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}