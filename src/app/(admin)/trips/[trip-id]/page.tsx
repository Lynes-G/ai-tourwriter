import { getAllTrips, getTripById } from "@/appwrite/trips";
import TripDetailClient from "@/components/TripDetailClient";
import { parseTripDetails, transformTripDocument } from "@/lib/trip-utils";

// Error component to reduce duplication
function ErrorMessage({ title, message }: { title: string; message: string }) {
  return (
    <div className="wrapper w-full text-center">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p>{message}</p>
    </div>
  );
}

export default async function TripDetail({
  params,
}: {
  params: Promise<{ "trip-id": string }>;
}) {
  const { "trip-id": tripId } = await params;
  try {
    // Fetch both trip and popular trips concurrently using Promise.all
    const [trip, allTripsResult] = await Promise.all([
      getTripById(tripId),
      getAllTrips(6, 0).catch((error) => {
        console.warn("Failed to fetch popular trips:", error);
        return { allTrips: [], total: 0 };
      }),
    ]);

    if (!trip) {
      return (
        <ErrorMessage
          title="Trip not found"
          message="The trip you're looking for doesn't exist or has been deleted."
        />
      );
    }

    // Parse the main trip details
    const tripDetails = parseTripDetails(trip.tripDetail);
    if (!tripDetails) {
      return (
        <ErrorMessage
          title="Error loading trip"
          message="There was an error loading the trip details."
        />
      );
    }

    // Transform popular trips data, filtering out empty or invalid trips
    const transformedTrips = allTripsResult.allTrips
      .filter((trip) => trip && trip.$id && trip.tripDetail)
      .map(transformTripDocument);

    return (
      <main className="travel-detail wrapper">
        <TripDetailClient
          tripDetails={tripDetails}
          trip={trip}
          tripId={tripId}
          allTrips={transformedTrips}
        />
      </main>
    );
  } catch (err: any) {
    console.error("Error fetching trip:", err);

    // Handle specific Appwrite errors
    if (err?.code === 404) {
      return (
        <ErrorMessage
          title="Trip not found"
          message="The trip you're looking for doesn't exist or has been deleted."
        />
      );
    }

    if (err?.code === 401) {
      return (
        <ErrorMessage
          title="Access denied"
          message="You don't have permission to view this trip."
        />
      );
    }

    return (
      <ErrorMessage
        title="Something went wrong"
        message="There was an error loading the trip. Please try again later."
      />
    );
  }
}
