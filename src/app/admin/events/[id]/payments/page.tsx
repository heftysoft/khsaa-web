'use client';

import { useState, useEffect, use } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Payment {
  id: string;
  user: {
    name: string;
    email: string;
  };
  amount: number;
  paymentMethod: string;
  transactionId: string;
  status: string;
  proof: string;
  createdAt: string;
}

export default function EventPaymentsPage({ params }: { params: Promise<{ id: string }> }) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const { id } = use(params);

  useEffect(() => {
    fetchPayments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPayments = async () => {
    const res = await fetch(`/api/events/${id}/payments`);
    const data = await res.json();
    setPayments(data);
  };

  const handleUpdateStatus = async (paymentId: string, status: string) => {
    try {
      const res = await fetch(`/api/events/payments/${paymentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error('Failed to update payment status');

      toast.success('Success', {
        description: 'Payment status updated successfully',
      });
      fetchPayments();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to update payment status',
      });
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Event Payments</h1>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Proof</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{payment.user.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {payment.user.email}
                  </div>
                </div>
              </TableCell>
              <TableCell>৳{payment.amount}</TableCell>
              <TableCell>{payment.paymentMethod}</TableCell>
              <TableCell>{payment.transactionId}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    payment.status === 'APPROVED'
                      ? 'default'
                      : payment.status === 'REJECTED'
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {payment.status}
                </Badge>
              </TableCell>
              <TableCell>
                {payment.proof && (
                  <a
                    href={payment.proof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Proof
                  </a>
                )}
              </TableCell>
              <TableCell>
                {payment.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(payment.id, 'APPROVED')}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleUpdateStatus(payment.id, 'REJECTED')}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}