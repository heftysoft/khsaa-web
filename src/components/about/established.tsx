"use client";

import React from "react";
import Image from "next/image";

const Established = () => {
  return (
    <div className="container mx-auto py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="relative h-[400px] overflow-hidden">
          <Image
            src="/images/alumni-history.jpg"
            alt="Historical Alumni Gathering"
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div>
          <div className="flex items-baseline gap-4 mb-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              ESTD of This Alumni Association
            </h2>
            <span className="text-6xl md:text-8xl font-bold text-primary/20">
              2023
            </span>
          </div>
          <div className="space-y-6 text-muted-foreground">
            <p>
              Since its establishment in 2023, the Kurchhap High School Alumni
              Association has been a cornerstone of our educational community,
              fostering connections that span generations.
            </p>
            <p>
              A meeting was organized under the leadership of Honorable Alhaj
              Samiul Ahsan Bhuiyan, founder and president of the Managing
              Committee of Kurchap High School, at the call of former student
              Jahirul Islam (Batch 2007). Former students Mohammad Jahangir Alam
              (Batch 1984), Golam Mostafa (Batch 1984), Jahangir Alam (Batch
              1991), Kamruzzaman Kamrun (Batch 1992), Mahbubur Rahman Bhuiyan
              (Batch 1997), Anisuzzaman Khan (Batch 2005), and Jahirul Islam
              (Batch 2007) were present in the meeting. They highlight necessity
              and importance. The former students and Founder agreed to form an
              Alumni Association in the name of Kurchhap High School Alumni
              Association. In the discussion meeting, the initiative to form an
              alumni association comprising the former students of Kurchap High
              School was taken to the final stage.
            </p>
            <p>
              Our Association has grown from a small group of dedicated
              graduates to a thriving community of thousands, united by their
              shared experiences and commitment to supporting future
              generations.
            </p>
            <p>
              Through nearly two years of service, we have maintained our
              founding principles of excellence, community, and educational
              advancement while adapting to meet the evolving needs of our
              alumni and current students.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Established;
