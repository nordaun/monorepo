"use client";

import { leaveChat, renameChat } from "@/chat/actions";
import {
  FileInput,
  FileInputContent,
  FileInputDescription,
  FileInputError,
  FileInputField,
  FileInputIcon,
  FileInputList,
  FileInputLoader,
  FileInputSubmit,
  FileInputTitle,
} from "@/components/blocks/file";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { uploadChatAvatar } from "@/files/actions";
import ky from "ky";
import { ArrowUpFromLine } from "lucide-react";
import {
  ChangeEvent,
  ReactNode,
  useActionState,
  useEffect,
  useState,
} from "react";
import { useChat } from ".";
import { useAvatarFiles } from "./settings";

export function NameDialog({ children }: { children: ReactNode }) {
  const { providerId, name } = useChat();
  const [state, action, pending] = useActionState(
    renameChat.bind(null, providerId),
    undefined
  );
  const [formData, setFormData] = useState({
    name: name || "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Message</AlertDialogTitle>
          <AlertDialogDescription>Edit your message:</AlertDialogDescription>
          <form action={action}>
            <Input
              id="name"
              name="name"
              type="name"
              placeholder={"Chat name"}
              value={formData.name}
              onChange={handleChange}
            />
            {state?.message && (
              <Alert variant="destructive">
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}
            <div className="flex flex-row gap-4 mt-3">
              <AlertDialogCancel className="flex-1 w-full">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                aria-disabled={pending}
                disabled={pending}
                className="flex-1 w-full"
                type="submit"
              >
                Rename
              </AlertDialogAction>
            </div>
          </form>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function AvatarDialog({ children }: { children: ReactNode }) {
  const { providerId: chatId } = useChat();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [state, action, pending] = useActionState(
    uploadChatAvatar.bind(null, chatId),
    undefined
  );
  const { providerId, files, clearFiles } = useAvatarFiles();

  useEffect(() => {
    const file = files[0];

    if (pending) setSubmitting(true);
    if (!submitting || pending) return;
    if (!state?.result || !file) {
      setSubmitting(false);
      return;
    }

    const signedUrl = state?.result?.values().next().value!.signedUrl;
    if (!signedUrl) return;

    ky.put(new URL(signedUrl), {
      body: file,
      headers: { "Content-Type": file.type },
    })
      .then(() => {
        clearFiles();
        if (!state?.message) setOpen(false);
        setSubmitting(false);
      })
      .catch((err) => {
        console.error("Upload failed", err);
        setSubmitting(false);
      });
  }, [pending, state, submitting, files, clearFiles]);

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-center">
          <DialogTitle>Chat Avatar</DialogTitle>
          <DialogDescription>...</DialogDescription>
        </DialogHeader>
        <FileInput className="w-full" action={action} providerId={providerId}>
          <FileInputField>
            <FileInputContent>
              <FileInputIcon>
                <ArrowUpFromLine />
              </FileInputIcon>
              <FileInputTitle>Upload</FileInputTitle>
              <FileInputDescription>
                Upload your files here
              </FileInputDescription>
            </FileInputContent>
            <FileInputLoader>Uploading...</FileInputLoader>
          </FileInputField>
          <FileInputList />
          <FileInputError className="w-full text-left" />
          {state?.message && (
            <Alert>
              <AlertDescription>{state?.message}</AlertDescription>
            </Alert>
          )}
          <FileInputSubmit disabled={pending}>Submit</FileInputSubmit>
        </FileInput>
      </DialogContent>
    </Dialog>
  );
}

export function LeaveDialog({ children }: { children: ReactNode }) {
  const { providerId } = useChat();
  const [state, action, pending] = useActionState(
    leaveChat.bind(null, providerId),
    undefined
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to leave this chat?
          </AlertDialogDescription>
          <form action={action}>
            {state?.message && (
              <Alert variant="destructive">
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}
            <div className="flex flex-row gap-4 mt-3">
              <AlertDialogCancel className="flex-1 w-full">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                aria-disabled={pending}
                disabled={pending}
                className="flex-1 w-full"
                type="submit"
              >
                Yes
              </AlertDialogAction>
            </div>
          </form>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
