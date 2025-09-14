"use client";

import { useActionState } from "react";
import { updatePost, type UpdateState } from "./actions";
import Image from "next/image";

type PostForEdit = {
  id: string;
  title: string;
  link_url: string | null;
  image_url: string | null;
  image_path: string | null;
  published: boolean;
};

const initialState: UpdateState = { ok: true };

export default function EditForm({ post }: { post: PostForEdit }) {
  const [state, action] = useActionState<UpdateState, FormData>(
    updatePost,
    initialState
  );

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit link</h1>
        <a
          href="/dashboard"
          className="underline text-sm"
        >
          Înapoi
        </a>
      </div>

      <form
        action={action}
        className="space-y-4"
        noValidate
      >
        <input
          type="hidden"
          name="id"
          defaultValue={post.id}
        />
        <input
          type="hidden"
          name="image_path"
          defaultValue={post.image_path ?? ""}
        />

        <div>
          <label className="block text-sm font-medium mb-1">Titlu</label>
          <input
            name="title"
            defaultValue={post.title}
            required
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Link (optional)
          </label>
          <input
            name="link_url"
            defaultValue={post.link_url ?? ""}
            placeholder="https://example.com"
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="published"
            type="checkbox"
            name="published"
            defaultChecked={post.published}
          />
          <label htmlFor="published">Published</label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Replace image
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="cursor-pointer"
          />
          <p className="text-xs text-gray-500 mt-1">JPG/PNG/WebP, max 5 MB.</p>

          {post.image_url && (
            <div className="mt-3">
              <p className="text-xs text-gray-600 mb-1">Current image:</p>
              <div className="relative w-full h-100">
                <Image
                  fill
                  src={post.image_url}
                  alt="current"
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          )}
        </div>

        {state?.ok === false && (
          <p className="text-red-600 text-sm">{state.message}</p>
        )}
        {state?.ok && state?.message && (
          <p className="text-green-700 text-sm">{state.message}</p>
        )}

        <button className="rounded px-4 py-2 bg-stone-800 hover:bg-stone-900 cursor-pointer text-white">
          Salvează
        </button>
      </form>
    </main>
  );
}
