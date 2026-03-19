"use client";

import { useState, useRef, useCallback } from "react";

interface DropZoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
  remaining?: number | null;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const MIN_RESOLUTION = 512;

export default function DropZone({ onFileSelected, disabled, remaining }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): Promise<string | null> => {
      return new Promise((resolve) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
          resolve("Alleen JPG, PNG of WebP bestanden zijn toegestaan.");
          return;
        }
        if (file.size > MAX_SIZE) {
          resolve("Bestand is te groot. Maximum 10MB toegestaan.");
          return;
        }
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(img.src);
          if (img.width < MIN_RESOLUTION || img.height < MIN_RESOLUTION) {
            resolve(
              `Foto heeft een te lage resolutie. Minimaal ${MIN_RESOLUTION}x${MIN_RESOLUTION} pixels.`
            );
          } else {
            resolve(null);
          }
        };
        img.onerror = () => {
          URL.revokeObjectURL(img.src);
          resolve("Kan de afbeelding niet lezen. Probeer een ander bestand.");
        };
        img.src = URL.createObjectURL(file);
      });
    },
    []
  );

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      const validationError = await validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
      onFileSelected(file);
    },
    [onFileSelected, validateFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [disabled, handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  // Suppress unused variable warning
  void remaining;

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`
          relative cursor-pointer rounded-xl border border-dashed p-8 md:p-10
          text-center transition-all duration-200
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-royal-gold/60 hover:bg-[#FAF8F3]/[0.03]"}
          ${isDragging ? "border-royal-gold bg-royal-gold/10 scale-[1.02]" : "border-[#FAF8F3]/20"}
        `}
      >
        {/* Upload icon */}
        <div className="mb-3">
          <svg
            className="mx-auto h-8 w-8 text-[#FAF8F3]/30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        </div>

        {isDragging ? (
          <p className="text-base font-body text-royal-gold font-semibold">
            Laat los om te uploaden
          </p>
        ) : (
          <>
            <p className="text-base font-body text-[#FAF8F3]/80 font-medium mb-1">
              Upload foto
            </p>
            <p className="text-sm font-body text-[#FAF8F3]/30">
              Oren en snuit volledig zichtbaar
            </p>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-900/30 border border-red-500/30">
          <p className="text-sm font-body text-red-300">{error}</p>
        </div>
      )}
    </div>
  );
}
