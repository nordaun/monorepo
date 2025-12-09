"use client";

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
import useSession from "@/components/hooks/use-session";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { uploadAvatar } from "@/files/actions";
import ky from "ky";
import { ArrowUpFromLine } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState } from "react";
import { useFiles } from "./avatar";

function getInitial(name: string): string {
  const matches = name.match(/\p{Lu}/gu) || [];
  return matches.slice(0, 2).join("");
}

export function AccountAvatarForm() {
  const t = useTranslations("AccountPage");
  const { profile } = useSession();
  const { providerId, files, clearFiles } = useFiles();

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [state, action, pending] = useActionState(uploadAvatar, undefined);

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
      <DialogTrigger asChild>
        <div
          className="relative inline-block cursor-pointer group rounded-full overflow-hidden"
          onClick={() => setOpen(true)}
        >
          <Avatar className="size-18 lg:size-24">
            <AvatarImage src={profile?.avatarUrl || ""} alt={profile?.name} />
            <AvatarFallback className="text-3xl lg:text-4xl bg-primary text-primary-foreground font-medium">
              {getInitial(profile?.name || "?")}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center bg-accent/75 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpFromLine className="size-8 text-accent-foreground" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-center">
          <DialogTitle>{t(`avatarChangeTitle`)}</DialogTitle>
          <DialogDescription>{t(`avatarChangeDescription`)}</DialogDescription>
        </DialogHeader>
        <FileInput className="w-full" action={action} providerId={providerId}>
          <FileInputField>
            <FileInputContent>
              <FileInputIcon>
                <ArrowUpFromLine />
              </FileInputIcon>
              <FileInputTitle>{t(`avatarUploadTitle`)}</FileInputTitle>
              <FileInputDescription>
                {t(`avatarUploadDescription`)}
              </FileInputDescription>
            </FileInputContent>
            <FileInputLoader>{t(`uploading`)}</FileInputLoader>
          </FileInputField>
          <FileInputList />
          <FileInputError className="w-full text-left" />
          {state?.message && (
            <Alert>
              <AlertDescription>{state?.message}</AlertDescription>
            </Alert>
          )}
          <FileInputSubmit disabled={pending}>
            {pending ? t("uploading") : t("upload")}
          </FileInputSubmit>
        </FileInput>
      </DialogContent>
    </Dialog>
  );
}
