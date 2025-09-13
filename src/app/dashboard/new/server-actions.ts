"use server";

import { z } from "zod";
import { randomUUID } from "crypto";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  title: z.string().min(3).max(200),
  body: z.string().min(3).max(5000),
  link_url: z
    .string()
    .trim()
    .optional()
    .transform((v) => v || undefined)
    .pipe(
      z
        .string()
        .url()
        .startsWith("http", "URL must start with http(s)")
        .optional()
    ),
  link_title: z.string().trim().max(120).optional(),
});

function normalizeUrl(u?: string) {
  if (!u) return undefined;
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u}`;
}

export async function createPost(formData: FormData) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const title = String(formData.get("title") ?? "");
  const body = String(formData.get("body") ?? "");
  const link_url_raw = String(formData.get("link_url") ?? "").trim();
  const link_title = String(formData.get("link_title") ?? "").trim();
  const file = formData.get("image");

  const parsed = schema.safeParse({
    title,
    body,
    link_url: link_url_raw,
    link_title,
  });
  if (!parsed.success)
    throw new Error(parsed.error.issues.map((i) => i.message).join(", "));
  const link_url = normalizeUrl(parsed.data.link_url);

  if (!(file instanceof File)) throw new Error("Image is required");
  if (!file.type.startsWith("image/")) throw new Error("Invalid file type");
  if (file.size === 0) throw new Error("Empty file");

  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const path = `${data.user.id}/${Date.now()}-${randomUUID()}-${safeName}`;

  const { error: upErr } = await supabase.storage
    .from("images")
    .upload(path, file, {
      contentType: file.type,
    });
  if (upErr) throw upErr;

  const { data: pub } = supabase.storage.from("images").getPublicUrl(path);
  const image_url = pub.publicUrl;

  const { error: insErr } = await supabase.from("posts").insert({
    user_id: data.user.id,
    title: parsed.data.title,
    body: parsed.data.body,
    image_path: path,
    image_url,
    link_url: link_url ?? null,
    link_title: parsed.data.link_title ?? null,
    published: true,
  });
  if (insErr) throw insErr;

  redirect("/");
}
