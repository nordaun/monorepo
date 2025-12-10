import { deleteMessage, editMessage } from "@/chat/actions";
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
import { Textarea } from "@/components/ui/textarea";
import { File } from "lucide-react";
import { ChangeEvent, ReactNode, useActionState, useState } from "react";
import { useMessage } from ".";

export function EditDialog({ children }: { children: ReactNode }) {
  const message = useMessage();
  const [state, action, pending] = useActionState(
    editMessage.bind(null, message.chatId),
    undefined
  );
  const [formData, setFormData] = useState({
    text: message.text,
    messageId: message.id,
  });

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
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
            <input
              className="hidden"
              readOnly
              id="messageId"
              name="messageId"
              value={formData.messageId}
            />
            <Textarea
              id="text"
              name="text"
              value={formData.text || ""}
              onChange={handleChange}
              className="wrap-break-word whitespace-pre-wrap max-h-60 overflow-auto overflow-x-hidden break-all"
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
                Edit
              </AlertDialogAction>
            </div>
          </form>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DeleteDialog({ children }: { children: ReactNode }) {
  const message = useMessage();
  const [state, action, pending] = useActionState(
    deleteMessage.bind(null, message.chatId),
    undefined
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger>{children}</AlertDialogTrigger>
      <AlertDialogContent className="max-h-[80vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Message</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this message?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-1.5">
          {message.text && (
            <div className="px-3 py-2 w-full border border-border rounded-md wrap-break-word whitespace-pre-wrap max-h-60 overflow-auto overflow-x-hidden break-all">
              {message.text}
            </div>
          )}
          {message.attachments.length > 0 && (
            <div className="flex flex-row text-xs gap-1 text-muted-foreground items-center">
              <File size={14} />
              <span>{message.attachments.length} Attachments</span>
            </div>
          )}
        </div>
        <form action={action}>
          <input
            className="hidden"
            readOnly
            id="messageId"
            name="messageId"
            value={message.id}
          />
          {state?.message && (
            <Alert variant="destructive" className="mt-3">
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          <div className="flex flex-row gap-4">
            <AlertDialogCancel className="flex-1 w-full">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              aria-disabled={pending}
              disabled={pending}
              className="flex-1 w-full bg-destructive text-destructive-foreground hover:bg-destructive/80"
              type="submit"
            >
              Delete
            </AlertDialogAction>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
