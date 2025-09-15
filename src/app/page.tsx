import GalleryImage from "@/components/GalleryImage";
import Socials from "@/components/Socials";
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
    alt: "Observator News",
  },
  {
    src: "/assets/icons/instagram.svg",
    href: "https://observatornews.ro",
    alt: "Instagram",
  },
  {
    src: "/assets/icons/tiktok.svg",
    href: "https://observatornews.ro",
    alt: "TikTok",
  },
];

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("id,title,image_url,link_url")
    .eq("published", true)
    .order("sort_index", { ascending: true, nullsFirst: false })
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
    <main className="w-full bg-stone-100 h-100vh ">
      <section className="max-w-6xl mx-auto bg-stone-100">
        <Image
          width={1000}
          height={400}
          src="/assets/images/cover.jpg"
          alt="cover"
          className="w-full pb-6"
        />
        <Socials />
        <p className="text-center lg:pb-10 pb-5 text-xs lg:text-lg text-stone-700">
          Apasă pe imagine pentru a accesa întreaga știre.
        </p>
        <ul className="grid grid-cols-3 md:gap-3 gap-1 md:p-3 p-1">
          {posts?.map((p) => (
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
                {/* <div className="relative w-full aspect-[4/5]">
                  <Image
                    src={p.image_url}
                    alt={p.title}
                    fill
                    className="object-cover hover:scale-105 hover:grayscale-50 transition-transform duration-500"
                    sizes="33vw"
                  />
                </div> */}
                <GalleryImage
                  src={p.image_url}
                  alt={p.title}
                  className="object-cover hover:scale-105 hover:grayscale-50 transition-transform duration-500"
                />
              </Link>
            </li>
          ))}

          {fillers.map((f, i) => (
            <li
              key={`filler-${i}`}
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
      </section>
    </main>
  );
}
