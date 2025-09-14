import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ReorderList from "./ReorderList";

type Row = {
  id: string;
  title: string;
  image_url: string | null;
  image_path: string | null;
  published: boolean;
  created_at: string;
  sort_index: number | null;
};

export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("posts")
    .select("id,title,image_url,image_path,published,created_at,sort_index")
    .order("sort_index", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <p className="text-red-600 text-sm">
          Eroare la încărcarea postărilor: {error.message}
        </p>
      </main>
    );
  }

  const posts = (data ?? []) as Row[];

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6 bg-stone-50">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Linkuri</h1>
        <Link
          href="/dashboard/new"
          className="underline"
        >
          Link nou
        </Link>
      </div>

      <ReorderList posts={posts} />
    </main>
  );
}
