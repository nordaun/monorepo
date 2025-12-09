"use client";

import useFileContext from "@/components/hooks/use-files";
import FileProvider from "@/components/providers/file";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/components/utils";
import getFileSize from "@/files/tools/getFileSize";
import { X } from "lucide-react";
import {
  ChangeEvent,
  ComponentProps,
  createContext,
  DragEvent,
  useContext,
} from "react";

const preventDefault = (e: DragEvent) => e.preventDefault();
const FileInputContext = createContext<string | null>(null);

const useFiles = () => {
  const id = useContext(FileInputContext);
  if (!id) throw new Error("useFiles should be in a file provider");
  return useFileContext(id);
};

type FileInputProps = ComponentProps<"form"> & {
  providerId: string;
};

function FileInput({
  providerId,
  className,
  children,
  ...props
}: FileInputProps) {
  return (
    <FileInputContext.Provider value={providerId}>
      <form data-slot="file-input" className={className} {...props}>
        {children}
      </form>
    </FileInputContext.Provider>
  );
}

function FileInputField({
  className,
  children,
  ...props
}: ComponentProps<"input">) {
  const { providerId, details, maxLength, accept, addFiles } = useFiles();

  const handleFileAdd = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(event.target.files);
    event.target.value = "";
  };

  const handleFileDrop = (event: DragEvent<HTMLInputElement>) => {
    preventDefault(event);
    addFiles(event.dataTransfer.files);
  };

  const handleClick = () => {
    document.getElementById(`file-input-${providerId}`)?.click();
  };

  return (
    <div hidden={details.length > 0}>
      <input
        id={`file-input-${providerId}`}
        type="file"
        name={details.length === 0 ? "files" : undefined}
        hidden
        accept={accept.join(", ")}
        multiple={maxLength > 1}
        onChange={handleFileAdd}
        onDrop={handleFileDrop}
        {...props}
      />
      {details.length > 0 && (
        <input
          type="hidden"
          name="files"
          value={JSON.stringify(details)}
          readOnly
        />
      )}
      <div
        data-slot="file-input-field"
        className={cn(
          "flex flex-col justify-center items-center gap-4 bg-card text-card-foreground border border-dashed border-border min-h-48 max-h-60 rounded-2xl py-6 shadow-sm cursor-pointer",
          className
        )}
        onClick={handleClick}
        onDrop={handleFileDrop}
        onDragOver={preventDefault}
        onDragEnter={preventDefault}
        onDragLeave={preventDefault}
      >
        {children}
      </div>
    </div>
  );
}

function FileInputList({ className, ...props }: ComponentProps<"div">) {
  const { files, removeFile } = useFiles();

  return (
    <div
      hidden={files.length === 0}
      data-slot="file-input-list"
      className={cn(
        "flex flex-col h-fit max-h-60 p-2 rounded-3xl border-border border bg-card",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-2 overflow-auto w-full h-full rounded-2xl">
        {files.map((file, index) => (
          <FileInputItem
            key={index}
            file={file}
            onRemove={() => removeFile(index)}
          />
        ))}
      </div>
    </div>
  );
}

function FileInputItem({
  file,
  onRemove,
}: {
  file: File;
  onRemove: () => void;
}) {
  return (
    <div
      data-slot="file-input-item"
      className="flex flex-row justify-between items-center gap-2 p-2 pl-4 bg-muted/75 text-card-foreground w-full rounded-2xl"
    >
      <div className="flex flex-col">
        <span className="truncate">{file.name}</span>
        <span className="text-xs text-muted-foreground">
          {getFileSize(file.size)}
        </span>
      </div>
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="rounded-full cursor-pointer bg-muted-foreground/15"
        onClick={onRemove}
      >
        <X />
      </Button>
    </div>
  );
}

function FileInputError({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  const { error } = useFiles();

  return (
    <Alert>
      <AlertDescription
        hidden={!error}
        data-slot="file-input-error"
        className={cn("leading-none text-sm text-destructive mt-2", className)}
        {...props}
      >
        {error ? error : children}
      </AlertDescription>
    </Alert>
  );
}

function FileInputSubmit({ className, ...props }: ComponentProps<"button">) {
  const { loading, files } = useFiles();

  return (
    <Button
      type="submit"
      variant="default"
      className={cn("mt-4 w-full", className)}
      disabled={loading || files.length === 0}
      {...props}
    />
  );
}

function FileInputContent({ className, ...props }: ComponentProps<"div">) {
  const { loading } = useFiles();

  return (
    <div
      hidden={loading}
      data-slot="file-input-content"
      className={cn(
        "flex flex-col justify-center items-center text-center gap-2 px-6",
        className
      )}
      {...props}
    />
  );
}

function FileInputIcon({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="file-input-icon"
      className={cn("size-8 text-primary", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function FileInputTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="file-input-title"
      className={cn("leading-none text-lg font-semibold", className)}
      {...props}
    />
  );
}

function FileInputDescription({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="file-input-description"
      className={cn("leading-none text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function FileInputLoader({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  const { progress, loading } = useFiles();

  if (!loading) return null;

  return (
    <div
      data-slot="file-input-loader"
      {...props}
      className="flex flex-col gap-4 min-w-56 text-center items-center justify-center"
    >
      <div className={cn("leading-none text-lg font-semibold", className)}>
        {children}
      </div>
      <div>{progress}%</div>
      <Progress value={progress} />
    </div>
  );
}

export {
  FileInput,
  FileInputContent,
  FileInputDescription,
  FileInputError,
  FileInputField,
  FileInputIcon,
  FileInputList,
  FileInputLoader,
  FileProvider as FileInputProvider,
  FileInputSubmit,
  FileInputTitle,
};
