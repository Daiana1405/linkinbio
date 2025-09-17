import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_LIMIT = 20;

export async function GET(req: NextRequest) {
  const supabase = await createClient();

  const { searchParams } = new URL(req.url);
  const limit = Math.min(
    Number(searchParams.get("limit") || DEFAULT_LIMIT),
    60
  );
  const offset = Math.max(Number(searchParams.get("offset") || 0), 0);

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
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  const total = count ?? 0;
  const hasMore = offset + (data?.length || 0) < total;

  return NextResponse.json({
    ok: true,
    items: data ?? [],
    total,
    hasMore,
    nextOffset: hasMore ? offset + limit : null,
    pageSize: limit,
  });
}
