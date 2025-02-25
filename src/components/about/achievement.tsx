"use client";

import React from "react";
import Image from "next/image";

const Achievement = () => {
  return (
    <div className="container mx-auto py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <div className="flex items-baseline gap-4 mb-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Our First Achievement in History
            </h2>
            <span className="text-6xl md:text-8xl font-bold text-primary/20">
              2012
            </span>
          </div>
          <div className="space-y-6 text-muted-foreground">
            <p>
              In 2012, Kurchhap High School marked a significant milestone in
              its history with the establishment of its first formal alumni
              gathering, bringing together graduates from across different
              generations.
            </p>
            <p>
              This historic event laid the foundation for what would become a
              tradition of annual reunions, fostering lasting connections
              between alumni and strengthening our school’s community bonds.
            </p>
            <p>
              This reunions arrange our senior ex-student community, Then we
              were inspired to establish our Alumni Association.
            </p>
            <p>
              The success of this initial gathering demonstrated the strong
              sense of belonging and pride that our alumni felt towards their
              alma mater, setting the stage for decades of continued growth and
              achievement.
            </p>
          </div>
        </div>
        <div className="relative h-[400px] overflow-hidden order-1 md:order-2">
          <Image
            src="/images/first-achievement.jpg"
            alt="First Alumni Achievement"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Achievement;
