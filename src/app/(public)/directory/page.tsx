'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from '@prisma/client';

interface AlumniProfile extends User {
  profile: {
    passingYear: number;
    occupation: string;
    company: string;
  } | null;
}

export default function DirectoryPage() {
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAlumni = async () => {
      try {
        const response = await fetch('/api/alumni');
        const data = await response.json();
        setAlumni(data);
      } catch (error) {
        console.error('Error fetching alumni:', error);
      }
    };

    fetchAlumni();
  }, []);

  const filteredAlumni = alumni.filter((member) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      member.name?.toLowerCase().includes(searchLower) ||
      member.profile?.occupation?.toLowerCase().includes(searchLower) ||
      member.profile?.company?.toLowerCase().includes(searchLower) ||
      member.profile?.passingYear?.toString().includes(searchQuery)
    );
  });

  return (
    <div className="container mx-auto py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8">Alumni Directory</h1>
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search by name, occupation, company, or graduation year"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.image || undefined} alt={member.name || ''} />
                    <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <CardTitle>{member.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {member.profile?.passingYear && (
                      <p className="text-sm">Class of {member.profile.passingYear}</p>
                    )}
                    {member.profile?.occupation && (
                      <p className="text-sm">{member.profile.occupation}</p>
                    )}
                    {member.profile?.company && (
                      <p className="text-sm text-muted-foreground">{member.profile.company}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}