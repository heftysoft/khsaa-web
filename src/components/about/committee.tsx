"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

type Member = {
  id: string;
  image: string;
  name: string;
  designation: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

const Committee = () => {
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('/api/admin/committee');
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };
    fetchMembers();
  }, []);

  return (
    <div className="container mx-auto py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Honorable Committee</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet the dedicated individuals who lead and guide our alumni
            association
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.length > 0
            ? members.map((member) => (
                <div key={member.id} className="text-center group">
                  <div className="relative h-[300px] mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="bg-primary text-primary-foreground py-4 px-6 rounded-lg">
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className="text-primary-foreground/80">
                      {member.designation}
                    </p>
                  </div>
                </div>
              ))
            : null}
        </div>
      </div>
  )
}

export default Committee