'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  images: File[];
  previews: string[];
  onImagesChange: (images: File[], previews: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ 
  images, 
  previews, 
  onImagesChange, 
  maxImages = 10 
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Create previews
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    
    onImagesChange(
      [...images, ...validFiles],
      [...previews, ...newPreviews]
    );
    
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    // Revoke the URL to free memory
    URL.revokeObjectURL(previews[index]);
    
    onImagesChange(newImages, newPreviews);
    setError('');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {previews.map((preview, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-neutral-100">
            <img 
              src={preview} 
              alt={`Upload ${index + 1}`} 
              className="w-full h-full object-cover" 
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center text-neutral-500 hover:border-brand-500 hover:text-brand-600 transition-colors"
          >
            <Upload className="w-8 h-8 mb-2" />
            <span className="text-sm">Add Photo</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <p className="text-xs text-neutral-500">
        Photos should be in JPG, PNG, or WebP format. Maximum file size: 5MB each.
      </p>
    </div>
  );
}
