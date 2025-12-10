"use client";

import { Button } from "@/components/ui/button";
import getFileIcon from "@/files/tools/getFileIcon";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFiles } from ".";

export default function ChatPreviews() {
  const { files, removeFile } = useFiles();
  if (files.length === 0) return null;

  return (
    <div className="flex flex-row gap-3 items-start">
      {files.map((file, index) => (
        <div
          key={index}
          className="relative flex items-center justify-center lg:h-36 h-16 aspect-square bg-secondary/60 rounded-lg"
        >
          <Button
            variant="secondary"
            className="absolute top-1 right-1 p-0 size-9 rounded-full z-10"
            onClick={() => removeFile(index)}
          >
            <X />
          </Button>
          {file.type.startsWith("image/") ? (
            <ChatImagePreview file={file} />
          ) : (
            <ChatFilePreview file={file} />
          )}
        </div>
      ))}
    </div>
  );
}

export function ChatImagePreview({ file }: { file: File }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!imageUrl) return null;

  return (
    <Image
      width={512}
      height={512}
      src={imageUrl}
      alt={file.name}
      className="w-full h-full object-cover rounded-lg"
      priority
    />
  );
}

export function ChatFilePreview({ file }: { file: File }) {
  const IconComponent = getFileIcon(file.type);

  return (
    <div className="flex flex-col items-center gap-1 p-2">
      <IconComponent className="size-8 text-muted-foreground" />
    </div>
  );
}
