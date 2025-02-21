'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface LightboxProps {
  images: { id: string; title: string; image: string }[];
  currentImage: number;
  onClose: () => void;
}

export function Lightbox({ images, currentImage, onClose }: LightboxProps) {
  const [index, setIndex] = useState(currentImage);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
      if (e.key === 'ArrowRight') setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [images.length, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300"
        >
          <X size={24} />
        </button>

        <button
          onClick={() => setIndex(index === 0 ? images.length - 1 : index - 1)}
          className="absolute left-4 text-white hover:text-gray-300"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="relative w-full max-w-5xl aspect-video">
          <Image
            src={images[index].image}
            alt={images[index].title}
            fill
            className="object-contain"
          />
        </div>

        <button
          onClick={() => setIndex(index === images.length - 1 ? 0 : index + 1)}
          className="absolute right-4 text-white hover:text-gray-300"
        >
          <ChevronRight size={24} />
        </button>

        <div className="absolute bottom-4 left-0 right-0 text-center text-white">
          <p className="text-lg font-medium">{images[index].title}</p>
          <p className="text-sm text-gray-300">
            {index + 1} of {images.length}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}