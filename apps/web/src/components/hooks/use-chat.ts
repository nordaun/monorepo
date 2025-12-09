import { useContext } from "react";
import { matchContext } from "../providers/chat";

export default function useChat(id: string) {
  const Context = matchContext(id);
  const context = useContext(Context);
  if (!context)
    throw new Error(
      `The useChat() hook must be used within a ChatProvider with id: "${id}".`
    );
  return context;
}
