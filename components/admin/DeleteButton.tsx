"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

type Props = {
  /** Bound Server Action that deletes the item. */
  action: () => Promise<{ ok: boolean }>;
  confirmText: string;
  label?: string;
};

export function DeleteButton({ action, confirmText, label = "Delete" }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className="a-btn small danger"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(confirmText)) return;
        startTransition(async () => {
          const result = await action();
          if (!result.ok) window.alert("Could not delete. Reload the page and try again.");
          router.refresh();
        });
      }}
    >
      {pending ? "Deleting…" : label}
    </button>
  );
}
