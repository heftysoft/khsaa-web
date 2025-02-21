'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Twitter, Youtube, Linkedin, Instagram } from 'lucide-react';
import Logo from '@/assets/logo.svg';

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="container-wrapper">
        <div className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and About */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <Image 
                  src={Logo} 
                  alt="KHSAA Logo" 
                  width={60} 
                  height={60}
                />
                <span className="font-bold">
                  Alumni Association
                </span>
              </Link>
              <p className="text-muted-foreground text-sm">
                Alumni Association of the Kurchhap High School. The best school in the world located in Debidware.
              </p>
            </div>

            {/* University */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">School</h3>
              <div className="grid grid-cols-1 gap-2">
                {/* <Link href="/students" className="text-muted-foreground hover:text-foreground">
                  Students
                </Link> */}
                <Link href="/events" className="text-muted-foreground hover:text-foreground">
                  Events
                </Link>
                <Link href="/gallery" className="text-muted-foreground hover:text-foreground">
                  Gallery
                </Link>
                {/* <Link href="/news" className="text-muted-foreground hover:text-foreground">
                  News
                </Link> */}
              </div>
            </div>

            {/* Alumni */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Alumni</h3>
              <div className="grid grid-cols-1 gap-2">
                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                  Terms
                </Link>
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground">
                Privacy Policy
                </Link>
                {/* <Link href="/career" className="text-muted-foreground hover:text-foreground">
                  Career
                </Link> */}
                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                  About Us
                </Link>
                {/* <Link href="/apply-to-job" className="text-muted-foreground hover:text-foreground">
                  Apply to Job
                </Link> */}
              </div>
            </div>

            {/* Account */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Account</h3>
              <div className="grid grid-cols-1 gap-2">
                <Link href="/dashboard/profile" className="text-muted-foreground hover:text-foreground">
                  Profile
                </Link>
                {/* <Link href="/stories" className="text-muted-foreground hover:text-foreground">
                  Stories
                </Link> */}
                {/* <Link href="/password" className="text-muted-foreground hover:text-foreground">
                  Password
                </Link>
                <Link href="/downloads" className="text-muted-foreground hover:text-foreground">
                  Downloads
                </Link> */}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Alumni Association of the Kurchhap High School
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Youtube className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}