import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_LIMIT = 20;
const MAX_VISIBLE_POSTS = 100;

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();

    const { searchParams } = new URL(req.url);

    const requestedLimit = Number(searchParams.get("limit") || DEFAULT_LIMIT);
    const requestedOffset = Number(searchParams.get("offset") || 0);

    const offset = Math.max(requestedOffset, 0);

    if (offset >= MAX_VISIBLE_POSTS) {
      return NextResponse.json({
        ok: true,
        items: [],
        total: MAX_VISIBLE_POSTS,
        hasMore: false,
        nextOffset: null,
        pageSize: 0,
      });
    }

    const remaining = MAX_VISIBLE_POSTS - offset;
    const limit = Math.min(Math.max(requestedLimit, 1), 60, remaining);

    const from = offset;
    const to = offset + limit - 1;

    const { data, error, count } = await supabase
      .from("posts")
      .select("id,title,image_url,link_url,created_at,sort_index", {
        count: "exact",
      })
      .eq("published", true)
      .order("sort_index", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      throw new Error(error.message);
    }

    const realTotal = count ?? 0;
    const total = Math.min(realTotal, MAX_VISIBLE_POSTS);
    const loadedNow = data?.length ?? 0;
    const hasMore = offset + loadedNow < total;

    return NextResponse.json({
      ok: true,
      items: data ?? [],
      total,
      hasMore,
      nextOffset: hasMore ? offset + loadedNow : null,
      pageSize: limit,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load posts";

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
