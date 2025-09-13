import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  created_at: string;
};

const FILLERS: Array<{ src: string; href: string; alt?: string }> = [
  {
    src: "/assets/images/logo_small_red_black.png",
    href: "https://observatornews.ro",
    alt: "Check this out",
  },
  {
    src: "/fillers/slot2.jpg",
    href: "https://observatornews.ro",
    alt: "Learn more",
  },
  {
    src: "/fillers/slot3.jpg",
    href: "https://observatornews.ro",
    alt: "Get started",
  },
];

export default async function HomePage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id,image_url,link_url")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="max-w-6xl mx-auto p-6">
        <p className="text-red-600">Failed to load posts: {error.message}</p>
      </main>
    );
  }

  const posts = (data ?? []) as Post[];

  const rowsize = 3;
  const count = posts?.length ?? 0;
  const missing = (rowsize - (count % rowsize)) % rowsize;
  const fillers = Array.from(
    { length: missing },
    (_, i) => FILLERS[i % FILLERS.length]
  );

  return (
    <main className="max-w-6xl mx-auto p-6">
      <ul className="grid grid-cols-3 gap-6">
        {/* Real posts */}
        {posts?.map((p) => (
          <li
            key={p.id}
            className="overflow-hidden rounded-lg"
          >
            <Link
              href={p.link_url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={p.image_url}
                  alt={p.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform"
                  sizes="33vw"
                />
              </div>
            </Link>
          </li>
        ))}

        {fillers.map((f, i) => (
          <li
            key={`filler-${i}`}
            className="overflow-hidden rounded-lg"
          >
            <Link
              href={f.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={f.src}
                  alt={f.alt ?? "placeholder"}
                  fill
                  className="object-cover hover:scale-105 transition-transform"
                  sizes="33vw"
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
