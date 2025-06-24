"use client";

import { cn } from "@/lib/utils";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  title: string;
  description: string;
  ctaText?: string;
  ctaUrl?: string;
}

export default function Header({ title, description, ctaText, ctaUrl }: Props) {
  const pathname = usePathname();

  return (
    <header className="header">
      <article>
        <h1
          className={cn(
            "text-dark-100",
            pathname === "/"
              ? "text-2xl font-bold md:text-4xl"
              : "md:texl-2xl text-xl font-semibold",
          )}
        >
          {title}
        </h1>
        <p
          className={cn(
            "font-normal text-gray-800",
            pathname === "/" ? "text-base md:text-lg" : "md:texl-lg text-sm",
          )}
        >
          {description}
        </p>
      </article>
      {ctaText && ctaUrl && (
        <Link href={ctaUrl}>
          <ButtonComponent
            type="button"
            className="button-class !h-10.5 !w-full md:w-[240px]"
          >
            <Image
              src="/icons/plus.svg"
              alt="plus"
              className="size-5"
              width={24}
              height={24}
            />
            <span className="pr-1.5 text-sm font-semibold text-white">
              {ctaText}
            </span>
          </ButtonComponent>
        </Link>
      )}
    </header>
  );
}
