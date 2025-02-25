"use client";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AboutCTA = () => {
  return (
    <div className="relative h-[400px]">
      <Image
        src="/images/cta-background.jpg"
        alt="Join KHSAA"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
        <div className="text-center text-white max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Growing Alumni Community
          </h2>
          <p className="text-lg mb-8 text-gray-200">
            Connect with fellow alumni, access exclusive benefits, and help
            shape the future of our institution.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/register">Become a Member</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AboutCTA;
