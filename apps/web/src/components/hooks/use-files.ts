import { useContext } from "react";
import { matchContext } from "../providers/file";

export default function useFiles(id: string) {
  const Context = matchContext(id);
  const context = useContext(Context);
  if (!context)
    throw new Error(
      `The useFiles() hook must be used within a FileProvider with id: "${id}".`
    );
  return context;
}
