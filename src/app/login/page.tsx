"use client";

import { useActionState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login, type LoginState } from "./actions";

const initialState: LoginState = { ok: true };

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/dashboard/new";

  const [state, formAction] = useActionState(login, initialState);

  useEffect(() => {
    if (state?.ok && state.redirectTo) {
      router.replace(state.redirectTo || next);
    }
  }, [state, router, next]);

  return (
    <main className="max-w-md mx-auto pt-16">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>

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
          Sign in
        </button>
      </form>
    </main>
  );
}
