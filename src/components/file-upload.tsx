'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  onChange: (url: string) => void;
}

export function FileUpload({ onChange }: FileUploadProps) {
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onChange(data.url);
      toast.success('Success', {
        description: 'File uploaded successfully',
      });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to upload file',
      });
    } finally {
      setIsLoading(false);
    }
  }, [onChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1,
    maxSize: 8 * 1024 * 1024, // 8MB
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-6 cursor-pointer
        transition-colors duration-200 ease-in-out
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
        hover:border-primary hover:bg-primary/5
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <Upload className={`h-10 w-10 ${isDragActive ? 'text-primary' : 'text-muted-foreground/50'}`} />
        <div className="text-lg font-medium">
          {isLoading ? (
            'Uploading...'
          ) : isDragActive ? (
            'Drop your file here'
          ) : (
            'Drag and drop your files here or click to browse'
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          You can upload 1 file (up to 8 MB)
        </p>
      </div>
    </div>
  );
}