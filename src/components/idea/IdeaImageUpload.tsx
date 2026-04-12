"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Upload, X, ImageIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type TProps = {
  files: File[];
  onChange: (files: File[]) => void;
  existingUrls?: string[];
  onRemoveExisting?: (url: string) => void;
  maxFiles?: number;
  error?: string;
};

export default function IdeaImageUpload({
  files,
  onChange,
  existingUrls = [],
  onRemoveExisting,
  maxFiles = 5,
  error,
}: TProps) {
  const total = files.length + existingUrls.length;

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (total + accepted.length > maxFiles) {
        toast.error(`Maximum ${maxFiles} images allowed`);
        const allowed = accepted.slice(0, maxFiles - total);
        if (allowed.length > 0) onChange([...files, ...allowed]);
        return;
      }
      onChange([...files, ...accepted]);
    },
    [files, total, maxFiles, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxSize: 5 * 1024 * 1024,
    disabled: total >= maxFiles,
  });

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {/* Dropzone */}
      {total < maxFiles && (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200",
            isDragActive
              ? "border-purple-500 bg-purple-500/10"
              : "border-white/15 hover:border-purple-500/50 hover:bg-white/5",
            error && "border-red-500/50"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl glass-purple flex items-center justify-center">
              <Upload className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-white/70 text-sm font-medium mb-1">
                {isDragActive ? "Drop images here..." : "Drag & drop or click to upload"}
              </p>
              <p className="text-white/30 text-xs">
                JPEG, PNG, WEBP · Max 5MB each · {total}/{maxFiles}
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-xs">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </div>
      )}

      {/* Preview Grid */}
      {(existingUrls.length > 0 || files.length > 0) && (
        <div className="grid grid-cols-3 gap-2">
          {existingUrls.map((url) => (
            <div key={url} className="relative group aspect-video rounded-xl overflow-hidden">
              <Image src={url} alt="existing" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {onRemoveExisting && (
                  <button
                    type="button"
                    onClick={() => onRemoveExisting(url)}
                    className="w-8 h-8 bg-red-500/80 rounded-full flex items-center justify-center hover:bg-red-500"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
              <div className="absolute bottom-1 left-1">
                <span className="badge-green rounded px-1.5 py-0.5 text-[10px]">Saved</span>
              </div>
            </div>
          ))}
          {files.map((file, index) => (
            <div key={index} className="relative group aspect-video rounded-xl overflow-hidden">
              <Image
                src={URL.createObjectURL(file)}
                alt={file.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="w-8 h-8 bg-red-500/80 rounded-full flex items-center justify-center hover:bg-red-500"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="absolute bottom-1 left-1">
                <span className="badge-amber rounded px-1.5 py-0.5 text-[10px]">New</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}