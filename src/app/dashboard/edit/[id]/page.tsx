import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import EditForm from "./ui";
import { z } from "zod";

type PostForEdit = {
  id: string;
  title: string;
  link_url: string | null;
  image_url: string | null;
  image_path: string | null;
  published: boolean;
};

export const revalidate = 0;

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  // ✅ folosește z.uuid(), nu z.string().uuid()
  const parsed = z.uuid().safeParse(params.id);
  if (!parsed.success) return notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("posts")
    .select("id,title,link_url,image_url,image_path,published,user_id")
    .eq("id", parsed.data)
    .maybeSingle();

  if (error || !data) return notFound();
  if (data.user_id !== user.id) redirect("/dashboard");

  const post: PostForEdit = {
    id: data.id,
    title: data.title,
    link_url: data.link_url,
    image_url: data.image_url,
    image_path: data.image_path,
    published: data.published,
  };

  return <EditForm post={post} />;
}
