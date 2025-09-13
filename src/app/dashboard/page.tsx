import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import z from "zod";

type Row = {
  id: string;
  title: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("posts")
    .select("id,title,image_url,published,created_at")
    .eq("user_id", user.id)
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

  const Meta = z.object({ display_name: z.string().optional() }).passthrough();

  const posts = (data ?? []) as Row[];

  const parsed = Meta.safeParse(user.user_metadata);
  const displayName = parsed.success ? parsed.data.display_name : undefined;

  const author = displayName ?? user.email ?? "Autor";

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Linkuri</h1>
        <Link
          href="/dashboard/new"
          className="underline"
        >
          Link nou
        </Link>
      </div>

      {!posts.length ? (
        <p>Niciun link postat încă.</p>
      ) : (
        <ul className="divide-y">
          {posts.map((p) => (
            <li
              key={p.id}
              className="py-3 flex items-center justify-between gap-4"
            >
              {/* stânga: thumbnail + text */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-1/3 h-50 overflow-hidden rounded bg-gray-100 flex-shrink-0">
                  {p.image_url ? (
                    <Image
                      fill
                      src={p.image_url}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-xs text-gray-400">
                      fără imagine
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="font-medium truncate">{p.title}</p>
                  <p className="text-xs text-gray-500">
                    publicat de <span className="font-medium">{author}</span> ·{" "}
                    {new Date(p.created_at).toLocaleString()} ·{" "}
                    {p.published ? "Publicat" : "Draft"}
                  </p>
                </div>
              </div>

              <Link
                href={`/dashboard/edit/${p.id}`}
                className="text-sm rounded border px-3 py-1"
              >
                Editează
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
