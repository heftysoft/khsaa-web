"use client";

import React from "react";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative h-[300px] w-full">
      <Image
        src="/images/about-banner.jpg"
        alt="About Us Banner"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white">About Us</h1>
      </div>
    </div>
  );
}
