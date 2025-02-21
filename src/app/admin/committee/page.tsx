'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CommitteeMember {
  id: string;
  name: string;
  designation: string;
  image: string;
  order: number;
}

export default function CommitteePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [editingMember, setEditingMember] = useState<CommitteeMember | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/admin/committee');
      const data = await res.json();
      setMembers(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch committee members',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Upload image first
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

      const res = await fetch('/api/admin/committee', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to add committee member');

      toast({
        title: 'Success',
        description: 'Committee member added successfully',
      });
      router.refresh();
      (e.target as HTMLFormElement).reset();
      setImage(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add committee member',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMember = async (formData: FormData) => {
    if (!editingMember) return;

    try {
      let imageUrl = editingMember.image;

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

      const res = await fetch(`/api/admin/committee/${editingMember.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          designation: formData.get('designation'),
          order: parseInt(formData.get('order') as string),
          image: imageUrl,
        }),
      });

      if (!res.ok) throw new Error('Failed to update member');

      toast({
        title: 'Success',
        description: 'Member updated successfully',
      });
      setEditingMember(null);
      setImage(null);
      fetchMembers();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update member',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;

    try {
      const res = await fetch(`/api/admin/committee/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete member');

      toast({
        title: 'Success',
        description: 'Member deleted successfully'});
      fetchMembers();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete member',
        variant: 'destructive',
    });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Add Committee Member</CardTitle>
          <CardDescription>
            Add a new member to the committee section
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input id="designation" name="designation" required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="order">Display Order</Label>
              <Input 
                id="order" 
                name="order" 
                type="number" 
                required 
                min={1}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                required
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Member'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Committee Members List */}
      <Card>
        <CardHeader>
          <CardTitle>Committee Members</CardTitle>
          <CardDescription>Manage existing committee members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="border rounded-lg p-4 space-y-4"
              >
                <div className="relative h-48 w-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.designation}</p>
                  <p className="text-sm text-muted-foreground">Order: {member.order}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingMember(member)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteMember(member.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Edit Member Dialog */}
      <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Committee Member</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateMember(new FormData(e.currentTarget));
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                name="name"
                defaultValue={editingMember?.name}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-designation">Designation</Label>
              <Input
                id="edit-designation"
                name="designation"
                defaultValue={editingMember?.designation}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-order">Display Order</Label>
              <Input
                id="edit-order"
                name="order"
                type="number"
                defaultValue={editingMember?.order}
                required
                min={1}
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

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingMember(null)}
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