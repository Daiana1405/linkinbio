"use server";

import { z } from "zod";
import { randomUUID } from "crypto";
import { createClient } from "@/lib/supabase/server";

export type CreatePostState = {
  ok: boolean;
  message?: string;
  id?: string;
  imageUrl?: string;
};

const MAX_BYTES = 5 * 1024 * 1024;

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

const schema = z.object({
  title: z.string().min(3).max(200),
  link_url: z
    .string()
    .trim()
    .optional()
    .transform((v) => (v ? v : undefined))
    .pipe(z.string().url().optional()),
});

function normalizeUrl(u?: string) {
  if (!u) return undefined;
  return /^https?:\/\//i.test(u) ? u : `https://${u}`;
}

export async function createPost(
  _prev: CreatePostState,
  formData: FormData
): Promise<CreatePostState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Not authenticated" };

  const parsed = schema.safeParse({
    title: String(formData.get("title") ?? ""),
    link_url: String(formData.get("link_url") ?? ""),
  });
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0].message };
  }

  const file = formData.get("image");
  if (!(file instanceof File))
    return { ok: false, message: "Image is required" };
  if (!ALLOWED_MIME.has(file.type)) {
    return { ok: false, message: "Only JPG, PNG, or WebP images are allowed" };
  }
  if (file.size === 0) return { ok: false, message: "Empty file" };
  if (file.size > MAX_BYTES)
    return { ok: false, message: "Image is too large (max 5 MB)" };

  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const path = `${user.id}/${Date.now()}-${randomUUID()}-${safeName}`;

  const { error: upErr } = await supabase.storage
    .from("images")
    .upload(path, file, { contentType: file.type });
  if (upErr) return { ok: false, message: upErr.message };

  const { data: pub } = supabase.storage.from("images").getPublicUrl(path);
  const image_url = pub.publicUrl;

  const { data, error: insErr } = await supabase
    .from("posts")
    .insert({
      user_id: user.id,
      title: parsed.data.title,
      image_path: path,
      image_url,
      link_url: normalizeUrl(parsed.data.link_url) ?? null,
      published: true,
    })
    .select("id")
    .single();

  if (insErr) return { ok: false, message: insErr.message };

  return {
    ok: true,
    id: data?.id,
    imageUrl: image_url,
    message: "Post created",
  };
}
