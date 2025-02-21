'use client';

import { useState, useEffect } from 'react';
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
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Album {
  id: string;
  title: string;
  description: string | null;
}

interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: string;
  albumId: string | null;
  order: number;
  createdAt: Date;
}

export default function AdminGalleryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<GalleryItem[]>([]);
  const [editingPhoto, setEditingPhoto] = useState<GalleryItem | null>(null);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [albumsRes, photosRes] = await Promise.all([
        fetch('/api/albums'),
        fetch('/api/gallery')
      ]);
      const [albumsData, photosData] = await Promise.all([
        albumsRes.json(),
        photosRes.json()
      ]);
      setAlbums(albumsData);
      setPhotos(photosData);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch data',
        variant: 'destructive',
      });
    }
  };

  const handleAlbumSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        title: formData.get('title'),
        description: formData.get('description'),
      };

      const res = await fetch('/api/albums', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to create album');

      toast({
        title: 'Success',
        description: 'Album created successfully'});
      fetchData();
      (e.target as HTMLFormElement).reset();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create album',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const albumId = formData.get('albumId');
      if (albumId === 'none') {
        formData.set('albumId', '');
      }
      
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

      const res = await fetch('/api/gallery', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to add photo');

      toast({
        title: 'Success',
        description:'Photo added successfully'
      });
      fetchData();
      (e.target as HTMLFormElement).reset();
      setImage(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add photo',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePhoto = async (formData: FormData) => {
    if (!editingPhoto) return;

    try {
      const albumId = formData.get('albumId');
      if (albumId === 'none') {
        formData.set('albumId', '');
      }

      const res = await fetch(`/api/gallery/${editingPhoto.id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to update photo');

      toast({
        title: 'Success',
        description: 'Photo updated successfully',
      });
      setEditingPhoto(null);
      fetchData();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update photo',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateAlbum = async (formData: FormData) => {
    if (!editingAlbum) return;

    try {
      const data = {
        title: formData.get('title'),
        description: formData.get('description'),
      };

      const res = await fetch(`/api/albums/${editingAlbum.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to update album');

      toast({
        title: 'Success',
        description: 'Album updated successfully'
      });
      setEditingAlbum(null);
      fetchData();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update album',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePhoto = async (id: string) => {
    try {
      const res = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete photo');

      toast({
        title: 'Success',
        description: 'Photo deleted successfully'
      });
      fetchData();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete photo',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAlbum = async (id: string) => {
    try {
      const res = await fetch(`/api/albums/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete album');

      toast({
        title: 'Success',
        description: 'Album deleted successfully'
      });
      fetchData();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete album',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Tabs defaultValue="photos" className="space-y-6">
        <TabsList>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="albums">Albums</TabsTrigger>
        </TabsList>

        <TabsContent value="photos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Photo</CardTitle>
              <CardDescription>Add a new photo to the gallery</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePhotoSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" name="category" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="albumId">Album</Label>
                  <Select name="albumId">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Album" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {albums.map((album) => (
                        <SelectItem key={album.id} value={album.id}>
                          {album.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  {isLoading ? 'Adding...' : 'Add Photo'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gallery Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable 
                columns={columns({ onEdit: setEditingPhoto, onDelete: handleDeletePhoto })} 
                data={photos}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="albums">
          <Card>
            <CardHeader>
              <CardTitle>Create Album</CardTitle>
              <CardDescription>Create a new album to organize photos</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAlbumSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="albumTitle">Album Title</Label>
                  <Input id="albumTitle" name="title" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" />
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create Album'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Albums</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {albums.map((album) => (
                  <div
                    key={album.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{album.title}</h4>
                      {album.description && (
                        <p className="text-sm text-muted-foreground">
                          {album.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingAlbum(album)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteAlbum(album.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Photo Dialog */}
      <Dialog open={!!editingPhoto} onOpenChange={() => setEditingPhoto(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Photo</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleUpdatePhoto(new FormData(e.currentTarget));
          }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                name="title"
                defaultValue={editingPhoto?.title}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                name="category"
                defaultValue={editingPhoto?.category}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-albumId">Album</Label>
              <Select name="albumId" defaultValue={editingPhoto?.albumId || 'none'}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Album" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {albums.map((album) => (
                    <SelectItem key={album.id} value={album.id}>
                      {album.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-order">Display Order</Label>
              <Input
                id="edit-order"
                name="order"
                type="number"
                defaultValue={editingPhoto?.order}
                required
                min={1}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditingPhoto(null)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Album Dialog */}
      <Dialog open={!!editingAlbum} onOpenChange={() => setEditingAlbum(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Album</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            handleUpdateAlbum(new FormData(e.currentTarget));
          }} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-album-title">Album Title</Label>
              <Input
                id="edit-album-title"
                name="title"
                defaultValue={editingAlbum?.title}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-album-description">Description</Label>
              <Textarea
                id="edit-album-description"
                name="description"
                defaultValue={editingAlbum?.description || ''}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setEditingAlbum(null)}>
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