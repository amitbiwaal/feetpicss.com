import type { Metadata } from "next";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { deleteMessageAction } from "@/lib/actions/contact";
import { requireAdmin } from "@/lib/auth";
import { readMessages } from "@/lib/messages";
import { formatDate } from "@/lib/site";

export const metadata: Metadata = { title: "Messages" };

// Admin pages render per request behind the session check; waiting for them on navigation is intended.
export const instant = false;

export default async function AdminMessagesPage() {
  await requireAdmin();
  const messages = await readMessages();

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Messages</h1>
          <p>
            {messages.length} message{messages.length === 1 ? "" : "s"} from the contact form
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="a-empty">
          <h2>No messages yet</h2>
          <p>Messages sent through the contact page will appear here.</p>
        </div>
      ) : (
        messages.map((message) => (
          <article className="a-card msg" key={message.id}>
            <header>
              <div>
                <h2>{message.subject}</h2>
                <div className="from">
                  {message.name} · <a href={`mailto:${encodeURIComponent(message.email)}`}>{message.email}</a> ·{" "}
                  <time dateTime={message.createdAt}>{formatDate(message.createdAt)}</time>
                </div>
              </div>
              <DeleteButton
                action={deleteMessageAction.bind(null, message.id)}
                confirmText="Delete this message? This cannot be undone."
              />
            </header>
            <p className="body">{message.message}</p>
          </article>
        ))
      )}
    </>
  );
}
