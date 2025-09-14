"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export type SaveOrderState = { ok: boolean; message?: string };

export async function saveOrder(
  _prev: SaveOrderState,
  formData: FormData
): Promise<SaveOrderState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Neautentificat" };

  const raw = formData.get("order");
  if (typeof raw !== "string") return { ok: false, message: "Payload invalid" };

  let ids: string[];
  try {
    ids = z.array(z.uuid()).parse(JSON.parse(raw));
  } catch {
    return { ok: false, message: "Ordine invalidă" };
  }

  for (let i = 0; i < ids.length; i++) {
    const { error } = await supabase
      .from("posts")
      .update({ sort_index: i + 1 })
      .eq("id", ids[i])
      .eq("user_id", user.id);

    if (error) return { ok: false, message: error.message };
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
  return { ok: true, message: "Ordinea a fost salvată" };
}

export async function deletePost(formData: FormData): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const Id = z.string().uuid();
  const Path = z.string().min(1).optional();

  const id = Id.safeParse(formData.get("id"));
  const imagePath = Path.safeParse(formData.get("image_path"));

  if (!id.success) return;

  const { error: delErr } = await supabase
    .from("posts")
    .delete()
    .eq("id", id.data)
    .eq("user_id", user.id);

  if (!delErr) {
    const path = imagePath.success ? imagePath.data : undefined;
    if (path) {
      await supabase.storage
        .from("images")
        .remove([path])
        .catch(() => {});
    }
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
}
