import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/logout/actions";

export default async function Nav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b bg-gray-50">
      <nav className="max-w-5xl mx-auto flex items-center justify-between h-14 px-4">
        <Link
          href="/"
          className="font-semibold"
        >
          Mini CMS
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard/new"
                className="text-sm underline"
              >
                New Post
              </Link>
              <span className="text-sm text-gray-700">{user.email}</span>
              <form action={logout}>
                <button
                  type="submit"
                  className="text-sm rounded bg-black text-white px-3 py-1"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="text-sm underline"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
