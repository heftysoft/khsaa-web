import { format } from "date-fns";
import { db } from "@/lib/db";
import { DataTable } from "@/components/admin/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function MembershipTiersPage() {
  const tiers = await db.membershipTier.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedTiers = tiers.map((tier) => ({
    id: tier.id,
    name: tier.name,
    type: tier.type,
    period: tier.period,
    amount: tier.amount,
    description: tier.description || "N/A",
    benefits: tier.benefits,
    createdAt: format(tier.createdAt, "PPP"),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Membership Tiers</h1>
        <Button asChild>
          <Link href="/admin/membership-tiers/new">Add New Tier</Link>
        </Button>
      </div>
      <DataTable columns={columns} data={formattedTiers} searchKey="name" />
    </div>
  );
}