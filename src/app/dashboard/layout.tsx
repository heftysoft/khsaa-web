import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Header } from "@/components/common/header";
import Link from "next/link";
import { ProfileGuard } from "@/components/auth/profile-guard";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const isVerified = session.user.status === 'VERIFIED';
  const isPaymentPending = session.user.status === 'PAYMENT_PENDING';
  const isInProgress = session.user.status === 'INPROGRESS';

  return (
    <ProfileGuard>
      <div className="flex min-h-screen flex-col space-y-6">
        <Header />
        <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
          <aside className="hidden w-[200px] flex-col md:flex">
            <nav className="grid items-start gap-2">
              <Link
                className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                  !isVerified ? 'opacity-50 pointer-events-none' : 'hover:bg-accent hover:text-accent-foreground'
                }`}
                href="/dashboard"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Overview
              </Link>
              <Link
                className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                  isPaymentPending && !isInProgress ? 'opacity-50 pointer-events-none' : 'hover:bg-accent hover:text-accent-foreground'
                }`}
                href="/dashboard/profile"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Profile
              </Link>
              <Link
                className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                  !isVerified  ? 'opacity-50 pointer-events-none' : 'hover:bg-accent hover:text-accent-foreground'
                }`}
                href="/dashboard/events"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Events
              </Link>
              <Link
                className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                  !isVerified && !isPaymentPending ? 'opacity-50 pointer-events-none' : 'hover:bg-accent hover:text-accent-foreground'
                }`}
                href="/dashboard/membership"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Membership
              </Link>
            </nav>
          </aside>
          <main className="flex w-full flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </ProfileGuard>
  );
}