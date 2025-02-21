'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Switch } from "@/components/ui/switch";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number | null;
  image: string;
  membershipRequired: string | null;
  isPaid: boolean;
  price: number | null;
  _count: {
    attendees: number;
  };
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch events',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      const isPaid = formData.get('isPaid') === 'on';
      formData.set('isPaid', isPaid.toString());
      
      if (image) {
        const imageData = new FormData();
        imageData.append('file', image);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: imageData,
        });
        const { url } = await uploadRes.json();
        formData.append('image', url);
      }

      const res = await fetch('/api/events', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to create event');

      toast({
        title: 'Success',
        description: 'Event created successfully',
      });
      fetchEvents();
      (e.target as HTMLFormElement).reset();
      setImage(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create event',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEvent = async (formData: FormData) => {
    if (!editingEvent) return;

    try {
      let imageUrl = editingEvent.image;

      const isPaid = formData.get('isPaid') === 'on';
      formData.set('isPaid', isPaid.toString());

      if (image) {
        const imageData = new FormData();
        imageData.append('file', image);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: imageData,
        });
        const { url } = await uploadRes.json();
        imageUrl = url;
      }

      formData.append('image', imageUrl);

      const res = await fetch(`/api/events/${editingEvent.id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to update event');

      toast({
        title: 'Success',
        description: 'Event updated successfully',
      });
      setEditingEvent(null);
      setImage(null);
      fetchEvents();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update event',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete event');

      toast({
        title: 'Success',
        description: 'Event deleted successfully',
      });
      fetchEvents();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete event',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Event</CardTitle>
          <CardDescription>Add a new event to the calendar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="datetime-local" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (Optional)</Label>
              <Input id="capacity" name="capacity" type="number" min={1} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="membershipRequired">Membership Required</Label>
              <Select name="membershipRequired">
                <SelectTrigger>
                  <SelectValue placeholder="Select membership type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">None</SelectItem>
                  <SelectItem value="GENERAL">General</SelectItem>
                  <SelectItem value="DONOR">Donor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPaid"
                  name="isPaid"
                  onCheckedChange={(checked) => {
                    const form = document.querySelector('form');
                    const priceInput = form?.querySelector('#price') as HTMLInputElement;
                    if (priceInput) {
                      priceInput.required = checked;
                    }
                  }}
                />
                <Label htmlFor="isPaid">Paid Event</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (Optional)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter price"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-image">New Image (Optional)</Label>
              <Input
                id="edit-image"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Event'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Events</CardTitle>
          <CardDescription>Manage existing events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="border rounded-lg overflow-hidden"
              >
                <div className="relative h-48">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 space-y-4">
                  <h3 className="font-semibold">{event.title}</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(event.date), 'PPP')}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                    {event.capacity && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {event._count.attendees}/{event.capacity} attendees
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingEvent(event)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateEvent(new FormData(e.currentTarget));
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                name="title"
                defaultValue={editingEvent?.title}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                defaultValue={editingEvent?.description}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                name="date"
                type="datetime-local"
                defaultValue={editingEvent?.date.slice(0, 16)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location</Label>
              <Input
                id="edit-location"
                name="location"
                defaultValue={editingEvent?.location}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-capacity">Capacity (Optional)</Label>
              <Input
                id="edit-capacity"
                name="capacity"
                type="number"
                min={1}
                defaultValue={editingEvent?.capacity || ''}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isPaid"
                  name="isPaid"
                  defaultChecked={editingEvent?.isPaid}
                  onCheckedChange={(checked) => {
                    const form = document.querySelector('form');
                    const priceInput = form?.querySelector('#edit-price') as HTMLInputElement;
                    if (priceInput) {
                      priceInput.required = checked;
                    }
                  }}
                />
                <Label htmlFor="edit-isPaid">Paid Event</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-price">Price</Label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter price"
                defaultValue={editingEvent?.price || ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-membershipRequired">Membership Required</Label>
              <Select 
                name="membershipRequired" 
                defaultValue={editingEvent?.membershipRequired || 'NONE'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select membership type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">None</SelectItem>
                  <SelectItem value="GENERAL">General</SelectItem>
                  <SelectItem value="DONOR">Donor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-image">New Image (Optional)</Label>
              <Input
                id="edit-image"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingEvent(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
