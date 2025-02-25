'use client';

import { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { UserColumn } from '@/types/admin-user';

interface UserDetailsDialogProps {
  user: UserColumn;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function UserDetailsDialog({ user, open, setOpen }: UserDetailsDialogProps) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/users/${user.id}/verify`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to verify user');

      toast.success('Success', {
        description: 'User verified successfully',
      });
      setOpen(false);
      window.location.reload();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to verify user',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason) {
      toast.error('Error', {
        description: 'Please provide a rejection reason',
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/users/${user.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      if (!response.ok) throw new Error('Failed to reject user');

      toast.success('Success', {
        description: 'User rejected successfully',
      });
      setOpen(false);
      window.location.reload();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to reject user',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset state when dialog closes
      setRejectionReason('');
      setIsLoading(false);
      // Add a small delay to ensure proper cleanup
      setTimeout(() => {
        document.body.style.pointerEvents = 'auto';
      }, 100);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="flex items-center gap-4">
            {user.image && (
              <Image
                src={user.image}
                alt={user.name || ''}
                width={100}
                height={100}
                className="rounded-full"
              />
            )}
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="flex gap-2 mt-1">
                <Badge>{user.role.toLowerCase()}</Badge>
                <Badge variant={
                  user.status === 'VERIFIED' ? 'default' :
                  user.status === 'PENDING' ? 'secondary' :
                  user.status === 'REJECTED' ? 'destructive' :
                  'outline'
                }>
                  {user.status.toLowerCase()}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div>
              <h4 className="text-sm font-medium mb-3">Personal Information</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Father&apos;s Name</Label>
                  <p>{user.profile?.fatherName || 'N/A'}</p>
                </div>
                <div>
                  <Label>Mother&apos;s Name</Label>
                  <p>{user.profile?.motherName || 'N/A'}</p>
                </div>
                <div>
                  <Label>Mobile Number</Label>
                  <p>{user.profile?.mobileNumber || 'N/A'}</p>
                </div>
                <div>
                  <Label>Birthday</Label>
                  <p>{user.profile?.birthday ? format(new Date(user.profile.birthday), 'PPP') : 'N/A'}</p>
                </div>
                <div>
                  <Label>Nationality</Label>
                  <p>{user.profile?.nationality || 'N/A'}</p>
                </div>
                <div>
                  <Label>Religion</Label>
                  <p>{user.profile?.religion || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Address Information</h4>
              <div className="grid gap-4">
                <div>
                  <Label>Present Address</Label>
                  <p className="whitespace-pre-wrap">{user.profile?.presentAddress || 'N/A'}</p>
                </div>
                <div>
                  <Label>Permanent Address</Label>
                  <p className="whitespace-pre-wrap">{user.profile?.permanentAddress || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Academic Information</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>SSC Registration Number</Label>
                  <p>{user.profile?.sscRegNumber || 'N/A'}</p>
                </div>
                <div>
                  <Label>SSC Roll Number</Label>
                  <p>{user.profile?.sscRollNumber || 'N/A'}</p>
                </div>
                <div>
                  <Label>Passing Year</Label>
                  <p>{user.profile?.passingYear || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Professional Information</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Occupation</Label>
                  <p>{user.profile?.occupation || 'N/A'}</p>
                </div>
                <div>
                  <Label>Employer Name</Label>
                  <p>{user.profile?.employerName || 'N/A'}</p>
                </div>
                <div>
                  <Label>Designation</Label>
                  <p>{user.profile?.designation || 'N/A'}</p>
                </div>
                <div>
                  <Label>Employer Address</Label>
                  <p className="whitespace-pre-wrap">{user.profile?.employerAddress || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Additional Information</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Reference</Label>
                  <p>{user.profile?.reference || 'N/A'}</p>
                </div>
                <div>
                  <Label>Joined Date</Label>
                  <p>{format(user.createdAt, 'PPP')}</p>
                </div>
              </div>
            </div>

            {user.profile?.signature && (
              <div>
                <Label>Signature</Label>
                <div className="mt-2">
                  <Image
                    src={user.profile.signature}
                    alt="Signature"
                    width={200}
                    height={100}
                    className="object-contain"
                  />
                </div>
              </div>
            )}
            {/* Add Membership Information */}
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Membership Information</h3>
            <div className="grid gap-4">
              <div className="flex justify-between">
                <span className="font-medium">Membership Type:</span>
                <span>{user.profile?.membershipType}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Membership Status:</span>
                <Badge variant={user.membership?.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {user.membership?.status}
                </Badge>
              </div>
              
              {/* Show latest membership payment details if exists */}
              {user.membership && (
                <>
                  <div className="flex justify-between">
                    <span className="font-medium">Payment Method:</span>
                    <span>{user.membership?.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Transaction ID:</span>
                    <span>{user.membership?.transactionId}</span>
                  </div>
                  {user.membership?.paymentProof && (
                    <div className="space-y-2">
                      <span className="font-medium">Payment Proof:</span>
                      <div className="relative h-40">
                        <Image
                          src={user.membership?.paymentProof}
                          alt="Payment proof"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          </div>

          {(user.status === 'INPROGRESS' || user.status === 'PAYMENT_PENDING') && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rejectionReason">Rejection Reason</Label>
                <Input
                  id="rejectionReason"
                  placeholder="Enter reason for rejection"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={isLoading}
                >
                  Reject
                </Button>
                <Button onClick={handleVerify} disabled={isLoading}>
                  Verify
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}