"use client";

import {
  Header,
  StatsCard,
  TripCard,
  DataTable,
  userTableColumns,
  tripTableColumns,
} from "@/components";
import { getAllTrips } from "@/appwrite/trips";
import {
  getTripsByTravelStyle,
  getTripsCreatedPerDay,
  getUserGrowthPerDay,
  getUsersAndTripsStats,
} from "@/appwrite/dashboard";
import { transformTripDocument } from "@/lib/trip-utils";
import { useUser } from "@/providers/UserContext";
import { useEffect, useState } from "react";
import { getAllUsersWithTripCounts } from "@/appwrite/auth";
import {
  Category,
  ChartComponent,
  ColumnSeries,
  DataLabel,
  Inject,
  SeriesCollectionDirective,
  SeriesDirective,
  SplineAreaSeries,
  Tooltip,
} from "@syncfusion/ej2-react-charts";
import { tripXAxis, tripyAxis, userXAxis, useryAxis } from "@/constants";

export default function Dashboard() {
  const { user, loading: userLoading } = useUser();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null,
  );
  const [recentTrips, setRecentTrips] = useState<Trip[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<any>(null);
  const [tripsByTravelStyleData, setTripsByTravelStyleData] =
    useState<any>(null);
  const [allUsersData, setAllUsersData] = useState<any>(null);
  const [tripsCreatedPerDayData, setTripsCreatedPerDayData] =
    useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null); // Fetch dashboard stats and recent trips concurrently
        const [
          stats,
          tripsResult,
          userGrowth,
          tripsByTravelStyle,
          allUsers,
          tripsCreatedPerDay,
        ] = await Promise.all([
          getUsersAndTripsStats(),
          getAllTrips(4, 0).catch(() => ({ allTrips: [], total: 0 })),
          getUserGrowthPerDay(),
          getTripsByTravelStyle(),
          getAllUsersWithTripCounts(4, 0),
          getTripsCreatedPerDay(),
        ]);

        setDashboardStats(stats);

        // Transform and set recent trips
        const transformedTrips = tripsResult.allTrips
          .filter((trip) => trip && trip.$id && trip.tripDetail)
          .map(transformTripDocument);
        setRecentTrips(transformedTrips);

        // Store other data for potential future use
        setUserGrowthData(userGrowth);
        setTripsByTravelStyleData(tripsByTravelStyle);
        setAllUsersData(allUsers);
        setTripsCreatedPerDayData(tripsCreatedPerDay);

        // Log data for debugging
        console.log("User growth data:", userGrowth);
        console.log("Trips by travel style:", tripsByTravelStyle);
        console.log("All users:", allUsers);
        console.log("Trips created per day:", tripsCreatedPerDay);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []); // Format users data for the table
  const formattedUsers =
    allUsersData?.users?.map((user: any) => ({
      id: user.$id,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl || "/images/favicon.png",
      joinedAt: user.joinedAt,
      status: user.status === "admin" ? "admin" : "user",
      tripsCreated: user.tripsCreated || 0,
    })) || [];

  // Format trips data for the table
  const formattedTrips =
    recentTrips?.map((trip: any) => ({
      id: trip.id,
      name: trip.name,
      country: trip.country,
      travelStyle: trip.travelStyle,
      interests: trip.interests,
      imageUrl: trip.imageUrls?.[0] || "/images/sample.jpeg",
      createdAt: trip.createdAt,
    })) || [];
  return (
    <main className="dashboard wrapper">
      <Header
        title={
          userLoading ? "Loading..." : `Welcome ${user?.name || "Guest"} 👋`
        }
        description="Track activity, trends and popular destinations in real time"
      />

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-lg text-gray-600">Loading dashboard...</div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <h2 className="mb-2 text-xl font-semibold text-red-600">
              Error Loading Dashboard
            </h2>
            <p className="mb-4 text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 hover:bg-primary-700 rounded-lg px-4 py-2 text-white transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      ) : dashboardStats ? (
        <>
          <section className="flex flex-col gap-6">
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-3">
              <StatsCard
                headerTitle="Total Users"
                total={dashboardStats.totalUsers}
                currentMonthCount={dashboardStats.usersJoined.currentMonth}
                lastMonthCount={dashboardStats.usersJoined.lastMonth}
              />
              <StatsCard
                headerTitle="Total Trips"
                total={dashboardStats.totalTrips}
                currentMonthCount={dashboardStats.tripsCreated.currentMonth}
                lastMonthCount={dashboardStats.tripsCreated.lastMonth}
              />
              <StatsCard
                headerTitle="Active Users"
                total={dashboardStats.userRole.total}
                currentMonthCount={dashboardStats.userRole.currentMonth}
                lastMonthCount={dashboardStats.userRole.lastMonth}
              />
            </div>
          </section>
          <section className="container">
            <h1 className="text-dark-100 text-xl font-semibold">
              Recent Trips
            </h1>
            {recentTrips.length > 0 ? (
              <div className="trip-grid">
                {recentTrips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    id={trip.id}
                    name={trip.name}
                    imageUrl={trip.imageUrls?.[0] ?? ""}
                    location={
                      trip.itinerary?.[0]?.location ?? trip.country ?? "Unknown"
                    }
                    tags={[trip.interests, trip.travelStyle].filter(Boolean)}
                    price={trip.estimatedPrice}
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-gray-500">No trips available</p>
              </div>
            )}
          </section>
          <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <ChartComponent
              id="chart-1"
              primaryXAxis={userXAxis}
              primaryYAxis={useryAxis}
              tooltip={{ enable: true }}
              title="User Growth Trends"
            >
              <Inject
                services={[
                  ColumnSeries,
                  SplineAreaSeries,
                  Category,
                  DataLabel,
                  Tooltip,
                ]}
              />
              <SeriesCollectionDirective>
                <SeriesDirective
                  dataSource={userGrowthData}
                  xName="day"
                  yName="count"
                  type="Column"
                  name="Column"
                  columnWidth={0.3}
                  cornerRadius={{ topLeft: 10, topRight: 10 }}
                  fill="oklch(43.564% 0.21621 293.716)"
                />

                <SeriesDirective
                  dataSource={userGrowthData}
                  xName="day"
                  yName="count"
                  type="SplineArea"
                  name="Wave"
                  fill="oklch(59.965% 0.22069 31.727 / 0.3)"
                  border={{ width: 2, color: "oklch(59.965% 0.22069 31.727)" }}
                />
              </SeriesCollectionDirective>
            </ChartComponent>
            <ChartComponent
              id="chart-2"
              primaryXAxis={tripXAxis}
              primaryYAxis={tripyAxis}
              title="Trip Trends"
              tooltip={{ enable: true }}
            >
              <Inject
                services={[
                  ColumnSeries,
                  SplineAreaSeries,
                  Category,
                  DataLabel,
                  Tooltip,
                ]}
              />
              <SeriesCollectionDirective>
                <SeriesDirective
                  dataSource={tripsByTravelStyleData}
                  xName="travelStyle"
                  yName="count"
                  type="Column"
                  name="day"
                  columnWidth={0.3}
                  cornerRadius={{ topLeft: 10, topRight: 10 }}
                  fill="oklch(43.564% 0.21621 293.716)"
                />
              </SeriesCollectionDirective>
            </ChartComponent>{" "}
          </section>{" "}
          <section className="user-trip wrapper grid grid-cols-1 gap-6 lg:grid-cols-2">
            <DataTable
              title="Latest Users"
              dataSource={formattedUsers.slice(0, 5)}
              columns={userTableColumns}
              loading={loading}
              error={error}
            />
            <DataTable
              title="Recent Trips"
              dataSource={formattedTrips.slice(0, 5)}
              columns={tripTableColumns}
              loading={loading}
              error={error}
            />
          </section>
        </>
      ) : null}
    </main>
  );
}
