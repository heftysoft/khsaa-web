'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import Image from 'next/image';
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEdit?: (item: any) => void;
  onDelete?: (id: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const columns = ({ onEdit, onDelete }: DataTableProps): ColumnDef<any>[] => [
  {
    accessorKey: 'image',
    header: 'Image',
    cell: ({ row }) => (
      <div className="relative h-20 w-20">
        <Image
          src={row.getValue('image')}
          alt={row.getValue('title')}
          fill
          className="object-cover rounded-md"
        />
      </div>
    ),
  },
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'order',
    header: 'Order',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => format(new Date(row.getValue('createdAt')), 'PPp'),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(item)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete?.(item.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];