"use client";

import { useActionState } from "react";
import { createPost, type CreatePostState } from "./server-actions";
import Image from "next/image";
import Link from "next/link";

const initial: CreatePostState = { ok: true };

export default function NewPostForm() {
  const [state, formAction] = useActionState(createPost, initial);

  return (
    <main className="max-w-2xl mx-auto ">
      <h1 className="text-2xl font-semibold mb-6">New Post</h1>

      <form
        action={formAction}
        className="space-y-4"
        noValidate
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

        {state?.ok === false && (
          <p className="text-red-600 text-sm">{state.message}</p>
        )}

        {state?.ok && state?.id && (
          <div className="rounded border p-3 bg-green-50 text-sm space-y-2">
            <p>✅ {state.message}</p>
            {state.imageUrl && (
              <div className="relative w-full h-48">
                <Image
                  fill
                  src={state.imageUrl}
                  alt="uploaded"
                  className="object-cover rounded"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            )}

            <Link
              className="underline"
              href="/"
            >
              View on homepage
            </Link>
          </div>
        )}

        <button className="rounded px-4 py-2 bg-black text-white">
          Publish
        </button>
      </form>
    </main>
  );
}
