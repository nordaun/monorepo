"use client";

import { AttachmentSchema, Metadata, Mime } from "@/files/definitions";
import convertImage from "@/files/tools/convertImage";
import { useFormatValidation } from "@/files/tools/formatValidation";
import getFileSize from "@/files/tools/getFileSize";
import { useTranslations } from "next-intl";
import { Context, createContext, ReactNode, useEffect, useState } from "react";
import { treeifyError } from "zod";

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
  const t = useTranslations("Files");
  const formatValidation = useFormatValidation();

  const [files, setFiles] = useState<File[]>([]);
  const [details, setDetails] = useState<Metadata[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(100);

  const validateFile = (file: File) =>
    AttachmentSchema({ maxSize, allowedTypes: accept }).safeParse({
      name: file.name,
      size: file.size,
      type: file.type,
    });

  const addFiles = (fileList: FileList | null) => {
    setError(null);

    if (!fileList || fileList.length === 0) return setError(t("lengthInvalid"));
    const newFiles = Array.from(fileList);

    if (files.length + newFiles.length > maxLength)
      return setError(t("lengthLarge", { length: maxLength }));

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

          const validFields = validateFile(file);

          if (!validFields.success)
            return setError(
              formatValidation(treeifyError(validFields.error).properties!, {
                name: file.name,
                size: getFileSize(maxSize),
              })
            );

          const normalizedFile =
            validFields.data.name !== file.name ||
            validFields.data.type !== file.type
              ? new File([file], validFields.data.name, {
                  type: validFields.data.type,
                  lastModified: file.lastModified,
                })
              : file;

          validFiles.push(normalizedFile);
          setProgress(
            (prev) => prev + Number((100 / newFiles.length).toFixed(0))
          );
        }

        setError(null);
        setFiles((prev) => [...prev, ...validFiles]);
      } catch {
        setError(t("unexpectedError"));
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
