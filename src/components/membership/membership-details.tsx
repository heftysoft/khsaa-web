/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { MembershipTiers } from '@/components/membership-tiers';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import { FileUpload } from '@/components/file-upload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface MembershipTier {
  id: string;
  name: string;
  type: 'GENERAL' | 'DONOR' | 'LIFETIME_DONOR';
  period: 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'ONE_TIME';
  amount: number;
  description: string | null;
  benefits: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateMembershipFormData {
  tierId: string;
  paymentMethod: 'BANK' | 'BKASH' | 'NAGAD' | 'ROCKET';
  transactionId: string;
  paymentDetails: string;
  paymentProof?: string;
}

export interface Membership {
  id: string;
  startDate: string;
  endDate?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING' | 'CANCELLED';
  amount: number;
  tier: MembershipTier;
  paymentMethod?: 'BANK' | 'BKASH' | 'NAGAD' | 'ROCKET';
  transactionId?: string;
  paymentDetails?: string;
  paymentProof?: string;
}

interface MembershipDetailsProps {
  membership: Membership | null;
  tiers: MembershipTier[];
  onCreateMembership: (data: CreateMembershipFormData) => Promise<void>;
  onCancelMembership: () => Promise<void>;
  onRenewMembership: () => Promise<void>;
  showActions?: boolean;
}

export function MembershipDetails({
  membership,
  tiers,
  onCreateMembership,
  onCancelMembership,
  onRenewMembership,
  showActions = true,
}: MembershipDetailsProps) {
  const [formData, setFormData] = useState<CreateMembershipFormData>({
    tierId: '',
    paymentMethod: 'BANK',
    transactionId: '',
    paymentDetails: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateMembership = async () => {
    if (!formData.tierId) return;
    setIsLoading(true);
    try {
      await onCreateMembership(formData);
      toast({
        title: 'Membership created successfully',
        description: 'You can now start using the platform',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-500';
      case 'EXPIRED':
        return 'bg-red-500';
      case 'PENDING':
        return 'bg-yellow-500';
      case 'CANCELLED':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-8">
      {!membership && showActions && (
        <Card>
          <CardHeader>
            <CardTitle>Choose a Membership Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <MembershipTiers
                tiers={tiers}
                onSelect={(id) => setFormData((prev: any) => ({ ...prev, tierId: id }))}
                selectedTierId={formData.tierId}
              />

              {formData.tierId && (
                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-medium">Payment Information</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <Select
                        value={formData.paymentMethod}
                        onValueChange={(value) => 
                          setFormData((prev: any) => ({ ...prev, paymentMethod: value as any }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BANK">Bank Transfer</SelectItem>
                          <SelectItem value="BKASH">bKash</SelectItem>
                          <SelectItem value="NAGAD">Nagad</SelectItem>
                          <SelectItem value="ROCKET">Rocket</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Transaction ID</Label>
                      <Input
                        value={formData.transactionId}
                        onChange={(e) => 
                          setFormData((prev: any) => ({ ...prev, transactionId: e.target.value }))
                        }
                        placeholder="Enter transaction ID"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Payment Details</Label>
                      <Textarea
                        value={formData.paymentDetails}
                        onChange={(e) => 
                          setFormData((prev: any) => ({ ...prev, paymentDetails: e.target.value }))
                        }
                        placeholder="Enter payment details"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Payment Proof</Label>
                      <FileUpload
                        onChange={(url) => 
                          setFormData((prev: any) => ({ ...prev, paymentProof: url }))
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              onClick={handleCreateMembership}
              disabled={!formData.tierId || !formData.transactionId || !formData.paymentDetails || isLoading}
            >
              {isLoading ? 'Processing...' : 'Submit Application'}
            </Button>
          </CardFooter>
        </Card>
      )}

      {membership && membership.status !== 'CANCELLED' ? (
        <Card>
          <CardHeader>
            <CardTitle>Membership Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Plan</span>
                  <span className="text-sm">{membership.tier.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge variant="secondary" className={`${getStatusColor(membership.status)} text-white`}>
                    {membership.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Start Date</span>
                  <span className="text-sm">
                    {format(new Date(membership.startDate), 'PPP')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">End Date</span>
                  <span className="text-sm">
                    {membership.endDate ? format(new Date(membership.endDate), 'PPP') : '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Amount Paid</span>
                  <span className="text-sm">${membership.amount}</span>
                </div>
              </div>

              {/* Payment Information */}
              {membership.paymentMethod && (
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="text-sm font-medium">Payment Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Payment Method</span>
                      <span className="text-sm">{membership.paymentMethod}</span>
                    </div>
                    {membership.transactionId && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Transaction ID</span>
                        <span className="text-sm">{membership.transactionId}</span>
                      </div>
                    )}
                    {membership.paymentDetails && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Payment Details</span>
                        <span className="text-sm">{membership.paymentDetails}</span>
                      </div>
                    )}
                    {membership.paymentProof && (
                      <div className="space-y-2">
                        <span className="text-sm font-medium">Payment Proof</span>
                        <div className="relative h-40 w-full">
                          <Image
                            src={membership.paymentProof}
                            alt="Payment proof"
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          {showActions && (
            <CardFooter className="flex justify-end gap-2">
              {membership.status === 'ACTIVE' && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">Cancel Membership</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Cancel Membership</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to cancel your membership? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={onCancelMembership}>
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              {membership.status === 'EXPIRED' && (
                <Button onClick={onRenewMembership}>Renew Membership</Button>
              )}
            </CardFooter>
          )}
        </Card>
      ) : (
        <>
          {membership?.status === 'CANCELLED' && (
            <Card className="bg-muted">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p>Your previous membership was cancelled. Choose a new plan to continue.</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* {showActions && (
            <Card>
              <CardHeader>
                <CardTitle>Choose a Membership Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <MembershipTiers
                  tiers={tiers}
                  onSelect={(id) => setFormData((prev: any) => ({ ...prev, tierId: id }))}
                  selectedTierId={formData.tierId}
                />
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  onClick={handleCreateMembership}
                  disabled={!formData.tierId || isLoading}
                >
                  {isLoading ? 'Processing...' : 'Get Started'}
                </Button>
              </CardFooter>
            </Card>
          )} */}
        </>
      )}
    </div>
  );
}