import Image from "next/image";
import Link from "next/link";

type Social = {
  id: number;
  name: string;
  image: string;
  url: string;
};

const socials: Social[] = [
  {
    id: 1,
    name: "observatornews.ro",
    image: "/assets/icons/observator.png",
    url: "https://observatornews.ro",
  },
  {
    id: 2,
    name: "instagram",
    image: "/assets/icons/instagram.svg",
    url: "https://www.instagram.com/observatorantena1",
  },
  {
    id: 3,
    name: "facebook",
    image: "/assets/icons/facebook.svg",
    url: "https://www.facebook.com/ObservatorAntena1",
  },
  {
    id: 4,
    name: "youtube",
    image: "/assets/icons/youtube.svg",
    url: "https://www.youtube.com/@ObservatorTV",
  },
  {
    id: 5,
    name: "tiktok",
    image: "/assets/icons/tiktok.svg",
    url: "https://www.tiktok.com/@observatorantena1",
  },
];

export default function Socials() {
  return (
    <nav
      aria-label="Rețele sociale"
      className="lg:py-2 pb-2 lg:pb-4"
    >
      <ul className="flex items-center justify-center md:gap-4">
        {socials.map((s) => {
          const isMain = s.name === "observatornews.ro";
          const size = isMain ? { w: 120, h: 50 } : { w: 24, h: 24 };

          return (
            <li key={s.id}>
              <Link
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2  px-2 md:px-5 py-2 hover:grayscale-70 hover:scale-105 duration-300"
              >
                <Image
                  src={s.image}
                  alt={s.name}
                  width={size.w}
                  height={size.h}
                  className="md:scale-140"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
