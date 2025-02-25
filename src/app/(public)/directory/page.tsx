"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "@prisma/client";
import {
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface PaginationData {
  total: number;
  pages: number;
  currentPage: number;
  limit: number;
}

interface ApiResponse {
  alumni: AlumniProfile[];
  pagination: PaginationData;
}

// Update the AlumniProfile interface to include membershipType
interface AlumniProfile extends User {
  profile: {
    passingYear: number;
    occupation: string;
    designation: string;
    employerName: string;
    photo: string;
    socialLinks: {
      facebook?: string;
      linkedin?: string;
      twitter?: string;
      instagram?: string;
    };
    presentAddress: string;
    mobileNumber: string;
    membershipType: "LIFETIME" | "HONORABLE" | "GENERAL";
  } | null;
}

// Add this new component for the badge
const MembershipBadge = ({ type }: { type: string }) => {
  const badgeStyles = {
    LIFETIME: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white",
    HONORABLE: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white",
    GENERAL: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
  }[type];

  const badgeText = {
    LIFETIME: "Lifetime Member",
    HONORABLE: "Honorable Member",
    GENERAL: "General Member",
  }[type];

  return (
    <div
      className={`absolute top-4 right-4 z-20 px-3 py-1 rounded-full text-xs font-semibold ${badgeStyles}`}
    >
      {badgeText}
    </div>
  );
};

export default function DirectoryPage() {
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    pages: 0,
    currentPage: 1,
    limit: 9,
  });

  const fetchAlumni = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/alumni?page=${page}&limit=${pagination.limit}`
      );
      const data: ApiResponse = await response.json();
      setAlumni(data.alumni);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching alumni:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumni(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredAlumni = alumni.filter((member) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      member.name?.toLowerCase().includes(searchLower) ||
      member.profile?.occupation?.toLowerCase().includes(searchLower) ||
      member.profile?.employerName?.toLowerCase().includes(searchLower) ||
      member.profile?.passingYear?.toString().includes(searchQuery)
    );
  });

  const LoadingSkeleton = () => (
    <>
      {[1, 2, 3].map((i) => (
        <Card key={i} className="group">
          <CardHeader className="relative">
            <div className="relative z-20 flex flex-col items-center text-center pt-8">
              <Skeleton className="h-24 w-24 rounded-full" />
              <Skeleton className="h-6 w-32 mt-4" />
              <Skeleton className="h-4 w-24 mt-2" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="space-y-2">
                {[1, 2, 3].map((j) => (
                  <Skeleton key={j} className="h-4 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
  console.log(filteredAlumni)

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
          {isLoading ? (
            <LoadingSkeleton />
          ) : filteredAlumni.length > 0 ? (
            filteredAlumni.map((member) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    {member.profile?.membershipType && (
                      <MembershipBadge type={member.profile.membershipType} />
                    )}
                    <div className="relative z-20 flex flex-col items-center text-center pt-8">
                      <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                        <AvatarImage
                          src={member.profile?.photo || undefined}
                          alt={member.name || ""}
                        />
                        <AvatarFallback className="text-2xl">
                          {member.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <CardTitle className="mt-4 text-white">
                        {member.name?.toUpperCase()}
                      </CardTitle>
                      {member.profile?.designation && (
                        <p className="text-sm text-white/90 mt-1">
                          {member.profile.designation}
                        </p>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        {member.profile?.passingYear && (
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm font-medium">
                              Class of {member.profile.passingYear}
                            </p>
                          </div>
                        )}
                        {member.profile?.occupation && (
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {member.profile.occupation}
                            </p>
                          </div>
                        )}
                        {member.profile?.employerName && (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {member.profile.employerName}
                            </p>
                          </div>
                        )}
                        {member.profile?.mobileNumber && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <a href={`tel:${member.profile.mobileNumber}`}>
                              <p className="text-sm text-muted-foreground hover:underline">
                                {member.profile.mobileNumber}
                              </p>
                            </a>
                          </div>
                        )}
                        {member.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <a href={`mailto:${member.email}`}>
                              <p className="text-sm text-muted-foreground hover:underline">
                                {member.email}
                              </p>
                            </a>
                          </div>
                        )}
                      </div>

                      {member.profile?.socialLinks && (
                        <div className="flex items-center gap-2 pt-2 border-t">
                          {member.profile.socialLinks.facebook && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:text-[#1877F2]"
                              asChild
                            >
                              <a
                                href={member.profile.socialLinks.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Facebook className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          {member.profile.socialLinks.linkedin && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:text-[#0A66C2]"
                              asChild
                            >
                              <a
                                href={member.profile.socialLinks.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Linkedin className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          {member.profile.socialLinks.twitter && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:text-[#1DA1F2]"
                              asChild
                            >
                              <a
                                href={member.profile.socialLinks.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Twitter className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          {member.profile.socialLinks.instagram && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:text-[#E4405F]"
                              asChild
                            >
                              <a
                                href={member.profile.socialLinks.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Instagram className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <p className="text-muted-foreground col-span-3 text-center">
              No alumni found
            </p>
          )}
        </div>

        {!searchQuery && pagination.pages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAlumni(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
              (page) => (
                <Button
                  key={page}
                  variant={
                    pagination.currentPage === page ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => fetchAlumni(page)}
                  disabled={isLoading}
                  className="w-8"
                >
                  {page}
                </Button>
              )
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAlumni(pagination.currentPage + 1)}
              disabled={
                pagination.currentPage === pagination.pages || isLoading
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
