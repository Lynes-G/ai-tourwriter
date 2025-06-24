"use client";

import { getAllUsers } from "@/appwrite/auth";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  $id: string;
  name: string;
  email: string;
  imageUrl?: string;
  status?: string | boolean;
  accountId?: string;
  joinedAt?: string;
  [key: string]: any;
}

interface AllUsersContextType {
  users: User[];
  total: number;
  loading: boolean;
  error: string | null;
  refreshUsers: () => Promise<void>;
  loadMoreUsers: () => Promise<void>;
  hasMore: boolean;
}

const AllUsersContext = createContext<AllUsersContextType | undefined>(
  undefined,
);

export function AllUsersProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 25; // Number of users to fetch per request

  const fetchUsers = async (offset: number = 0, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`📋 Fetching users... offset: ${offset}, limit: ${LIMIT}`);

      const result = await getAllUsers(LIMIT, offset);
      if (result) {
        const { users: newUsers, total: totalUsers } = result;

        if (append) {
          setUsers((prev) => [...prev, ...(newUsers as unknown as User[])]);
        } else {
          setUsers(newUsers as unknown as User[]);
        }

        setTotal(totalUsers);
        setCurrentOffset(offset + LIMIT);
        setHasMore(offset + LIMIT < totalUsers);

        console.log(
          `✅ Loaded ${newUsers.length} users (${offset + newUsers.length}/${totalUsers} total)`,
        );
      } else {
        setUsers([]);
        setTotal(0);
        setHasMore(false);
        console.log("ℹ️ No users found");
      }
    } catch (err) {
      console.error("❌ Error fetching users:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const refreshUsers = async () => {
    setCurrentOffset(0);
    setHasMore(true);
    await fetchUsers(0, false);
  };

  const loadMoreUsers = async () => {
    if (!hasMore || loading) return;
    await fetchUsers(currentOffset, true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <AllUsersContext.Provider
      value={{
        users,
        total,
        loading,
        error,
        refreshUsers,
        loadMoreUsers,
        hasMore,
      }}
    >
      {children}
    </AllUsersContext.Provider>
  );
}

export function useAllUsers() {
  const context = useContext(AllUsersContext);
  if (context === undefined) {
    throw new Error("useAllUsers must be used within an AllUsersProvider");
  }
  return context;
}

// Simple hook for one-time user fetching (without context)
export function useGetAllUsers(limit: number = 25, offset: number = 0) {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await getAllUsers(limit, offset);
        if (result) {
          setUsers(result.users as unknown as User[]);
          setTotal(result.total);
        } else {
          setUsers([]);
          setTotal(0);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [limit, offset]);

  return { users, total, loading, error };
}
