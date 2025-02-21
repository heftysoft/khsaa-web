'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2),
  type: z.enum(['GENERAL', 'DONOR', 'LIFETIME_DONOR']),
  period: z.enum(['WEEKLY', 'MONTHLY', 'YEARLY', 'ONE_TIME']),
  amount: z.coerce.number().min(0),
  description: z.string().optional(),
  benefits: z.array(z.string()).default([]), // Changed benefits schema
});

export default function TierForm({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const isEditing = id !== 'new';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      amount: 0,
      benefits: [], // Changed to empty array
      type: 'GENERAL' as const,
      period: 'MONTHLY' as const,
    },
  });

  useEffect(() => {
    if (isEditing) {
      const fetchTier = async () => {
        try {
          const response = await fetch(`/api/membership-tiers/${id}`);
          const data = await response.json();
          form.reset({
            ...data,
            benefits: data.benefits, // No need to join/split
            amount: data.amount,
          });
        } catch (error) {
          console.error('Error fetching tier:', error);
          toast.error('Failed to load tier data');
        }
      };
      fetchTier();
    }
  }, [isEditing, id, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch(
        `/api/membership-tiers${isEditing ? `/${id}` : ''}`,
        {
          method: isEditing ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) throw new Error('Failed to save tier');

      toast.success(`Tier ${isEditing ? 'updated' : 'created'} successfully`);
      router.push('/admin/membership-tiers');
      router.refresh();
    } catch (error) {
      console.error('Error saving tier:', error);
      toast.error('Failed to save tier');
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">
        {isEditing ? 'Edit Membership Tier' : 'Create Membership Tier'}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Basic Membership" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="GENERAL">General</SelectItem>
                      <SelectItem value="DONOR">Donor</SelectItem>
                      <SelectItem value="LIFETIME_DONOR">Lifetime Donor</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billing Period</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="WEEKLY">Weekly</SelectItem>
                      <SelectItem value="MONTHLY">Monthly</SelectItem>
                      <SelectItem value="YEARLY">Yearly</SelectItem>
                      <SelectItem value="ONE_TIME">One Time</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount ($)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the membership tier..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="benefits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Benefits (one per line)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Access to alumni directory&#10;Newsletter subscription&#10;Event participation"
                    value={field.value.join('\n')}
                    onChange={e => field.onChange(e.target.value.split('\n').filter(Boolean))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button type="submit">
              {isEditing ? 'Update Tier' : 'Create Tier'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}