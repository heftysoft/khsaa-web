"use client";

import { GraduationCap, Trophy, Users2 } from "lucide-react";
import React from "react";

const Mission = () => {
  return (
    <div className="bg-muted py-16">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h4 className="text-primary font-semibold mb-4">OUR MISSION</h4>
          <h2 className="text-3xl font-bold mb-6">What We Stand For</h2>
          <p className="text-muted-foreground">
            Our mission is to create a strong, supportive community that
            benefits both alumni and current students while preserving the
            legacy of our institution.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-background p-8 rounded-lg text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-4">Community Building</h3>
            <p className="text-muted-foreground">
              Creating lasting connections between alumni through networking
              events and reunions.
            </p>
          </div>
          <div className="bg-background p-8 rounded-lg text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-4">Education Support</h3>
            <p className="text-muted-foreground">
              Providing scholarships and resources for current and future
              students.
            </p>
          </div>
          <div className="bg-background p-8 rounded-lg text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold mb-4">Legacy Preservation</h3>
            <p className="text-muted-foreground">
              Maintaining and celebrating our school&apos;s rich history and
              achievements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mission;
