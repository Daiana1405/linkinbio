"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

export default function GalleryImage({
  src,
  alt,
  sizes = "33vw",
  className = "object-cover",
  priority = false,
}: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full aspect-[4/5]">
      {!loaded && (
        <div className="absolute inset-0 grid place-items-center">
          <span className="h-6 w-6 md:h-8 md:w-8 rounded-full border-2 border-stone-300 border-t-stone-600 animate-spin" />
        </div>
      )}

      <Image
        fill
        src={src}
        alt={alt}
        sizes={sizes}
        priority={priority}
        className={`${className} transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoadingComplete={() => setLoaded(true)}
      />
    </div>
  );
}
