import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/logout/actions";
import Image from "next/image";

export default async function Nav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="border-b bg-stone-50">
      <nav className="max-w-5xl mx-auto flex items-center justify-between h-14 px-4">
        <Link
          href="/"
          className="font-semibold"
        >
          <Image
            src="/assets/icons/observator.png"
            alt="observator logo"
            width={150}
            height={50}
            className="mx-auto "
          />
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard/new"
                className="text-sm font-semibold underline text-stone-800"
              >
                Link nou
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-semibold underline text-stone-800"
              >
                Editează linkuri
              </Link>
              <span className="text-sm text-gray-700">
                Autentificat ca {user.email}
              </span>
              <form action={logout}>
                <button
                  type="submit"
                  className="text-sm rounded bg-stone-800 hover:bg-stone-900 text-white px-3 py-1 cursor-pointer"
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
