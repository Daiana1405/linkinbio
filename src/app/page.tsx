import Socials from "@/components/Socials";
import { createClient } from "@/lib/supabase/server";
import GalleryClient from "./gallery-client";
import VideoBanner from "@/components/VideoBanner";

export const revalidate = 60;

const PAGE_SIZE = 9;
const MAX_VISIBLE_POSTS = 100;

export default async function HomePage() {
  const supabase = await createClient();

  const { data, error, count } = await supabase
    .from("posts")
    .select("id,title,image_url,link_url,created_at,sort_index", {
      count: "exact",
    })
    .eq("published", true)
    .order("sort_index", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })
    .range(0, PAGE_SIZE - 1);

  if (error) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <p className="text-red-600">Failed to load posts: {error.message}</p>
      </main>
    );
  }

  const initialItems = data ?? [];
  const total = Math.min(count ?? initialItems.length, MAX_VISIBLE_POSTS);

  const FILLERS = [
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

  const rowSize = 3;
  const missing = (rowSize - (initialItems.length % rowSize)) % rowSize;
  const initialFillers = Array.from(
    { length: missing },
    (_, i) => FILLERS[i % FILLERS.length],
  );

  return (
    <main className="min-h-screen w-full bg-stone-100">
      <section className="mx-auto max-w-6xl bg-stone-100">
        <VideoBanner />
        <Socials />

        <p className="pb-5 text-center text-xs text-stone-700 lg:pb-10 lg:text-lg">
          Apasă pe imagine pentru a accesa întreaga știre.
        </p>

        <GalleryClient
          initialItems={initialItems}
          initialTotal={total}
          pageSize={PAGE_SIZE}
          fillers={FILLERS}
          initialFillers={initialFillers}
        />
      </section>
    </main>
  );
}
