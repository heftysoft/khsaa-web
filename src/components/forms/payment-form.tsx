'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileUpload } from '@/components/file-upload';

interface PaymentFormData {
  paymentMethod: string;
  transactionId: string;
  proof?: string;
}

interface PaymentFormProps {
  amount: number;
  onSubmit: (data: PaymentFormData) => Promise<void>;
  isLoading?: boolean;
}

export function PaymentForm({ amount, onSubmit, isLoading }: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    paymentMethod: '',
    transactionId: '',
  });

  return (
    <div className="space-y-4">
      <div className="text-lg font-semibold">
        Payment Amount: ${amount.toFixed(2)}
      </div>
      
      <div className="space-y-2">
        <Label>Payment Method</Label>
        <Select
          value={formData.paymentMethod}
          onValueChange={(value) => 
            setFormData((prev) => ({ ...prev, paymentMethod: value }))
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
            setFormData((prev) => ({ ...prev, transactionId: e.target.value }))
          }
          placeholder="Enter transaction ID"
        />
      </div>

      <div className="space-y-2">
        <Label>Payment Proof</Label>
        <FileUpload
          onChange={(url) => 
            setFormData((prev) => ({ ...prev, proof: url }))
          }
        />
      </div>

      <Button
        className="w-full"
        onClick={() => onSubmit(formData)}
        disabled={!formData.paymentMethod || !formData.transactionId || isLoading}
      >
        {isLoading ? 'Processing...' : 'Submit Payment'}
      </Button>
    </div>
  );
}