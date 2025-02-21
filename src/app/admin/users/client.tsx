'use client';

import { columns } from './columns';
import { DataTable } from '@/components/admin/data-table';
import { UserColumn } from '@/types/admin-user';

interface UsersClientProps {
  data: UserColumn[];
}

export function UsersClient({ data }: UsersClientProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Users</h2>
      </div>
      <DataTable columns={columns} data={data} searchKey="email" />
    </div>
  );
}