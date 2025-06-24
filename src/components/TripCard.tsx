"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChipDirective,
  ChipListComponent,
  ChipsDirective,
} from "@syncfusion/ej2-react-buttons";
import { cn, getFirstWord } from "@/lib/utils";

export default function TripCard({
  id,
  name,
  location,
  imageUrl,
  tags,
  price,
}: TripCardProps) {
  const pathname = usePathname();
  return (
    <Link
      href={
        pathname === "/" || pathname.startsWith("/travel")
          ? `/travel/${id}`
          : `/trips/${id}`
      }
      className="trip-card"
    >
      <Image src={imageUrl} alt={name} width={300} height={200} />
      <article>
        <h2>{name}</h2>
        <figure>
          <Image
            src="/icons/location-mark.svg"
            alt="location icon"
            width={16}
            height={16}
            className="size-4 object-contain md:object-cover"
          />
          <figcaption className="text-gray-500">{location}</figcaption>
        </figure>
      </article>

      <div className="mt-5 pr-3.5 pb-5 pl-4.5">
        <ChipListComponent id="travel-chip">
          <ChipsDirective>
            {tags.map((tag, index) => (
              <ChipDirective
                key={index}
                text={getFirstWord(tag)}
                cssClass={cn(
                  index === 1
                    ? "!bg-pink-50 !text-pink-500"
                    : "!bg-success-50 !text-success-500",
                )}
              />
            ))}
          </ChipsDirective>
        </ChipListComponent>
      </div>
      <article className="tripCard-pill">{price}</article>
    </Link>
  );
}
