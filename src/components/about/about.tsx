"use client";

import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const AboutSection = () => {
  return (
    <div className="container mx-auto py-12">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative h-[500px] rounded-lg overflow-hidden">
          <Image
            src="/images/about-content.jpg"
            alt="About KHSAA"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h4 className="text-primary font-semibold mb-4">WELCOME TO KHSAA</h4>
          <h2 className="text-3xl font-bold mb-6">
            We Are The Largest Alumni Association Since 2023
          </h2>
          <p className="text-muted-foreground mb-6">
            The Kurchhap High School Alumni Association (KHSAA) has been
            fostering connections between graduates for over three decades. Our
            commitment to excellence and community building has made us one of
            the most active alumni networks in the region.
          </p>
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <p className="text-muted-foreground">
                Supporting student scholarships and educational programs
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <p className="text-muted-foreground">
                Organizing networking events and professional development
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <p className="text-muted-foreground">
                Preserving and celebrating school history and traditions
              </p>
            </div>
          </div>
          <Button size="lg" asChild>
            <Link href="/register">Join Us Today</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
