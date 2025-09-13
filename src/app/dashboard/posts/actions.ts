"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function togglePublish(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const published = String(formData.get("published") ?? "false") === "true";

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("posts")
    .update({ published: !published })
    .eq("id", id)
    .eq("user_id", user.id);

  if (!error) revalidatePath("/dashboard/posts");
}

export async function deletePost(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const image_path = String(formData.get("image_path") ?? "");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (!error && image_path) {
    await supabase.storage
      .from("images")
      .remove([image_path])
      .catch(() => {});
  }

  revalidatePath("/dashboard/posts");
}
