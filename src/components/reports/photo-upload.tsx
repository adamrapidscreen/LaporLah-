'use client';

import { useState, useRef } from 'react';

import Image from 'next/image';

import { Upload, X, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';
import { compressImage } from '@/lib/utils/image-compression';

interface PhotoUploadProps {
  onUpload: (url: string) => void;
  onRemove?: () => void;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png'];

export function PhotoUpload({ onUpload, onRemove }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);

    // Validate type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Only JPEG and PNG images are allowed.');
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      setError('Image must be less than 5MB.');
      return;
    }

    try {
      setUploading(true);

      // Compress
      const compressed = await compressImage(file);

      // Preview
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(compressed);

      // Upload to Supabase Storage
      const supabase = createClient();
      const fileName = `${Date.now()}-${crypto.randomUUID()}.jpg`;
      const { data, error: uploadError } = await supabase.storage
        .from('report-photos')
        .upload(fileName, compressed, { contentType: 'image/jpeg' });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('report-photos')
        .getPublicUrl(data.path);

      onUpload(publicUrl);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Photo</label>

      {!preview ? (
        <div
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-8 cursor-pointer transition-colors hover:border-primary/50 hover:bg-accent/50',
            uploading && 'pointer-events-none opacity-50'
          )}
        >
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          ) : (
            <Upload className="h-8 w-8 text-muted-foreground" />
          )}
          <p className="text-sm text-muted-foreground">
            {uploading ? 'Compressing & uploading...' : 'Tap to add a photo'}
          </p>
          <p className="text-xs text-muted-foreground">JPEG or PNG, max 5MB</p>
        </div>
      ) : (
        <div className="relative rounded-lg overflow-hidden aspect-video">
          <Image src={preview} alt="Preview" fill className="object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8"
            onClick={() => { setPreview(null); onRemove?.(); }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
