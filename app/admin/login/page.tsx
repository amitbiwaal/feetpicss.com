import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/admin/LoginForm";
import { LogoMark } from "@/components/Logo";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="login-wrap">
      <div className="login-card">
        <Link className="brand" href="/" aria-label="FeetPicss home">
          <LogoMark />
          FeetPicss
        </Link>
        <h1>Admin sign in</h1>
        <LoginForm />
      </div>
    </main>
  );
}
