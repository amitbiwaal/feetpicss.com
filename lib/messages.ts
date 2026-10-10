import "server-only";
import { getStore } from "./store";
import { isValidId, newId } from "./storage";
import type { ContactMessage } from "./types";

export type { ContactMessage } from "./types";

export async function readMessages(): Promise<ContactMessage[]> {
  const messages = await getStore().listMessages();
  return messages.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addMessage(input: Omit<ContactMessage, "id" | "createdAt">): Promise<void> {
  await getStore().addMessage({ ...input, id: newId(), createdAt: new Date().toISOString() });
}

export async function removeMessage(id: string): Promise<void> {
  if (!isValidId(id)) throw new Error("Invalid message id");
  await getStore().deleteMessage(id);
}
