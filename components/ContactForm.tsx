"use client";

import { useActionState } from "react";
import { submitContactAction, type ContactState } from "@/lib/actions/contact";

const INITIAL: ContactState = { status: "idle" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactAction, INITIAL);

  if (state.status === "sent") {
    return (
      <div className="alert ok" role="status">
        <strong>Message sent.</strong> Thanks for getting in touch — we read every message.
      </div>
    );
  }

  const errors = state.errors ?? {};
  return (
    <form className="form" action={formAction} noValidate>
      {state.status === "error" && state.message ? (
        <div className="alert bad" role="alert">
          {state.message}
        </div>
      ) : null}

      <div className="field">
        <label htmlFor="contact-name">Your name</label>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          maxLength={80}
          required
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "contact-name-error" : undefined}
        />
        {errors.name ? (
          <span className="err" id="contact-name-error">
            {errors.name}
          </span>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="contact-email">Email address</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          maxLength={160}
          required
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "contact-email-error" : undefined}
        />
        {errors.email ? (
          <span className="err" id="contact-email-error">
            {errors.email}
          </span>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="contact-subject">Subject</label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          maxLength={140}
          required
          aria-invalid={errors.subject ? true : undefined}
          aria-describedby={errors.subject ? "contact-subject-error" : undefined}
        />
        {errors.subject ? (
          <span className="err" id="contact-subject-error">
            {errors.subject}
          </span>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="contact-message">Message</label>
        <textarea
          id="contact-message"
          name="message"
          maxLength={4000}
          required
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "contact-message-error" : "contact-message-hint"}
        />
        {errors.message ? (
          <span className="err" id="contact-message-error">
            {errors.message}
          </span>
        ) : (
          <span className="hint" id="contact-message-hint">
            Please don&apos;t send photos or personal documents.
          </span>
        )}
      </div>

      {/* Honeypot: hidden from people, tempting for bots. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <button className="btn" type="submit" disabled={pending}>
          {pending ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  );
}
