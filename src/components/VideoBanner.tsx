"use client";
import Image from "next/image";

export default function VideoBanner() {
  return (
    <video
      className="w-full h-auto block"
      autoPlay
      muted
      playsInline
      poster="/assets/images/cover.jpg"
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
