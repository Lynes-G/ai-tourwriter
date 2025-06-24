import { calculateTrendPercentage, cn } from "@/lib/utils";

import Image from "next/image";

export default function StatsCard({
  headerTitle,
  total,
  lastMonthCount,
  currentMonthCount,
}: StatsCard) {
  const { trend, percentage } = calculateTrendPercentage(
    currentMonthCount,
    lastMonthCount,
  );

  const isDecrement = trend === "decrement";

  return (
    <article className="stats-card">
      <h3 className="text-base font-semibold">{headerTitle}</h3>
      <div className="content">
        <div className="flex flex-col gap-4">
          <h2 className="text-4xl font-bold">{total}</h2>
          <div className="flex items-center gap-2">
            <figure className="flex items-center gap-1">
              <Image
                src={`/icons/${isDecrement ? "arrow-down-red" : "arrow-up-green"}.svg`}
                alt={`${trend} icon`}
                width={16}
                height={16}
                className="size-4"
                draggable={false}
              />
              <figcaption
                className={cn(
                  "text-sm font-semibold",
                  isDecrement ? "text-red-500" : "text-success-500",
                )}
              >
                {Math.round(percentage)}%
              </figcaption>
            </figure>
            <p className="truncate text-sm font-semibold text-gray-500">
              vs last month
            </p>
          </div>
        </div>
        <Image
          src={`/icons/${isDecrement ? "decrement" : "increment"}.svg`}
          alt={`${trend} trend graph`}
          width={250}
          height={64}
          draggable={false}
          className="select-none"
        />
      </div>
    </article>
  );
}
