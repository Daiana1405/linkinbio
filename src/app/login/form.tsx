// src/app/login/form.tsx
"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login, type LoginState } from "./actions";
import SubmitButton from "@/components/SubmitButton";

const initial: LoginState = { ok: false };

export default function LoginForm() {
  const router = useRouter();
  const [state, formAction] = useActionState<LoginState, FormData>(
    login,
    initial
  );

  useEffect(() => {
    if (state.ok) {
      router.replace(state.redirectTo ?? "/");
      router.refresh();
    }
  }, [state.ok, state.redirectTo, router]);

  return (
    <form
      action={formAction}
      className="space-y-4"
      noValidate
    >
      <input
        type="email"
        name="email"
        required
        placeholder="you@example.com"
        className="border rounded px-3 py-2 w-full"
      />
      <input
        type="password"
        name="password"
        required
        placeholder="••••••"
        className="border rounded px-3 py-2 w-full"
      />

      {!state.ok && state.message && (
        <p className="text-red-600 text-sm">{state.message}</p>
      )}

      <SubmitButton>Autentificare</SubmitButton>
    </form>
  );
}
