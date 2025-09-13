import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import NewPostForm from "./ui";

export default async function NewPostPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return <NewPostForm />;
}
