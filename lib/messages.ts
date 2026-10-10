import "server-only";
import path from "node:path";
import { MESSAGES_DIR, deleteFile, isValidId, newId, readJsonDir, writeJsonFile } from "./storage";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
};

function messageFile(id: string): string {
  if (!isValidId(id)) throw new Error("Invalid message id");
  return path.join(MESSAGES_DIR, `${id}.json`);
}

export async function readMessages(): Promise<ContactMessage[]> {
  const messages = await readJsonDir<ContactMessage>(MESSAGES_DIR);
  return messages.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function addMessage(input: Omit<ContactMessage, "id" | "createdAt">): Promise<void> {
  const message: ContactMessage = { ...input, id: newId(), createdAt: new Date().toISOString() };
  await writeJsonFile(messageFile(message.id), message);
}

export async function removeMessage(id: string): Promise<void> {
  await deleteFile(messageFile(id));
}
