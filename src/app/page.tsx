import Socials from "@/components/Socials";
import { createClient } from "@/lib/supabase/server";
import GalleryClient from "./gallery-client";
import VideoBanner from "@/components/VideoBanner";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const PAGE_SIZE = 15;

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
      <main className="max-w-6xl mx-auto p-6">
        <p className="text-red-600">Failed to load posts: {error.message}</p>
      </main>
    );
  }

  const initialItems = data ?? [];
  const total = count ?? initialItems.length;

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

  const rowsize = 3;
  const missing = (rowsize - (initialItems.length % rowsize)) % rowsize;
  const initialFillers = Array.from(
    { length: missing },
    (_, i) => FILLERS[i % FILLERS.length]
  );

  return (
    <main className="w-full bg-stone-100 min-h-screen">
      <section className="max-w-6xl mx-auto bg-stone-100">
        <VideoBanner />
        <Socials />
        <p className="text-center lg:pb-10 pb-5 text-xs lg:text-lg text-stone-700">
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
