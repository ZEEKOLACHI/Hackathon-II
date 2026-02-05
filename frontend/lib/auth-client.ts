"use client";

import { useState, useEffect } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface Session {
  user: User | null;
  token: string | null;
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        setSession(data);
        setIsPending(false);
      })
      .catch(() => {
        setSession({ user: null, token: null });
        setIsPending(false);
      });
  }, []);

  return { data: session, isPending };
}

export async function signUp(email: string, password: string, name: string) {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Sign up failed");
  }
  return data;
}

export async function signIn(email: string, password: string) {
  const res = await fetch("/api/auth/signin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Sign in failed");
  }
  return data;
}

export async function signOut() {
  await fetch("/api/auth/signout", { method: "POST" });
}
