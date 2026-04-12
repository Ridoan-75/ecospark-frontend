"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Upload, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type TImageUploadProps = {
  value: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  existingImages?: string[];
  onRemoveExisting?: (url: string) => void;
};

export default function ImageUpload({
  value,
  onChange,
  maxFiles = 5,
  existingImages = [],
  onRemoveExisting,
}: TImageUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const total = value.length + existingImages.length + acceptedFiles.length;
      if (total > maxFiles) {
        toast.error(`Maximum ${maxFiles} images allowed`);
        return;
      }
      onChange([...value, ...acceptedFiles]);
    },
    [value, existingImages, maxFiles, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles,
    maxSize: 5 * 1024 * 1024,
  });

  const removeNew = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const totalImages = existingImages.length + value.length;

  return (
    <div className="space-y-3">
      {/* Dropzone */}
      {totalImages < maxFiles && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200",
            isDragActive
              ? "border-purple-500 bg-purple-500/10"
              : "border-white/15 hover:border-purple-500/50 hover:bg-white/5"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="w-8 h-8 text-purple-400 mx-auto mb-3" />
          <p className="text-white/70 text-sm font-medium mb-1">
            {isDragActive ? "Drop images here..." : "Drag & drop images here"}
          </p>
          <p className="text-white/30 text-xs">
            JPEG, PNG, WEBP · Max 5MB each · {totalImages}/{maxFiles} uploaded
          </p>
        </div>
      )}

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {existingImages.map((url) => (
            <div key={url} className="relative group rounded-lg overflow-hidden aspect-video">
              <Image src={url} alt="existing" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {onRemoveExisting && (
                  <button
                    type="button"
                    onClick={() => onRemoveExisting(url)}
                    className="w-7 h-7 bg-red-500/80 rounded-full flex items-center justify-center"
                  >
                    <X className="w-3.5 h-3.5 text-white" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Images Preview */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {value.map((file, index) => (
            <div key={index} className="relative group rounded-lg overflow-hidden aspect-video">
              <Image
                src={URL.createObjectURL(file)}
                alt={file.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeNew(index)}
                  className="w-7 h-7 bg-red-500/80 rounded-full flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}