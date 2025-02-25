"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const paymentInfoSchema = z.object({
  bankInfo: z.string().min(1, "Bank information is required"),
  bkashInfo: z.string().min(1, "bKash information is required"),
  nagadInfo: z.string().min(1, "Nagad information is required"),
  rocketInfo: z.string().min(1, "Rocket information is required"),
});

type PaymentInfo = z.infer<typeof paymentInfoSchema>;

export default function PaymentInfoPage() {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    bankInfo: "",
    bkashInfo: "",
    nagadInfo: "",
    rocketInfo: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPaymentInfo();
  }, []);

  const fetchPaymentInfo = async () => {
    try {
      const res = await fetch("/api/admin/payment-info");
      const data = await res.json();
      if (data) {
        setPaymentInfo(data);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to fetch payment information");
    }
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Validate the data
      const validatedData = paymentInfoSchema.parse(paymentInfo);

      const res = await fetch("/api/admin/payment-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });

      if (!res.ok) throw new Error("Failed to update payment information");

      toast.success("Payment information updated successfully");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Failed to update payment information");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Bank Information</Label>
            <Textarea
              placeholder="Enter bank account details, branch information, etc."
              value={paymentInfo.bankInfo}
              onChange={(e) =>
                setPaymentInfo((prev) => ({
                  ...prev,
                  bankInfo: e.target.value,
                }))
              }
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label>bKash Information</Label>
            <Textarea
              placeholder="Enter bKash number and payment instructions"
              value={paymentInfo.bkashInfo}
              onChange={(e) =>
                setPaymentInfo((prev) => ({
                  ...prev,
                  bkashInfo: e.target.value,
                }))
              }
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label>Nagad Information</Label>
            <Textarea
              placeholder="Enter Nagad number and payment instructions"
              value={paymentInfo.nagadInfo}
              onChange={(e) =>
                setPaymentInfo((prev) => ({
                  ...prev,
                  nagadInfo: e.target.value,
                }))
              }
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label>Rocket Information</Label>
            <Textarea
              placeholder="Enter Rocket number and payment instructions"
              value={paymentInfo.rocketInfo}
              onChange={(e) =>
                setPaymentInfo((prev) => ({
                  ...prev,
                  rocketInfo: e.target.value,
                }))
              }
              rows={5}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
