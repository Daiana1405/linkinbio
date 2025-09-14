"use client";
import { useFormStatus } from "react-dom";
import Spinner from "./Spinner";

export default function SubmitButton({
  children,
  className = "rounded px-4 py-2 bg-black text-white w-full",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className} disabled:opacity-60`}
    >
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <Spinner className="h-4 w-4" />
          Se încarcă…
        </span>
      ) : (
        children
      )}
    </button>
  );
}
