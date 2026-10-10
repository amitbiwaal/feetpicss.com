"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/lib/actions/auth";

const INITIAL: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, INITIAL);

  return (
    <form className="form" action={formAction}>
      {state.error ? (
        <div className="alert bad" role="alert">
          {state.error}
        </div>
      ) : null}
      <div className="field">
        <label htmlFor="login-username">Username</label>
        <input id="login-username" name="username" type="text" autoComplete="username" autoCapitalize="none" required />
      </div>
      <div className="field">
        <label htmlFor="login-password">Password</label>
        <input id="login-password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <button className="a-btn primary" type="submit" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
