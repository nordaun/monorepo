"use client";

import { Metadata, Mime } from "@/files/definitions";
import convertImage from "@/files/tools/convertImage";
import getFileSize from "@/files/tools/getFileSize";
import { Context, createContext, ReactNode, useEffect, useState } from "react";

type FileContext = {
  providerId: string;
  maxLength: number;
  maxSize: number;
  accept: Mime[];
  files: File[];
  details: Metadata[];
  error: string | null;
  loading: boolean;
  progress: number;
  addFiles: (files: FileList | null) => void;
  removeFile: (index: number) => void;
  clearFiles: () => void;
};

type FileProviderProps = {
  providerId: string;
  maxLength: number;
  maxSize: number;
  accept: Mime[];
  resizeWidth: number | undefined;
  resizeHeight: number | undefined;
};

const existingContexts = new Map<string, Context<FileContext>>();

const defaultContext: FileContext = {
  providerId: "",
  maxLength: 1,
  maxSize: 1024 * 1024,
  accept: [],
  files: [],
  details: [],
  error: null,
  loading: true,
  progress: 100,
  addFiles: () => {},
  removeFile: () => {},
  clearFiles: () => {},
};

export function matchContext(providerId: string): Context<FileContext> {
  if (!existingContexts.has(providerId))
    existingContexts.set(
      providerId,
      createContext<FileContext>(defaultContext)
    );
  return existingContexts.get(providerId)!;
}

export default function FileProvider({
  providerId,
  maxLength,
  maxSize,
  accept,
  resizeWidth,
  resizeHeight,
  children,
}: FileProviderProps & { children: ReactNode }) {
  const [files, setFiles] = useState<File[]>([]);
  const [details, setDetails] = useState<Metadata[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(100);

  const validateFile = (file: File): string | null => {
    const fileNameRegex = /^[\p{Ll}\p{Lu}\d_\-.\s]+$/u;
    if (!fileNameRegex.test(file.name))
      return `${file.name} has an invalid name.`;
    if (file.size > maxSize)
      return `${file.name} is larger than ${getFileSize(maxSize)}.`;
    if (!accept.includes(file.type as Mime))
      return `${file.name} has invalid file type.`;

    return null;
  };

  const addFiles = (fileList: FileList | null) => {
    setError(null);

    if (!fileList || fileList.length === 0)
      return setError(`No files selected.`);
    const newFiles = Array.from(fileList);

    if (files.length + newFiles.length > maxLength)
      return setError(`Can't upload more than ${maxLength} files.`);

    const processFiles = async () => {
      const validFiles: File[] = [];
      setLoading(true);
      setProgress(0);

      try {
        for (let file of newFiles) {
          if (file.type.startsWith("image/")) {
            const convertedFile = await convertImage(
              file,
              resizeWidth,
              resizeHeight
            );
            file = convertedFile || file;
          }

          const validationError = validateFile(file);
          if (validationError) {
            setLoading(false);
            return setError(validationError);
          }

          validFiles.push(file);
          setProgress(
            (prev) => prev + Number((100 / newFiles.length).toFixed(0))
          );
        }

        setError(null);
        setFiles((prev) => [...prev, ...validFiles]);
      } catch (error) {
        console.error("Error during file processing:", error);
        setError("Failed to process files. Please try again.");
      } finally {
        setLoading(false);
        setProgress(100);
      }
    };

    processFiles();
  };

  const removeFile = (index: number) => {
    if (index >= 0 && index < files.length) {
      setFiles((prev) => prev.filter((_, i) => i !== index));
      setError(null);
    }
  };

  const clearFiles = () => {
    setFiles([]);
    setDetails([]);
    setError(null);
  };

  useEffect(() => {
    if (files.length === 0) {
      setDetails([]);
      return;
    }

    const processFiles = async () => {
      setLoading(true);
      const newDetails: Metadata[] = [];

      for (const file of files) {
        newDetails.push({
          name: file.name,
          size: file.size,
          type: file.type,
        });
      }

      setDetails(newDetails);
      setLoading(false);
    };

    processFiles();
  }, [files]);

  const values: FileContext = {
    providerId,
    maxLength,
    maxSize,
    accept,
    files,
    details,
    error,
    loading,
    progress,
    addFiles,
    removeFile,
    clearFiles,
  };

  const Context = matchContext(providerId);

  return <Context.Provider value={values}>{children}</Context.Provider>;
}
