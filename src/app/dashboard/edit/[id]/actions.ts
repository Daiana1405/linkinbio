"use server";

import { z } from "zod";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

export type UpdateState = { ok: boolean; message?: string };

type BasePayload = {
  title: string;
  link_url: string | null;
  published: boolean;
};

type ImagePayload = {
  image_path: string;
  image_url: string;
};

type PostUpdatePayload = BasePayload & Partial<ImagePayload>;

const schema = z.object({
  id: z.uuid(),
  title: z.string().min(3).max(200),

  link_url: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined))
    .pipe(z.url().optional()),

  published: z
    .union([z.literal("on"), z.undefined()])
    .transform((v) => v === "on"),
  image_path: z.string().optional(),
});

function norm(u?: string | null) {
  if (!u) return null;
  return /^https?:\/\//i.test(u) ? u : `https://${u}`;
}

export async function updatePost(
  _prev: UpdateState,
  formData: FormData
): Promise<UpdateState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Not authenticated" };

  const parsed = schema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    link_url: formData.get("link_url"),
    published: formData.get("published"),
    image_path: formData.get("image_path"),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const { id, title, link_url, published, image_path } = parsed.data;

  let newImagePath: string | null = image_path || null;
  let newImageUrl: string | null = null;

  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    if (!ALLOWED_MIME.has(file.type)) {
      return { ok: false, message: "Only JPG/PNG/WebP" };
    }
    if (file.size > MAX_BYTES) {
      return { ok: false, message: "Image too large (max 5 MB)" };
    }

    const safe = file.name.replace(/[^\w.\-]+/g, "_");
    const path = `${user.id}/${Date.now()}-${randomUUID()}-${safe}`;

    const { error: upErr } = await supabase.storage
      .from("images")
      .upload(path, file, { contentType: file.type });
    if (upErr) return { ok: false, message: upErr.message };

    const { data: pub } = supabase.storage.from("images").getPublicUrl(path);
    newImagePath = path;
    newImageUrl = pub.publicUrl;

    if (image_path) {
      await supabase.storage
        .from("images")
        .remove([image_path])
        .catch(() => {});
    }
  }

  const payload: PostUpdatePayload = {
    title,
    link_url: norm(link_url ?? null),
    published,
    ...(newImagePath && newImageUrl
      ? { image_path: newImagePath, image_url: newImageUrl }
      : {}),
  };

  const { error: updErr } = await supabase
    .from("posts")
    .update(payload)
    .eq("id", id)
    .eq("user_id", user.id);

  if (updErr) return { ok: false, message: updErr.message };

  revalidatePath("/");
  revalidatePath("/dashboard");
  return { ok: true, message: "Saved!" };
}
