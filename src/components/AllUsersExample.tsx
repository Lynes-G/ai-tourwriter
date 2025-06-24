"use client";

import { AllUsersProvider, useAllUsers } from "@/providers/GetAllUsers";

// Component that uses the AllUsersProvider context
function UsersWithPagination() {
  const { users, total, loading, error, loadMoreUsers, hasMore, refreshUsers } =
    useAllUsers();

  if (loading && users.length === 0) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">All Users ({total})</h2>
        <button
          onClick={refreshUsers}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <div
            key={user.$id}
            className="flex items-center gap-4 rounded-lg border p-4"
          >
            <img
              src={user.imageUrl || "/images/david.webp"}
              alt={user.name}
              className="h-12 w-12 rounded-full"
            />
            <div className="flex-1">
              <h3 className="font-semibold">{user.name}</h3>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-500">
                Status: {user.status} | Joined:{" "}
                {user.joinedAt
                  ? new Date(user.joinedAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center">
          <button
            onClick={loadMoreUsers}
            disabled={loading}
            className="rounded bg-green-500 px-6 py-2 text-white hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More Users"}
          </button>
        </div>
      )}

      {!hasMore && users.length > 0 && (
        <div className="text-center text-gray-500">
          All users loaded ({users.length} of {total})
        </div>
      )}
    </div>
  );
}

// Example component showing how to use the AllUsersProvider
export default function AllUsersExample() {
  return (
    <AllUsersProvider>
      <div className="p-6">
        <h1 className="mb-6 text-2xl font-bold">
          Users Management with Pagination
        </h1>
        <UsersWithPagination />
      </div>
    </AllUsersProvider>
  );
}

// Export the internal component for use elsewhere
export { UsersWithPagination };
