import useSession from "@/components/hooks/use-session";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/components/utils";
import { Copy, Pencil, Trash } from "lucide-react";
import { ReactNode, useRef } from "react";
import { useMessage } from ".";
import { DeleteDialog, EditDialog } from "./dialogs";

export default function MessageDropdown({ children }: { children: ReactNode }) {
  const message = useMessage();
  const { profile } = useSession();
  const isOwnMessage = message.author.id === profile.id;
  const editRef = useRef<HTMLDivElement>(null);
  const deleteRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex">
      <ContextMenu>
        <ContextMenuTrigger
          className={cn(
            "flex flex-col w-full gap-1",
            isOwnMessage ? "items-end" : "items-start"
          )}
        >
          {children}
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onClick={() => navigator.clipboard.writeText(message.text || "")}
          >
            <Copy />
            Copy
          </ContextMenuItem>
          {isOwnMessage && (
            <>
              <ContextMenuItem onClick={() => editRef.current?.click()}>
                <Pencil />
                Edit
              </ContextMenuItem>
              <ContextMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => deleteRef.current?.click()}
              >
                <Trash className="text-destructive/80" />
                Delete
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>
      <EditDialog>
        <div className="hidden" ref={editRef} />
      </EditDialog>
      <DeleteDialog>
        <div className="hidden" ref={deleteRef} />
      </DeleteDialog>
    </div>
  );
}
