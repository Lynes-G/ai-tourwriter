"use client";

import { cn, formatDate } from "@/lib/utils";
import { useGetAllUsers } from "@/providers/GetAllUsers";
import {
  ColumnDirective,
  ColumnsDirective,
  GridComponent,
} from "@syncfusion/ej2-react-grids";
import React from "react";
import Header from "@/components/Header";
import Image from "next/image";

export default function AllUsersTable() {
  const { users, total, loading, error } = useGetAllUsers();

  if (loading) {
    return (
      <main className="all-users wrapper">
        <Header
          title="Manage users"
          description="Filter, sort, and access detailed user profiles"
        />
        <div className="flex items-center justify-center p-8">
          <div className="text-lg">Loading users...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="all-users wrapper">
        <Header
          title="Manage users"
          description="Filter, sort, and access detailed user profiles"
        />
        <div className="flex items-center justify-center p-8">
          <div className="text-red-500">Error loading users: {error}</div>
        </div>
      </main>
    );
  }

  const displayUsers = users.map((user, index) => ({
    id: user.$id,
    name: user.name,
    email: user.email,
    imageUrl: user.imageUrl || "images/favicon.png",
    /*  joinedAt: user.joinedAt
      ? new Date(user.joinedAt).toLocaleDateString()
      : "N/A", */
    joinedAt: user.joinedAt ? formatDate(user.joinedAt) : "N/A",
    itineraryCreated: 0, // This would need to be calculated from trips data
    status: user.status === "admin" ? "admin" : "user",
  }));

  return (
    <main className="all-users wrapper">
      <Header
        title="Manage users"
        description={`Filter, sort, and access detailed user profiles - ${total} user(s)`}
      />
      <GridComponent dataSource={displayUsers} gridLines="None">
        <ColumnsDirective>
          <ColumnDirective
            field="name"
            headerText="Name"
            textAlign="Left"
            width="200"
            template={(props: UserData) => (
              <div className="flex items-center gap-1.5 px-4">
                <Image
                  src={props.imageUrl}
                  alt={`${props.name} profile image`}
                  height={28}
                  width={28}
                  className="aspect-square size-8 rounded-full"
                />
                <span className="text-gray-800">{props.name}</span>
              </div>
            )}
          />

          <ColumnDirective
            field="joinedAt"
            headerText="Date Joined"
            width={120}
            textAlign="Left"
          />

          <ColumnDirective
            field="itineraryCreated"
            headerText="Trip Created"
            width={130}
            textAlign="Left"
          />

          <ColumnDirective
            field="email"
            headerText="Email"
            width={180}
            textAlign="Left"
          />

          <ColumnDirective
            field="status"
            headerText="Type"
            width={100}
            textAlign="Left"
            template={({ status }: UserData) => (
              <article
                className={cn(
                  "status-column",
                  status === "user" ? "bg-success-50" : "bg-light-300",
                )}
              >
                <div
                  className={cn(
                    "size-1.5 rounded-full",
                    status === "user" ? "bg-success-500" : "bg-gray-500",
                  )}
                />
                <h3
                  className={cn(
                    "text-xs font-semibold",
                    status === "user" ? "text-success-700" : "text-gray-500",
                  )}
                >
                  {status}
                </h3>
              </article>
            )}
          />
        </ColumnsDirective>
      </GridComponent>
    </main>
  );
}
