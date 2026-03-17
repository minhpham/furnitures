"use client";

import { useState, useCallback, useRef } from "react";

type ImageItem =
  | { kind: "existing"; url: string; id: string }
  | { kind: "new"; file: File; previewUrl: string; id: string };

interface ImageUploaderProps {
  multiple?: boolean;
  existingUrls?: string[];
  onChange: (newFiles: File[], removedUrls: string[]) => void;
  maxFiles?: number;
  label?: string;
  hint?: string;
}

export function ImageUploader({
  multiple = true,
  existingUrls = [],
  onChange,
  maxFiles = 10,
  label = "Upload Images",
  hint = "PNG, JPG, WebP — max 10 MB each",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [items, setItems] = useState<ImageItem[]>(() =>
    existingUrls.map((url, i) => ({
      kind: "existing" as const,
      url,
      id: `existing-${i}`,
    })),
  );

  const notify = useCallback(
    (next: ImageItem[]) => {
      const newFiles = next
        .filter((i): i is Extract<ImageItem, { kind: "new" }> => i.kind === "new")
        .map((i) => i.file);
      const removedUrls = existingUrls.filter(
        (url) => !next.some((i) => i.kind === "existing" && i.url === url),
      );
      onChange(newFiles, removedUrls);
    },
    [existingUrls, onChange],
  );

  const addFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const available = multiple ? maxFiles - items.length : 1;
      const incoming = Array.from(fileList).slice(0, available);
      const newItems: ImageItem[] = incoming.map((file) => ({
        kind: "new" as const,
        file,
        previewUrl: URL.createObjectURL(file),
        id: `new-${Date.now()}-${Math.random()}`,
      }));
      const next = multiple ? [...items, ...newItems] : newItems;
      setItems(next);
      notify(next);
    },
    [items, multiple, maxFiles, notify],
  );

  const removeItem = useCallback(
    (id: string) => {
      setItems((prev) => {
        const item = prev.find((i) => i.id === id);
        if (item?.kind === "new") URL.revokeObjectURL(item.previewUrl);
        const next = prev.filter((i) => i.id !== id);
        notify(next);
        return next;
      });
    },
    [notify],
  );

  const atMax = !multiple ? items.length >= 1 : items.length >= maxFiles;

  return (
    <div className="flex flex-col gap-3">
      {/* Drop zone */}
      {!atMax && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragEnter={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            addFiles(e.dataTransfer.files);
          }}
          className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed py-8 cursor-pointer select-none transition-colors ${
            isDragOver
              ? "border-black bg-[#F0F0F0]"
              : "border-[#DDDDDD] hover:border-[#AAAAAA] bg-white"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#AAAAAA"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
          </svg>
          <div className="text-center">
            <p className="text-sm text-[#333333]" style={{ fontFamily: "Inter" }}>
              <span className="font-medium text-black">Click to upload</span> or drag & drop
            </p>
            <p className="text-xs text-[#AAAAAA] mt-0.5" style={{ fontFamily: "Inter" }}>
              {hint}
            </p>
          </div>
        </div>
      )}

      {/* Preview grid */}
      {items.length > 0 && (
        <div className={`grid gap-3 ${multiple ? "grid-cols-4" : "grid-cols-1"}`}>
          {items.map((item) => (
            <div
              key={item.id}
              className={`relative group bg-[#F5F5F5] overflow-hidden ${
                multiple ? "aspect-square" : "h-40"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.kind === "existing" ? item.url : item.previewUrl}
                alt=""
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/70 hover:bg-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" x2="6" y1="6" y2="18" />
                  <line x1="6" x2="18" y1="6" y2="18" />
                </svg>
              </button>
              {item.kind === "new" && (
                <span className="absolute bottom-1.5 left-1.5 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-sm" style={{ fontFamily: "Inter" }}>
                  New
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {atMax && multiple && (
        <p className="text-xs text-[#AAAAAA]" style={{ fontFamily: "Inter" }}>
          Maximum {maxFiles} images reached.
        </p>
      )}
    </div>
  );
}
