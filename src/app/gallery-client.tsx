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
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json();
      if (json?.ok && Array.isArray(json.items)) {
        setItems((prev) => [...prev, ...json.items]);
        setOffset(offset + json.items.length);
      }
    } finally {
      setLoading(false);
    }
  }

  const rowsize = 3;
  const missing = (rowsize - (items.length % rowsize)) % rowsize;
  const autoFillers = Array.from(
    { length: missing },
    (_, i) => fillers[i % fillers.length]
  );

  const currentFillers =
    offset === initialItems.length ? initialFillers : autoFillers;

  return (
    <>
      <ul className="grid grid-cols-3 md:gap-3 gap-1 md:p-3 p-1">
        {items.map((p) => (
          <li
            key={p.id}
            className="overflow-hidden rounded-xs"
          >
            <Link
              href={p.link_url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="relative w-full aspect-[4/5]">
                <Image
                  src={p.image_url}
                  alt={p.title || "post"}
                  fill
                  className="object-cover hover:scale-105 hover:grayscale-50 transition-transform duration-500"
                  sizes="33vw"
                />
              </div>
            </Link>
          </li>
        ))}

        {currentFillers.map((f, i) => (
          <li
            key={`filler-${offset}-${i}`}
            className="overflow-hidden rounded-xs"
          >
            <Link
              href={f.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="relative w-full aspect-[4/5]">
                <Image
                  src={f.src}
                  alt={f.alt ?? "placeholder"}
                  fill
                  className="object-contain hover:scale-105 hover:grayscale-50 transition-transform duration-500"
                  sizes="33vw"
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
            className="rounded bg-stone-900 text-white px-4 py-2 disabled:opacity-60"
          >
            {loading ? "Se încarcă…" : "Încarcă mai multe"}
          </button>
        </div>
      )}
    </>
  );
}
