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
        // Type check
        if (!ALLOWED_TYPES.includes(file.type)) {
          resolve("Alleen JPG, PNG of WebP bestanden zijn toegestaan.");
          return;
        }

        // Size check
        if (file.size > MAX_SIZE) {
          resolve("Bestand is te groot. Maximum 10MB toegestaan.");
          return;
        }

        // Resolution check
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
      // Reset input so same file can be re-selected
      e.target.value = "";
    },
    [handleFile]
  );

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`
          relative cursor-pointer rounded-xl border-2 border-dashed p-8 md:p-12
          text-center transition-all duration-200
          ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-royal-gold hover:bg-royal-gold/5"}
          ${isDragging ? "border-royal-gold bg-royal-gold/10 scale-[1.02]" : "border-royal-brown/30"}
        `}
      >
        {/* Upload icon */}
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-royal-brown/40"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
        </div>

        {isDragging ? (
          <p className="text-lg font-body text-royal-gold font-semibold">
            Laat los om te uploaden
          </p>
        ) : (
          <>
            <p className="text-lg font-body text-royal-brown font-medium mb-2">
              Sleep uw foto hierheen
            </p>
            <p className="text-sm font-body text-royal-brown/60">
              of klik om een bestand te selecteren
            </p>
          </>
        )}

        <p className="mt-4 text-xs font-body text-royal-brown/40">
          JPG, PNG of WebP — maximaal 10MB
        </p>

        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* Remaining count — hidden when using credits (shown separately in UploadSection) */}

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm font-body text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
