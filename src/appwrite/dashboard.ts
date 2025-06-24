import { parseTripData } from "@/lib/utils";
import { appwriteConfig, database } from "./client";

interface Document {
  [key: string]: any;
}

type FilterByDate = (
  items: Document[],
  key: string,
  start: string,
  end?: string,
) => number;

export const getUsersAndTripsStats = async (): Promise<DashboardStats> => {
  const d = new Date();
  const startCurrentMonth = new Date(
    d.getFullYear(),
    d.getMonth(),
    1,
  ).toISOString();
  const startPrev = new Date(
    d.getFullYear(),
    d.getMonth() - 1,
    1,
  ).toISOString();
  const endPrev = new Date(d.getFullYear(), d.getMonth(), 0).toISOString();

  const [users, trips] = await Promise.all([
    database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
    ),
    database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.tripsCollectionId,
    ),
  ]);
  // Filter trips by date helper function
  const filterByDate: FilterByDate = (items, key, start, end) => {
    console.log(
      `Filtering by date - key: ${key}, start: ${start}, end: ${end}`,
    );
    console.log("Sample item:", items[0]);

    return items.filter((item) => {
      const itemDate = item[key] || item.$createdAt; // Fallback to $createdAt if field doesn't exist
      console.log(`Item date (${key}):`, itemDate);
      return itemDate >= start && (!end || itemDate <= end);
    }).length;
  }; // Filter users by role helper function
  const filterUsersByRole = (role: string) => {
    // Debug: log users to see the actual structure
    console.log("Sample user document:", users.documents[0]);
    console.log("Looking for users with status:", role);
    console.log(
      "Available user fields:",
      Object.keys(users.documents[0] || {}),
    );

    const filteredUsers = users.documents.filter((user: Document) => {
      // Try multiple possible field names for user role/status
      return (
        user.role === role || user.status === role || user.userType === role
      );
    });

    console.log(`Found ${filteredUsers.length} users with ${role} status`);
    return filteredUsers;
  };
  return {
    totalUsers: users.total,
    usersJoined: {
      currentMonth: filterByDate(
        users.documents,
        "dateJoined",
        startCurrentMonth,
      ),
      lastMonth: filterByDate(
        users.documents,
        "dateJoined",
        startPrev,
        endPrev,
      ),
    },
    userRole: {
      total: filterUsersByRole("user").length,
      currentMonth: filterByDate(
        filterUsersByRole("user"),
        "dateJoined",
        startCurrentMonth,
      ),
      lastMonth: filterByDate(
        filterUsersByRole("user"),
        "dateJoined",
        startPrev,
        endPrev,
      ),
    },
    totalTrips: trips.total,
    tripsCreated: {
      currentMonth: filterByDate(
        trips.documents,
        "createdAt",
        startCurrentMonth,
        undefined, // No end date for current month
      ),
      lastMonth: filterByDate(trips.documents, "createdAt", startPrev, endPrev),
    },
  };
};

export const getUserGrowthPerDay = async () => {
  const users = await database.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.userCollectionId,
  );

  const userGrowth = users.documents.reduce(
    (acc: { [key: string]: number }, user: Document) => {
      const date = new Date(user.joinedAt);
      const day = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    },
    {},
  );

  return Object.entries(userGrowth).map(([day, count]) => ({
    count: Number(count),
    day,
  }));
};

export const getTripsCreatedPerDay = async () => {
  const trips = await database.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.tripsCollectionId,
  );

  const tripsGrowth = trips.documents.reduce(
    (acc: { [key: string]: number }, trip: Document) => {
      const date = new Date(trip.createdAt);
      const day = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    },
    {},
  );

  return Object.entries(tripsGrowth).map(([day, count]) => ({
    count: Number(count),
    day,
  }));
};

export const getTripsByTravelStyle = async () => {
  const trips = await database.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.tripsCollectionId,
  );

  console.log(`Processing ${trips.documents.length} trips for travel style analysis`);

  const travelStyleCounts = trips.documents.reduce(
    (acc: { [key: string]: number }, trip: Document) => {
      // Fix: use 'tripDetail' (without 's') as stored in database
      const tripDetail = parseTripData(trip.tripDetail);

      if (tripDetail && tripDetail.travelStyle) {
        const travelStyle = tripDetail.travelStyle;
        console.log(`Found travel style: ${travelStyle}`);
        acc[travelStyle] = (acc[travelStyle] || 0) + 1;
      } else {
        console.log("Trip missing travel style:", {
          hasTrip: !!trip,
          hasTripDetail: !!trip.tripDetail,
          parsedDetail: tripDetail,
          travelStyle: tripDetail?.travelStyle
        });
      }
      return acc;
    },
    {},
  );

  console.log("Travel style counts:", travelStyleCounts);
  
  const result = Object.entries(travelStyleCounts).map(([travelStyle, count]) => ({
    count: Number(count),
    travelStyle,
  }));
  
  console.log("Formatted travel style data:", result);
  
  return result;
};
