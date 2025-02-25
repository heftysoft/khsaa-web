"use client";

import React from "react";
import { CalendarDays, GraduationCap, Users2, Trophy } from "lucide-react";

interface StatsProps {
  alumni?: number;
  awards?: number;
  events?: number;
  members?: number;
}

const Stats = ({ alumni, awards, events, members }: StatsProps) => {
  return (
    <div className="container mx-auto py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-3xl font-bold mb-2">{alumni}+</h3>
          <p className="text-muted-foreground">Alumni</p>
        </div>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Trophy className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-3xl font-bold mb-2">{awards}+</h3>
          <p className="text-muted-foreground">Awards Won</p>
        </div>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CalendarDays className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-3xl font-bold mb-2">{events}+</h3>
          <p className="text-muted-foreground">Events</p>
        </div>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Users2 className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-3xl font-bold mb-2">{members}+</h3>
          <p className="text-muted-foreground">Active Members</p>
        </div>
      </div>
    </div>
  );
};

export default Stats;
