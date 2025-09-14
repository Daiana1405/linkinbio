import { Suspense } from "react";
import LoginForm from "./form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function LoginPage() {
  return (
    <main className="max-w-md mx-auto pt-16">
      <h1 className="text-2xl font-semibold mb-4">Autentificare</h1>
      <Suspense fallback={<p className="text-sm text-gray-500">Se încarcă…</p>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
