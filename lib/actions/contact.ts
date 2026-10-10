"use server";

import { clientIp, requireAdmin } from "../auth";
import { addMessage, removeMessage } from "../messages";
import { blockedMinutes, recordAttempt } from "../rate-limit";
import { isValidId } from "../storage";

export type ContactState = {
  status: "idle" | "sent" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "subject" | "message", string>>;
};

const WINDOW_MS = 60 * 60 * 1000;
const PER_IP_LIMIT = 5;
const GLOBAL_LIMIT = 200;

function field(formData: FormData, name: string, max: number): string {
  return String(formData.get(name) ?? "").trim().slice(0, max);
}

export async function submitContactAction(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: real visitors never see or fill this field, so pretend it worked and store nothing.
  if (String(formData.get("website") ?? "") !== "") return { status: "sent" };

  const name = field(formData, "name", 80);
  const email = field(formData, "email", 160);
  const subject = field(formData, "subject", 140);
  const message = field(formData, "message", 4000);

  const errors: ContactState["errors"] = {};
  if (name.length < 2) errors.name = "Enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.email = "Enter a valid email address.";
  if (subject.length < 3) errors.subject = "Add a short subject.";
  if (message.length < 10) errors.message = "Write a message of at least 10 characters.";
  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Check the highlighted fields and try again.", errors };
  }

  try {
    const ipKey = `contact:${await clientIp()}`;
    const [perIp, overall] = await Promise.all([
      blockedMinutes(ipKey, PER_IP_LIMIT),
      blockedMinutes("contact:all", GLOBAL_LIMIT),
    ]);
    if (perIp || overall) {
      return { status: "error", message: "Too many messages sent from here. Try again later." };
    }
    await Promise.all([recordAttempt(ipKey, WINDOW_MS), recordAttempt("contact:all", WINDOW_MS)]);
    await addMessage({ name, email, subject, message });
  } catch (error) {
    console.error("Could not store contact message", error);
    return { status: "error", message: "Something went wrong on our side. Try again in a moment." };
  }
  return { status: "sent" };
}

export async function deleteMessageAction(id: string): Promise<{ ok: boolean }> {
  await requireAdmin();
  if (!isValidId(id)) return { ok: false };
  await removeMessage(id);
  return { ok: true };
}
