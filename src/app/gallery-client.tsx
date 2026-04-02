"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  created_at: string;
};

type Props = {
  initialItems: Post[];
  initialTotal: number;
  pageSize: number;
  fillers: Array<{ src: string; href: string; alt?: string }>;
  initialFillers: Array<{ src: string; href: string; alt?: string }>;
};

export default function GalleryClient({
  initialItems,
  initialTotal,
  pageSize,
  fillers,
  initialFillers,
}: Props) {
  const [items, setItems] = useState<Post[]>(initialItems);
  const [total] = useState(initialTotal);
  const [offset, setOffset] = useState(initialItems.length);
  const [loading, setLoading] = useState(false);

  const hasMore = offset < total;

  async function loadMore() {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const url = `/api/posts?limit=${pageSize}&offset=${offset}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error("Failed to load more posts");
      }

      const json = await res.json();

      if (json?.ok && Array.isArray(json.items) && json.items.length > 0) {
        setItems((prev) => [...prev, ...json.items]);
        setOffset((prev) => prev + json.items.length);
      } else {
        setOffset(total);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const rowSize = 3;
  const missing = (rowSize - (items.length % rowSize)) % rowSize;
  const autoFillers = Array.from(
    { length: missing },
    (_, i) => fillers[i % fillers.length],
  );

  const currentFillers =
    offset === initialItems.length ? initialFillers : autoFillers;

  return (
    <>
      <ul className="grid grid-cols-3 gap-1 p-1 md:gap-3 md:p-3">
        {items.map((post) => {
          const image = (
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={post.image_url}
                alt={post.title || "post"}
                fill
                quality={70}
                className="object-cover transition-transform duration-500 hover:scale-105 hover:grayscale-50"
                sizes="(max-width: 768px) 33vw, 33vw"
              />
            </div>
          );

          return (
            <li key={post.id} className="overflow-hidden rounded-xs">
              {post.link_url ? (
                <Link
                  href={post.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {image}
                </Link>
              ) : (
                image
              )}
            </li>
          );
        })}

        {currentFillers.map((filler, i) => (
          <li
            key={`filler-${offset}-${i}`}
            className="overflow-hidden rounded-xs"
          >
            <Link
              href={filler.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={filler.src}
                  alt={filler.alt ?? "placeholder"}
                  fill
                  className="object-contain transition-transform duration-500 hover:scale-105 hover:grayscale-50"
                  sizes="(max-width: 768px) 33vw, 33vw"
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className="flex justify-center py-6">
          <button
            onClick={loadMore}
            disabled={loading}
            className="rounded bg-stone-900 px-4 py-2 text-white disabled:opacity-60"
          >
            {loading ? "Se încarcă…" : "Încarcă mai multe"}
          </button>
        </div>
      )}
    </>
  );
}
