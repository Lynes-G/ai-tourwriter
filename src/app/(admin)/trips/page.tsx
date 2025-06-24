import { getAllTrips } from "@/appwrite/trips";
import { Header, TripCard, ClientPagination } from "@/components";
import { transformTripDocument } from "@/lib/trip-utils";

import { Suspense } from "react";

export default async function Trips({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { page = "1" } = await searchParams;
  const currentPage = parseInt(page as string, 10);
  const itemPerPage = 8;

  try {
    const { allTrips, total } = await getAllTrips(
      itemPerPage,
      (currentPage - 1) * itemPerPage,
    );

    const transformedTrips = allTrips
      .filter((trip) => trip && trip.$id && trip.tripDetail)
      .map(transformTripDocument);

    const totalPages = Math.ceil(total / itemPerPage);

    return (
      <main className="all-users wrapper">
        <Header
          title="Trips"
          description="View and edit AI-generated travel plans"
          ctaText="Create a trip"
          ctaUrl="trips/create"
        />
        <Suspense fallback={<div>Loading...</div>}>
          <section>
            <h1 className="p-24-semibold text-dark-100 mb-4">
              Manage created trips
            </h1>

            {transformedTrips.length > 0 ? (
              <div className="trip-grid mb-4">
                {transformedTrips.map((trip) => (
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
              <div className="py-12 text-center">
                <h2 className="mb-2 text-xl font-semibold text-gray-600">
                  No trips found
                </h2>
                <p className="mb-4 text-gray-500">
                  You haven't created any trips yet
                </p>{" "}
                <a
                  href="/trips/create"
                  className="bg-primary-600 hover:bg-primary-700 inline-block rounded-lg px-6 py-2 text-white transition-colors"
                >
                  Create your first trip
                </a>
              </div>
            )}

            {/* Pagination Controls */}
            {/* {totalPages > 1 && (
              
            )} */}
            <ClientPagination
              totalRecordsCount={total}
              pageSize={itemPerPage}
              currentPage={currentPage}
              basePath="/trips"
            />
          </section>
        </Suspense>
      </main>
    );
  } catch (err: any) {
    console.error("Error fetching trips:", err);

    return (
      <main className="all-users wrapper">
        <Header
          title="Trips"
          description="View and edit AI-generated travel plans"
          ctaText="Create a trip"
          ctaUrl="trips/create"
        />
        <section>
          <div className="py-12 text-center">
            <h1 className="mb-2 text-2xl font-bold text-red-600">
              Error Loading Trips
            </h1>
            <p className="mb-4 text-gray-600">
              There was an error loading your trips. Please try again later.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 hover:bg-primary-700 rounded-lg px-6 py-2 text-white transition-colors"
            >
              Retry
            </button>
          </div>
        </section>
      </main>
    );
  }
}
