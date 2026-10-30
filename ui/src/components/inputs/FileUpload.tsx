"use client";

import { cn } from "@mui-verse/ui/utils/cn";
import { IconButton } from "@mui/material";
import { CloudUploadIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

export interface FileUploadProps {
  url?: string;
  Icon?: React.ElementType;
  label?: React.ReactNode;
  accept?: string[];
  variant?: "circular" | "rounded";
  className?: string;
}

function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <IconButton
      className="hover:bg-error-200 absolute top-2 right-2 p-1"
      size="small"
      onClick={onClick}
    >
      <XIcon className="text-error-500 h-3 w-3" />
    </IconButton>
  );
}

// TODO(Leo): Add controller to check file size and accept type.
export function FileUpload({
  url,
  Icon = CloudUploadIcon,
  label,
  accept = ["image/png", "image/jpeg", "image/jpg", "image/webp"],
  variant = "rounded",
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(url ?? null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
  };

  const handleRemove = () => {
    setPreview(url ?? null);
  };

  return (
    <div className={cn("bg-gray-50 hover:bg-gray-100", className)}>
      {preview ? (
        <div className="relative h-full w-full">
          <Image
            fill
            src={preview}
            alt="Preview"
            className={cn("h-full w-full object-cover", {
              "rounded-xl": variant === "rounded",
              "rounded-full": variant === "circular",
            })}
          />
          <DeleteButton onClick={handleRemove} />{" "}
        </div>
      ) : (
        <>
          <div
            className={cn(
              "flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2",
              "shadow-(--mui-shadow-border)",
              {
                "rounded-xl": variant === "rounded",
                "rounded-full": variant === "circular",
              },
            )}
            onClick={() => inputRef.current?.click()}
          >
            <Icon className="h-5 w-5" />
            <div className="text-text-secondary text-xs">{label}</div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept={accept.join(",")}
            className="hidden"
            onChange={handleFileSelect}
          />
        </>
      )}
    </div>
  );
}
