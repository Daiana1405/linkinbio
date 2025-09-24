"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function VideoBanner() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  return (
    <video
      className="w-full h-auto block"
      autoPlay
      muted
      playsInline
      preload="metadata"
      poster="/assets/images/cover.jpg"
      ref={ref}
    >
      <source
        src="/assets/images/cover.webm"
        type="video/webm"
      />
      <source
        src="/assets/images/cover.mp4"
        type="video/mp4"
      />

      <Image
        src="/assets/images/cover.jpg"
        alt="Cover fallback"
        width={1000}
        height={400}
        className="w-full"
      />
    </video>
  );
}
