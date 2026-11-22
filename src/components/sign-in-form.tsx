"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth, firebaseConfigured } from "@/lib/firebase";
import { useAuth } from "@/components/auth-provider";

export function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { if (!loading && user) router.replace(params.get("next") === "/admin" ? "/admin" : "/"); }, [loading, user, router, params]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setBusy(true);
    try {
      if (!firebaseAuth) throw new Error("Firebase is not configured yet.");
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      router.replace(params.get("next") === "/admin" ? "/admin" : "/");
    } catch (reason) {
      const code = (reason as { code?: string }).code;
      setError(code === "auth/invalid-credential" || code === "auth/user-not-found" || code === "auth/wrong-password" ? "That email and password don’t match." : (reason as Error).message || "Could not sign in. Please try again.");
    } finally { setBusy(false); }
  }

  return <div className="page-wrap inner-page admin-page"><span className="eyebrow">CHEFBOYZ ACCOUNT</span><h1>Sign in<br /><em>and get to it.</em></h1>
    {!firebaseConfigured ? <p className="auth-note">Firebase is not configured. Add the Firebase web app values from <code>.env.example</code> to your environment, then restart the site.</p> : <form className="auth-form" onSubmit={submit}>
      <label>Email<input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      {error && <p className="form-feedback" role="alert">{error}</p>}
      <button className="button button-primary" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      <p className="auth-note">Use an account created in Firebase Authentication. Ask the store admin for access if you need an account.</p>
    </form>}
    <Link className="text-link" href="/">Back to the storefront ↗</Link>
  </div>;
}
