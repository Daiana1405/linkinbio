"use client";

import { useState, useMemo, useRef } from "react";
import { useActionState } from "react";
import { saveOrder, type SaveOrderState, deletePost } from "./actions";
import Image from "next/image";
import Link from "next/link";

type Row = {
  id: string;
  title: string;
  image_url: string | null;
  image_path: string | null;
  published: boolean;
  created_at: string;
  sort_index: number | null;
};

function move<T>(arr: T[], from: number, to: number): T[] {
  const copy = [...arr];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

export default function ReorderList({ posts }: { posts: Row[] }) {
  const [items, setItems] = useState(posts);
  const [dragId, setDragId] = useState<string | null>(null);

  const orderRef = useRef<HTMLInputElement>(null);
  const currentIds = items.map((i) => i.id);
  const initialIds = useMemo(() => posts.map((p) => p.id).join(","), [posts]);
  const changed = currentIds.join(",") !== initialIds;

  const [state, formAction, isPending] = useActionState<
    SaveOrderState,
    FormData
  >(saveOrder, { ok: true });

  function onDragStart(e: React.DragEvent<HTMLLIElement>, id: string) {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
  }
  function onDragOver(e: React.DragEvent<HTMLLIElement>, overId: string) {
    e.preventDefault();
    if (!dragId || dragId === overId) return;
    const from = items.findIndex((i) => i.id === dragId);
    const to = items.findIndex((i) => i.id === overId);
    if (from === -1 || to === -1) return;
    setItems((prev) => move(prev, from, to));
  }
  function onDragEnd() {
    setDragId(null);
  }
  function beforeSubmit() {
    if (orderRef.current) {
      orderRef.current.value = JSON.stringify(currentIds);
    }
  }

  return (
    <div className="space-y-4">
      {state?.ok === false && (
        <p className="text-red-600 text-sm">{state.message}</p>
      )}
      {state?.ok && state?.message && (
        <p className="text-green-700 text-sm">{state.message}</p>
      )}
      <form
        action={formAction}
        onSubmit={beforeSubmit}
        className="flex items-center gap-2"
      >
        <input
          ref={orderRef}
          type="hidden"
          name="order"
        />
        <button
          type="submit"
          disabled={!changed || isPending}
          className="rounded px-3 py-1.5 bg-stone-900 text-white disabled:opacity-50"
        >
          {isPending ? "Se salvează…" : "Salvează ordinea"}
        </button>
        <button
          type="button"
          disabled={!changed}
          onClick={() => setItems(posts)}
          className="text-sm underline disabled:opacity-50"
        >
          Resetează
        </button>
      </form>

      <ul className="divide-y">
        {items.map((item) => (
          <li
            key={item.id}
            draggable
            onDragStart={(e) => onDragStart(e, item.id)}
            onDragOver={(e) => onDragOver(e, item.id)}
            onDragEnd={onDragEnd}
            className={`flex items-center gap-3 p-3 ${
              dragId === item.id ? "opacity-70" : ""
            }`}
          >
            <span className="cursor-grab select-none text-gray-400">⠿</span>

            <div className="relative w-1/3 h-60 overflow-hidden bg-stone-50 flex-shrink-0">
              {item.image_url ? (
                <Image
                  fill
                  src={item.image_url}
                  alt={item.title}
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full grid place-items-center text-[10px] text-gray-400">
                  fără
                  <br />
                  imagine
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="wrap">{item.title}</p>
              <p className="text-xs text-gray-500">
                {new Date(item.created_at).toLocaleString()}
              </p>
            </div>

            <span
              className={`text-xs ${
                item.published ? "text-green-700" : "text-amber-700"
              }`}
            >
              {item.published ? "Publicat" : "Draft"}
            </span>

            <div
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <Link
                href={`/dashboard/edit/${item.id}`}
                className="text-xs rounded border px-2 py-1 hover:scale-110"
              >
                Editează
              </Link>

              <form
                action={deletePost}
                onSubmit={(e) => {
                  if (!confirm("Sigur vrei să ștergi acest link?"))
                    e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <input
                  type="hidden"
                  name="id"
                  value={item.id}
                />
                <input
                  type="hidden"
                  name="image_path"
                  value={item.image_path ?? ""}
                />
                <button
                  type="submit"
                  className="text-xs rounded border border-red-400 text-red-600 hover:scale-110 px-2 py-1 cursor-pointer"
                >
                  Șterge
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
