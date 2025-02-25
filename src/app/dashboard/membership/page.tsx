"use client";

import { useEffect, useState } from "react";
import { MotionDiv } from "@/components/motion";
import { toast } from "sonner";
import {
  MembershipDetails,
  type Membership,
  type MembershipTier,
} from "@/components/membership/membership-details";
import { type CreateMembershipFormData } from "@/components/membership/membership-details";

export default function MembershipPage() {
  const [membership, setMembership] = useState<Membership | null>(null);
  const [tiers, setTiers] = useState<MembershipTier[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membershipRes, tiersRes] = await Promise.all([
          fetch("/api/membership"),
          fetch("/api/membership/tiers"),
        ]);

        const [membershipData, tiersData] = await Promise.all([
          membershipRes.json(),
          tiersRes.json(),
        ]);

        setMembership(membershipData);
        setTiers(tiersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleCreateMembership = async (data: CreateMembershipFormData) => {
    try {
      const response = await fetch("/api/membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      setMembership(responseData);
      toast.success("Success", {
        description: "Membership created successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Error", {
        description: "Failed to create membership",
      });
    }
  };

  const handleCancelMembership = async () => {
    try {
      const response = await fetch(`/api/membership/${membership?.id}/cancel`, {
        method: "PATCH",
      });
      const data = await response.json();
      setMembership(data);
      toast.success("Success", {
        description: "Membership cancelled successfully",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Error", {
        description: "Failed to cancel membership",
      });
    }
  };

  const handleRenewMembership = async () => {
    try {
      const response = await fetch("/api/membership/renew", {
        method: "POST",
      });
      const data = await response.json();
      setMembership(data);
    } catch (error) {
      console.error("Error renewing membership:", error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-8">Membership Management</h1>
        <div className="max-w-2xl mx-auto">
          <MembershipDetails
            membership={membership}
            tiers={tiers}
            onCreateMembership={handleCreateMembership}
            onCancelMembership={handleCancelMembership}
            onRenewMembership={handleRenewMembership}
          />
        </div>
      </MotionDiv>
    </div>
  );
}
