'use client';

import { useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserDetailsDialog } from './user-details-dialog';
import { UserColumn } from '@/types/admin-user';

interface UserActionsProps {
  user: UserColumn;
}

export function UserActions({ user }: UserActionsProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${user.id}/verify`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to verify user');

      toast({
        title: 'Success',
        description: 'User verified successfully',
      });
      window.location.reload();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to verify user',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${user.id}/reject`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to reject user');

      toast({
        title: 'Success',
        description: 'User rejected successfully',
      });
      window.location.reload();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject user',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete user');

      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
      window.location.reload();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete user',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            View Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {user.status === 'PENDING' && (
            <>
              <DropdownMenuItem onClick={handleVerify} disabled={loading}>
                Verify User
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleReject} disabled={loading}>
                Reject User
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={loading}
            className="text-red-600"
          >
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserDetailsDialog
        user={user}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}