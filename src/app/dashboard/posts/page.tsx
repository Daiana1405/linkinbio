import { createClient } from "@/lib/supabase/server";
import { deletePost, togglePublish } from "./actions";

type PostRow = {
  id: string;
  title: string;
  created_at: string;
  published: boolean;
  image_path: string;
};

export default async function MyPostsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: posts } = await supabase
    .from("posts")
    .select("id,title,created_at,published,image_path")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-6">My Posts</h1>

      {!posts?.length && <p>No posts yet.</p>}

      <ul className="space-y-3">
        {posts?.map((p: PostRow) => (
          <li
            key={p.id}
            className="border rounded p-4 flex items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <p className="font-medium truncate">{p.title}</p>
              <p className="text-xs text-gray-500">
                {new Date(p.created_at).toLocaleString()} ·{" "}
                {p.published ? "Published" : "Draft"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <form action={togglePublish}>
                <input
                  type="hidden"
                  name="id"
                  value={p.id}
                />
                <input
                  type="hidden"
                  name="published"
                  value={String(p.published)}
                />
                <button className="text-sm rounded px-3 py-1 border">
                  {p.published ? "Unpublish" : "Publish"}
                </button>
              </form>

              <form
                action={deletePost}
                onSubmit={(e) => {
                  if (!confirm("Delete this post? This cannot be undone."))
                    e.preventDefault();
                }}
              >
                <input
                  type="hidden"
                  name="id"
                  value={p.id}
                />
                <input
                  type="hidden"
                  name="image_path"
                  value={p.image_path}
                />
                <button className="text-sm rounded px-3 py-1 border border-red-400 text-red-600">
                  Delete
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
