'use client';

import { useRouter } from 'next/navigation';
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

export type TierColumn = {
  id: string;
  name: string;
  type: string;
  period: string;
  amount: number;
  description: string;
  benefits: string[];
  createdAt: string;
};

const ActionCell = ({ tier }: { tier: TierColumn }) => {
  const router = useRouter();

  const onDelete = async () => {
    try {
      const response = await fetch(`/api/membership-tiers/${tier.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete tier');

      toast.success('Tier deleted successfully');
      router.refresh();
    } catch (error) {
      console.error('Error deleting tier:', error);
      toast.error('Failed to delete tier');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(tier.id)}>
          Copy ID
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`/admin/membership-tiers/${tier.id}`)}>
          Edit tier
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onDelete}
          className="text-red-600"
        >
          Delete tier
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<TierColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.type}</Badge>
    ),
  },
  {
    accessorKey: 'period',
    header: 'Billing Period',
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.period}</Badge>
    ),
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      return <div className="font-medium">${row.original.amount}</div>;
    },
  },
  {
    accessorKey: 'benefits',
    header: 'Benefits',
    cell: ({ row }) => {
      const benefits = row.original.benefits;
      return <div className="text-sm text-muted-foreground">{benefits.length} benefits</div>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionCell tier={row.original} />,
  },
];