"use client";
import {
  getExistingUser,
  checkAuthStatus,
  storeUserData,
} from "@/appwrite/auth";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  $id: string;
  name: string;
  email: string;
  imageUrl?: string;
  status?: string | boolean;
  accountId?: string;
  joinedAt?: string;
  [key: string]: any; // Allow additional properties
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchUser = async () => {
    try {
      console.log("👤 UserContext: Fetching user data...");

      // Check authentication status
      const { authenticated, user: authUser } = await checkAuthStatus();

      if (authenticated && authUser) {
        // Get user data from database
        let existingUser = await getExistingUser(authUser.$id); // If user doesn't exist in database, create them
        if (!existingUser) {
          console.log(
            "📝 UserContext: User not found in database, creating...",
          );
          try {
            existingUser = await storeUserData();
            console.log("✅ UserContext: User created successfully");
          } catch (error) {
            console.error("❌ UserContext: Failed to create user:", error);
            // Create minimal user object from auth data
            const fallbackUser = {
              $id: authUser.$id,
              name: authUser.name,
              email: authUser.email,
              accountId: authUser.$id,
              status: "user",
            };
            setUser(fallbackUser as User);
            return;
          }
        }

        setUser(existingUser as unknown as User);
        console.log(
          "✅ User data loaded:",
          existingUser?.name,
          existingUser?.email,
        );
      } else {
        setUser(null);
        console.log("ℹ️ No authenticated user found");
      }
    } catch (error) {
      console.error("❌ Error fetching user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    setLoading(true);
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

// Admin Authentication Wrapper Component
export function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useUser();
  const [authorized, setAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      if (!loading) {
        try {
          if (!user) {
            router.push("/sign-in");
            return;
          }

          // If user doesn't exist in database, create user record first
          if (!user.accountId) {
            try {
              await storeUserData();
              // Refresh the page to get updated user data
              window.location.reload();
              return;
            } catch (storeError) {
              console.error("Failed to create user in database:", storeError);
              router.push("/sign-in");
              return;
            }
          }

          // Check if user has admin status
          if (user.status !== "admin") {
            console.log(
              "User does not have admin privileges, redirecting to home",
            );
            router.push("/");
            return;
          }

          // User is authenticated and has admin privileges
          setAuthorized(true);
        } catch (err) {
          console.error("Error during authentication check:", err);
          router.push("/sign-in");
        } finally {
          setCheckingAuth(false);
        }
      }
    };

    checkAuthentication();
  }, [user, loading, router]);

  if (loading || checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!authorized) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}
