// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

function parseAllowed(): Set<string> {
  // e.g. ALLOWED_EMAILS="one@example.com,two@example.com,three@example.com"
  const raw = process.env.ALLOWED_EMAILS ?? "";
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
  );
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: { headers: req.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Keep the session fresh (rotates cookies when needed)
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Guard protected areas
  const pathname = req.nextUrl.pathname;
  const isProtected =
    pathname.startsWith("/dashboard") || pathname.startsWith("/api/admin");

  if (isProtected) {
    // 1) Must be logged in
    if (!session) {
      const url = new URL("/login", req.url);
      url.searchParams.set("next", pathname + req.nextUrl.search);
      return NextResponse.redirect(url);
    }

    // 2) Must be on the allow-list
    const allowed = parseAllowed();
    const email = (session.user.email || "").toLowerCase();
    if (!allowed.has(email)) {
      const url = new URL("/login", req.url);
      url.searchParams.set("err", "unauthorized");
      return NextResponse.redirect(url);
    }
  }

  return res;
}

// Only run on private/admin paths to keep perf
export const config = {
  matcher: ["/dashboard/:path*", "/api/admin/:path*"],
};
