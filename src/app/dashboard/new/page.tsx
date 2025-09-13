import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createPost } from "./server-actions";

export default async function NewPostPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <main className="max-w-2xl mx-auto pt-10">
      <h1 className="text-2xl font-semibold mb-6">New Post</h1>

      <form
        action={createPost}
        encType="multipart/form-data"
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            name="title"
            required
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Body</label>
          <textarea
            name="body"
            rows={5}
            required
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Link (optional)
            </label>
            <input
              name="link_url"
              placeholder="https://example.com"
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Link title (optional)
            </label>
            <input
              name="link_title"
              placeholder="Read more"
              className="border rounded px-3 py-2 w-full"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            JPG/PNG/WebP recommended.
          </p>
        </div>

        <button className="rounded px-4 py-2 bg-black text-white">
          Publish
        </button>
      </form>
    </main>
  );
}
