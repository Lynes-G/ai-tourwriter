"use client";

import { cn, getFirstWord } from "@/lib/utils";
import {
  ChipDirective,
  ChipListComponent,
  ChipsDirective,
} from "@syncfusion/ej2-react-buttons";
import Image from "next/image";
import { Header, InfoPill, TripCard } from "@/components";

interface TripDetailClientProps {
  tripDetails: any;
  trip: any;
  tripId: string;
  allTrips?: Trip[] | [];
}

// Helper function to get unique locations from itinerary
function getUniqueLocations(itinerary: DayPlan[], country: string): string {
  if (!itinerary?.length) return country || "No locations";

  const uniqueLocations = itinerary
    .map((item: DayPlan) => item.location)
    .filter(
      (location: string, index: number, array: string[]) =>
        location && array.indexOf(location) === index,
    )
    .slice(0, 3);

  return uniqueLocations.length > 0
    ? uniqueLocations.join(", ")
    : country || "No locations";
}

export default function TripDetailClient({
  tripDetails,
  trip,
  tripId,
  allTrips = [],
}: TripDetailClientProps) {
  const {
    name,
    description,
    duration,
    budget,
    travelStyle,
    country,
    interests,
    groupType,
    bestTimeToVisit,
    weatherInfo,
    location,
    itinerary,
  } = tripDetails;

  const imageUrls = trip.imageUrls || [];

  const pillItems = [
    { text: travelStyle, bg: "!bg-pink-50 !text-pink-600" },
    { text: groupType, bg: "!bg-primary-50 !text-primary-800" },
    { text: budget, bg: "!bg-success-50 !text-green-600" },
    { text: interests, bg: "!bg-secondary-50 !text-secondary-600" },
  ];

  const visitTimeAndWeatherInfo = [
    { title: "Best Time to Visit", items: bestTimeToVisit },
    { title: "Weather Info", items: weatherInfo },
  ];

  return (
    <>
      <Header
        title="Trip Details"
        description="View and manage your AI-generated trip details"
      />
      <section className="wrapper-md container">
        <header>
          <h1 className="p-40-semibold text-dark-100">{name}</h1>
          <div className="flex items-center gap-5">
            <InfoPill
              text={`${duration} day plan`}
              image="/icons/calendar.svg"
            />{" "}
            <InfoPill
              text={getUniqueLocations(itinerary, country)}
              image="/icons/location-mark.svg"
            />
          </div>
        </header>
        {/* Gallery */}
        {imageUrls.length > 0 && (
          <section className="gallery">
            {imageUrls.map((url: string, i: number) => (
              <Image
                key={i}
                src={url}
                alt={name || "Trip image"}
                width={600}
                height={400}
                className={cn(
                  "w-full rounded-xl object-cover",
                  i === 0
                    ? "h-[330px] md:col-span-2 md:row-span-2"
                    : "h-[150px] md:row-span-1",
                )}
              />
            ))}
          </section>
        )}
        {/* Pills */}
        <section className="flex flex-wrap items-center justify-between gap-3 md:gap-5">
          <ChipListComponent id="travel-chip">
            <ChipsDirective>
              {pillItems.map((pill, i) =>
                pill.text ? (
                  <ChipDirective
                    key={i}
                    text={getFirstWord(pill.text)}
                    cssClass={`${pill.bg} !text-sm !font-semibold !px-4`}
                  />
                ) : null,
              )}
            </ChipsDirective>
          </ChipListComponent>

          <ul className="flex items-center gap-1">
            {Array(5)
              .fill("null")
              .map((_, i) => (
                <li key={i}>
                  <Image
                    src="/icons/star.svg"
                    alt="Rating Star"
                    width={16}
                    height={16}
                    className="size-4"
                  />
                </li>
              ))}
            <li className="ml-1">
              <ChipListComponent>
                <ChipsDirective>
                  <ChipDirective
                    text="4.9/5"
                    cssClass="!bg-yellow-50 !text-yellow-600"
                  />
                </ChipsDirective>
              </ChipListComponent>
            </li>
          </ul>
        </section>
        <section className="title">
          <article>
            <h3>
              {duration}-Day {country} {travelStyle} Trip
            </h3>
            <p>
              {budget}, {groupType} and {interests}
            </p>
          </article>
          <h2>{tripDetails.estimatedPrice}</h2>
        </section>
        <p className="text-dark-400 text-sm font-normal md:text-lg">
          {description}
        </p>
        <ul className="itinerary">
          {itinerary?.map((dayPlan: DayPlan, i: number) => (
            <li key={i}>
              <h3 className="text-primary-800 mb-2 border-b border-gray-100 pb-1.5">
                Day {dayPlan.day}: {dayPlan.location}
              </h3>
              <ul>
                {dayPlan.activities?.map((activity, j) => (
                  <li key={j}>
                    <span className="p-18-semibold flex-shrink-0">
                      {activity.time}
                    </span>
                    <p className="flex-grow">{activity.description}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <div className="bg-primary-50/50 my-2 flex flex-col gap-6 rounded-2xl p-4">
          {visitTimeAndWeatherInfo.map((section) => (
            <section key={section.title} className="visit">
              <div>
                <h3>{section.title}</h3>
                <ul>
                  {section.items?.map((item: any) => (
                    <li key={item}>
                      <p className="flex-grow">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}{" "}
        </div>
      </section>
      <section className="flex flex-col gap-6">
        <h2 className="p-24-semibold text-dark-100">Popular Trips</h2>
        {allTrips && allTrips.length > 0 ? (
          <div className="trip-grid">
            {allTrips
              .filter((trip) => trip.id !== tripId) // Exclude current trip
              .map((trip) => (
                <TripCard
                  key={trip.id}
                  id={trip.id}
                  name={trip.name}
                  location={
                    trip.itinerary?.[0]?.location ?? trip.country ?? "Unknown"
                  }
                  imageUrl={trip.imageUrls?.[0] ?? ""}
                  tags={[trip.interests, trip.travelStyle].filter(Boolean)}
                  price={trip.estimatedPrice}
                />
              ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="mb-2 text-gray-500">
              No popular trips available at the moment
            </p>
            <p className="text-sm text-gray-400">
              Check back later for new destinations!
            </p>
          </div>
        )}
      </section>
    </>
  );
}
