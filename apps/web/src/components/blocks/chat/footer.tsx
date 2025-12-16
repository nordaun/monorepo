"use client";

import { sendMessage } from "@/chat/actions";
import { pickError } from "@/chat/tools/pickError";
import {
  FileInput,
  FileInputContent,
  FileInputDescription,
  FileInputError,
  FileInputField,
  FileInputIcon,
  FileInputList,
  FileInputLoader,
  FileInputTitle,
} from "@/components/blocks/file";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/components/utils";
import ky from "ky";
import { ArrowUpFromLine, Plus, Send } from "lucide-react";
import {
  ChangeEvent,
  ComponentProps,
  KeyboardEvent,
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useChat, useFiles } from ".";
import ChatPreviews from "./previews";

export default function ChatFooter() {
  const { error } = useChat();

  return (
    <div className="flex flex-col gap-4 w-full px-4 pt-3">
      <ChatPreviews />
      {error && (
        <Alert variant={"destructive"}>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-row gap-3 items-end justify-evenly w-full min-h-[3dvh] h-fit shrink-0">
        <ChatUpload className="not-lg:hidden" />
        <ChatTextarea />
        <div className="flex flex-col p-0 gap-2 lg:h-10">
          <ChatUpload className="lg:hidden" />
          <ChatSend />
        </div>
      </div>
    </div>
  );
}

function ChatTextarea() {
  const { draft, setDraft } = useChat();
  const { files } = useFiles();

  const handleEnter = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (draft.trim().length === 0 && files.length === 0) return;
      const form = document.querySelector("form[data-chat-form]");
      if (form instanceof HTMLFormElement) form.requestSubmit();
    }
  };

  return (
    <Textarea
      name="text"
      placeholder="Type your message here (Enter to send, Shift+Enter for new line)"
      className="flex-1 resize-none rounded-3xl px-4 max-h-[30dvh] min-h-10 not-lg:h-full overflow-y-auto z-50"
      rows={1}
      value={draft}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
        setDraft(e.target.value)
      }
      onKeyDown={handleEnter}
    />
  );
}

function ChatUpload({ className }: ComponentProps<"button">) {
  const { files } = useFiles();
  const [open, setOpen] = useState(false);
  const openable = files.length === 0 && open;

  return (
    <Dialog open={openable} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger>
        <Button
          className={cn("aspect-square p-0 rounded-full w-fit h-10", className)}
          variant="secondary"
        >
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-center">
          <DialogTitle>Add attachments</DialogTitle>
          <DialogDescription>Upload your attachments</DialogDescription>
        </DialogHeader>
        <ChatUploadForm />
      </DialogContent>
    </Dialog>
  );
}

function ChatSend() {
  const { providerId, draft, setDraft, setError } = useChat();
  const { details, files, clearFiles } = useFiles();

  const submitting = useRef(false);
  const [state, action, pending] = useActionState(
    sendMessage.bind(null, providerId),
    undefined
  );

  const clearUp = useCallback(() => {
    setError(null);
    setDraft("");
    clearFiles();
    submitting.current = false;
  }, [setDraft, setError, clearFiles]);

  useEffect(() => {
    if (pending) submitting.current = true;
    if (!submitting.current || pending) return;
    if (state?.errors) return setError(pickError(state.errors));
    if (files.length === 0 || !state?.result) return clearUp();

    const urlCollection = Array.from(state.result.values());
    for (const file of files) {
      const signedUrl = urlCollection[files.indexOf(file)]?.signedUrl;
      if (!signedUrl) return;
      ky.put(new URL(signedUrl), {
        body: file,
        headers: { "Content-Type": file.type },
      });
    }

    clearUp();
  }, [pending, state, submitting, files, setError, clearUp]);

  const sendable =
    (draft.trim().length > 0 || files.length > 0) &&
    !pending &&
    providerId.trim().length > 0;

  const onSubmit = (e: React.FormEvent) => {
    if (!sendable) {
      e.preventDefault();
      return;
    }
  };

  return (
    <form action={action} onSubmit={onSubmit} data-chat-form>
      <input type="hidden" name="text" value={draft} readOnly />
      <input
        type="hidden"
        name="files"
        value={JSON.stringify(details)}
        readOnly
      />
      <Button
        type="submit"
        className="aspect-square rounded-full w-fit h-10"
        variant="default"
        disabled={!sendable}
      >
        <Send />
      </Button>
    </form>
  );
}

function ChatUploadForm() {
  const { providerId } = useChat();
  if (!providerId) return null;

  return (
    <FileInput className="w-full" providerId={providerId}>
      <FileInputField>
        <FileInputContent>
          <FileInputIcon>
            <ArrowUpFromLine />
          </FileInputIcon>
          <FileInputTitle>Upload</FileInputTitle>
          <FileInputDescription>Upload your files here</FileInputDescription>
        </FileInputContent>
        <FileInputLoader>Uploading...</FileInputLoader>
      </FileInputField>
      <FileInputList />
      <FileInputError />
    </FileInput>
  );
}
