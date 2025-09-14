"use client";

import { useActionState } from "react";
import { login } from "./actions";

const initial = { ok: true as const, message: "" as string | undefined };

export default function LoginForm() {
  const [state, formAction] = useActionState(login, initial);

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

      {state?.ok === false && (
        <p className="text-red-600 text-sm">{state.message}</p>
      )}

      <button className="rounded px-4 py-2 bg-black text-white w-full">
        Autentificare
      </button>
    </form>
  );
}
