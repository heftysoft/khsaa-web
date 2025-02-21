"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

interface Payment {
  id: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  status: string;
  proof: string;
  createdAt: string;
  event: {
    id: string;
    title: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function EventPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<string>("ALL");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/events/payments");
      const data = await res.json();
      setPayments(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch payments",
        variant: "destructive",
      });
    }
  };

  const handleApprove = async (eventId: string, paymentId: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `/api/events/${eventId}/payments/${paymentId}/approve`,
        {
          method: "POST",
        }
      );

      if (!res.ok) throw new Error("Failed to approve payment");

      toast({
        title: "Success",
        description: "Payment approved successfully",
      });
      fetchPayments();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (eventId: string, paymentId: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `/api/events/${eventId}/payments/${paymentId}/reject`,
        {
          method: "POST",
        }
      );

      if (!res.ok) throw new Error("Failed to reject payment");

      toast({
        title: "Success",
        description: "Payment rejected successfully",
      });
      fetchPayments();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get unique events for filter
  const events = Array.from(new Set(payments.map(p => p.event.id))).map(id => ({
    id,
    title: payments.find(p => p.event.id === id)?.event.title || ''
  }));

  // Filter payments based on status, event, and search query
  useEffect(() => {
    let filtered = [...payments];

    if (statusFilter !== "ALL") {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    if (selectedEvent !== "ALL") {
      filtered = filtered.filter(p => p.event.id === selectedEvent);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.user.name.toLowerCase().includes(query) ||
          p.user.email.toLowerCase().includes(query)
      );
    }

    setFilteredPayments(filtered);
  }, [payments, statusFilter, selectedEvent, searchQuery]);

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Event Payments</CardTitle>
          <CardDescription>Manage event payment approvals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="w-[200px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-[200px]">
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by event" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Events</SelectItem>
                  {events.map(event => (
                    <SelectItem key={event.id} value={event.id}>
                      {event.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Proof</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.event.title}</TableCell>
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
                    <TableCell>{format(new Date(payment.createdAt), "PPp")}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          payment.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : payment.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {payment.proof && (
                        <div
                          className="relative h-10 w-10 cursor-pointer rounded-md overflow-hidden"
                          onClick={() => setSelectedImage(payment.proof)}
                        >
                          <Image
                            src={payment.proof}
                            alt="Payment Proof"
                            fill
                            className="object-cover hover:opacity-80 transition-opacity"
                          />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {payment.status === "PENDING" && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleApprove(payment.event.id, payment.id)}
                            disabled={isLoading}
                            size="sm"
                          >
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleReject(payment.event.id, payment.id)}
                            disabled={isLoading}
                            variant="destructive"
                            size="sm"
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
        </CardContent>
      </Card>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Payment Proof</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="relative w-full h-[80vh]">
              <Image
                src={selectedImage}
                alt="Payment Proof"
                fill
                className="object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
