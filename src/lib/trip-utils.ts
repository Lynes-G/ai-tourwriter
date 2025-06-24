// Helper function to transform raw trip document to Trip interface
export function transformTripDocument(tripDoc: any): Trip {
  let parsedDetails;
  try {
    parsedDetails = JSON.parse(tripDoc.tripDetail || "{}");
  } catch (parseError) {
    console.error("Error parsing trip details:", parseError);
    parsedDetails = {};
  }
  return {
    id: tripDoc.$id,
    name: parsedDetails.name || "Untitled Trip",
    description: parsedDetails.description || "",
    estimatedPrice: parsedDetails.estimatedPrice || "Price not available",
    duration: parsedDetails.duration || 0,
    budget: parsedDetails.budget || "",
    travelStyle: parsedDetails.travelStyle || "",
    country: parsedDetails.country || "",
    interests: parsedDetails.interests || "",
    groupType: parsedDetails.groupType || "",
    bestTimeToVisit: parsedDetails.bestTimeToVisit || [],
    weatherInfo: parsedDetails.weatherInfo || [],
    location: parsedDetails.location || {
      coordinates: [0, 0],
      googleMap: "",
      openStreetMap: "",
    },
    itinerary: parsedDetails.itinerary || [],
    imageUrls: tripDoc.imageUrls || [],
    payment_link: tripDoc.payment_link || "",
    createdAt:
      tripDoc.createdAt || tripDoc.$createdAt || new Date().toISOString(),
  };
}

// Helper function to parse trip details with error handling
export function parseTripDetails(tripDetailString: string) {
  try {
    return JSON.parse(tripDetailString);
  } catch (error) {
    console.error("Error parsing trip details:", error);
    return null;
  }
}

// Helper function to validate trip document
export function isValidTripDocument(tripDoc: any): boolean {
  return tripDoc && tripDoc.$id && tripDoc.tripDetail;
}

// Helper function to filter and transform multiple trips
export function transformTripsArray(trips: any[]): Trip[] {
  return trips.filter(isValidTripDocument).map(transformTripDocument);
}
