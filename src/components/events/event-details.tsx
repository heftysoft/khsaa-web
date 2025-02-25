"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import EventContent from "./event-content";
import { toast } from "sonner";
import { Event } from "@/types/event";

function EventDetails({ eventId }: { eventId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [transactionId, setTransactionId] = useState("");
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  useEffect(() => {
    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, session]);

  const fetchEvent = async () => {
    try {
      const res = await fetch(`/api/events/${eventId}`);
      const data = await res.json();
      setEvent(data);
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };

  const handleJoin = async () => {
    if (!session) {
      router.push(`/login?from=/events/${eventId}`);
      return;
    }

    if (event?.isPaid) {
      setShowPaymentDialog(true);
      return;
    }

    try {
      setIsJoining(true);
      const res = await fetch(`/api/events/${eventId}/join`, {
        method: "POST",
      });

      if (!res.ok) {
        if (res.status === 403) {
          router.push("/dashboard/membership");
          return;
        }
        throw new Error(await res.text());
      }
      await fetchEvent();
      toast.success("Successfully joined event!", {
        description: "You will receive an email confirmation shortly.",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Error', {
        description: "Failed to join event",
      });
    } finally {
      setIsJoining(false);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!paymentMethod || !transactionId || !paymentProof) {
      toast.error('Error', {
        description: "Please fill in all payment details",
      });
      return;
    }

    try {
      setIsSubmittingPayment(true);

      const formData = new FormData();
      formData.append("file", paymentProof);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const { url } = await uploadRes.json();

      const res = await fetch(`/api/events/${eventId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethod,
          transactionId,
          paymentProof: url,
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      toast('Payment Submitted', {
        description: "Your registration is pending admin approval.",
      });

      setShowPaymentDialog(false);
      await fetchEvent();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Error', {
        description: "Failed to submit payment",
      });
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const handleCancel = async () => {
    try {
      setIsCanceling(true);
      const res = await fetch(`/api/events/${eventId}/join`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to cancel registration");
      }

      toast.success("Registration Cancelled", {
        description: "You have been removed from the event.",
      });

      await fetchEvent();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Error', {
        description: "Failed to cancel registration",
      });
    } finally {
      setIsCanceling(false);
    }
  };

  if (!event) return null;

  return (
    <EventContent
      event={event}
      onJoin={handleJoin}
      onCancel={handleCancel}
      isJoining={isJoining}
      isCanceling={isCanceling}
      showPaymentDialog={showPaymentDialog}
      setShowPaymentDialog={setShowPaymentDialog}
      paymentMethod={paymentMethod}
      setPaymentMethod={setPaymentMethod}
      transactionId={transactionId}
      setTransactionId={setTransactionId}
      paymentProof={paymentProof}
      setPaymentProof={setPaymentProof}
      onPaymentSubmit={handlePaymentSubmit}
      isSubmittingPayment={isSubmittingPayment}
    />
  );
}

export default EventDetails;
