'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { MotionDiv } from '@/components/motion';
import { Button } from '@/components/ui/button';
import { Lightbox } from '@/components/lightbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Album {
  id: string;
  title: string;
  description: string;
}

interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: string;
  albumId: string;
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<string>('all');
  const [filter, setFilter] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [lightbox, setLightbox] = useState<{ open: boolean; index: number }>({
    open: false,
    index: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const [galleryRes, albumsRes] = await Promise.all([
        fetch('/api/gallery'),
        fetch('/api/albums')
      ]);
      const [galleryData, albumsData] = await Promise.all([
        galleryRes.json(),
        albumsRes.json()
      ]);
      
      setItems(galleryData);
      setAlbums(albumsData);
      
      const uniqueCategories = [...new Set(galleryData.map((item: GalleryItem) => item.category))] as string[];
      setCategories(uniqueCategories);
    };
    fetchData();
  }, []);

  const filteredItems = items.filter(item => {
    if (selectedAlbum !== 'all' && item.albumId !== selectedAlbum) return false;
    if (filter !== 'all' && item.category !== filter) return false;
    return true;
  });

  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold text-center mb-8">Our Gallery</h1>
      
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
        <Select value={selectedAlbum} onValueChange={setSelectedAlbum}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Album" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Albums</SelectItem>
            {albums.map((album) => (
              <SelectItem key={album.id} value={album.id}>
                {album.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2 flex-wrap">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? 'default' : 'outline'}
              onClick={() => setFilter(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {filteredItems.map((item, index) => (
          <MotionDiv
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="break-inside-avoid cursor-pointer"
            onClick={() => setLightbox({ open: true, index })}
          >
            <div className="relative rounded-lg overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                width={600}
                height={400}
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white text-lg font-medium">{item.title}</p>
              </div>
            </div>
          </MotionDiv>
        ))}
      </div>

      {lightbox.open && (
        <Lightbox
          images={filteredItems}
          currentImage={lightbox.index}
          onClose={() => setLightbox({ open: false, index: 0 })}
        />
      )}
    </div>
  );
}