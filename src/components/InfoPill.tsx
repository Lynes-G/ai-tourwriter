import Image from "next/image";

export default function InfoPill({ text, image }: InfoPillProps) {
  return (
    <figure className="info-pill">
      <Image src={image} alt={text} width={24} height={24} className="size-5" />
      <figcaption>{text}</figcaption>
    </figure>
  );
}
