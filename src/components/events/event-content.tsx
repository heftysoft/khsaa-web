"use client";
import Image from "next/image";
import { useCountdown } from "@/hooks/use-countdown";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TakaSvgIcon from '@/assets/icons/taka';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { Event } from "@/types/event";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface EventContentProps {
  event: Event;
  onJoin: () => Promise<void>;
  onCancel: () => Promise<void>;
  isJoining: boolean;
  isCanceling: boolean;
  showPaymentDialog: boolean;
  setShowPaymentDialog: (show: boolean) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  transactionId: string;
  setTransactionId: (id: string) => void;
  paymentProof: File | null;
  setPaymentProof: (file: File | null) => void;
  onPaymentSubmit: () => Promise<void>;
  isSubmittingPayment: boolean;
}

function EventContent({ 
  event, 
  onJoin, 
  onCancel, 
  isJoining, 
  isCanceling,
  showPaymentDialog,
  setShowPaymentDialog,
  paymentMethod,
  setPaymentMethod,
  transactionId,
  setTransactionId,
  setPaymentProof,
  onPaymentSubmit,
  isSubmittingPayment
}: EventContentProps) {
  const { data: session} = useSession();
  const { days, hours, minutes, seconds } = useCountdown(event?.date || '');
  const [registrationStatus, setRegistrationStatus] = useState('none');
  const isPast = new Date(event.date) < new Date();

  function getRegistrationStatus(event: Event) {
    if (!session?.user) return 'none';
    
    if (event.isPaid) {
      const latestPayment = event.payments
        ?.filter(p => p.userId === session.user.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
      if (latestPayment) {
        if (latestPayment.status === 'REJECTED') return 'none';
        return latestPayment.status.toLowerCase();
      }
    }
    
    const isAttending = event.attendees.some(a => a.id === session.user.id);
    if (isAttending) return 'registered';
    
    return 'none';
  }
  
  useEffect(() => {
    const registrationStatus = getRegistrationStatus(event);
    setRegistrationStatus(registrationStatus);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, session]);

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[500px]">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <h1 className="text-5xl font-bold text-center mb-8 max-w-3xl">{event.title}</h1>
          
          {!isPast && (
            <div className="bg-gray-800 backdrop-blur-sm p-8 rounded-xl shadow-lg">
              <div className="grid grid-cols-4 gap-6 text-center mb-3">
                <div>
                  <div className="bg-black/60 text-3xl font-bold rounded-lg p-3">
                    {days.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm mt-2 font-medium">Days</div>
                </div>
                <div>
                  <div className="bg-black/60 text-3xl font-bold rounded-lg p-3">
                    {hours.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm mt-2 font-medium">Hr</div>
                </div>
                <div>
                  <div className="bg-black/60 text-3xl font-bold rounded-lg p-3">
                    {minutes.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm mt-2 font-medium">Min</div>
                </div>
                <div>
                  <div className="bg-black/60 text-3xl font-bold rounded-lg p-3">
                    {seconds.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm mt-2 font-medium">Sec</div>
                </div>
              </div>
              <div className="text-center text-sm font-medium uppercase tracking-wider">
                Time Remaining
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8 border">
              <h2 className="text-2xl font-semibold mb-6">About This Event</h2>
              <p className="whitespace-pre-wrap leading-relaxed">{event.description}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>{format(new Date(event.date), 'EEEE, MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>{format(new Date(event.date), 'h:mm a')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <MapPin className="h-5 w-5 text-primary" />
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(event.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    {event.location}
                  </a>
                </div>
                {event.capacity && (
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <Users className="h-5 w-5 text-primary" />
                    <span>{event._count.attendees} / {event.capacity} spots filled</span>
                  </div>
                )}
                {event.isPaid && (
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <TakaSvgIcon className="h-5 w-5 text-primary" />
                    <span>Price: ৳{event.price}</span>
                  </div>
                )}
                {event.membershipRequired && (
                  <div className="mt-4 p-3 bg-primary/10 text-primary dark:bg-primary/20 rounded-lg text-sm">
                    {event.membershipRequired} membership required to join
                  </div>
                )}
              </div>

              {!isPast && (
                <div className="mt-6 space-y-3">
                  {(() => {
                    switch (registrationStatus) {
                      case 'pending':
                        return (
                          <Button disabled className="w-full" size="lg">
                            Registration Pending Approval
                          </Button>
                        );
                      case 'approved':
                      case 'registered':
                        return (
                          <>
                            <Button disabled className="w-full" size="lg">
                              Registration Confirmed
                            </Button>
                            <Button
                              onClick={onCancel}
                              disabled={isCanceling}
                              variant="outline"
                              className="w-full border-red-200 text-red-600 hover:bg-red-50"
                              size="lg"
                            >
                              {isCanceling ? 'Processing...' : 'Cancel Registration'}
                            </Button>
                          </>
                        );
                      default:
                        return (
                          <Button
                            onClick={onJoin}
                            disabled={isJoining}
                            className="w-full"
                            size="lg"
                          >
                            {isJoining ? 'Processing...' : 'Register Now'}
                          </Button>
                        );
                    }
                  })()}
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border">
              <h3 className="font-medium mb-4">Organized by</h3>
              <p className="text-sm">{event.organizer.name}</p>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Information</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
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
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction ID"
              />
            </div>

            <div className="space-y-2">
              <Label>Payment Proof</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
              />
            </div>

            <Button
              onClick={onPaymentSubmit}
              disabled={isSubmittingPayment}
              className="w-full"
            >
              {isSubmittingPayment ? 'Submitting...' : 'Submit Payment'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EventContent;
