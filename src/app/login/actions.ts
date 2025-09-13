"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export type LoginState = { ok: boolean; message?: string; redirectTo?: string };

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .pipe(z.email({ message: "Please enter a valid email address" })),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export async function login(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const supabase = await createClient();

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const { email, password } = parsed.data;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, redirectTo: "/dashboard/new" };
}
