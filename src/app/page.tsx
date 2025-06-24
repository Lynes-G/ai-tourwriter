"use client";
import { useUser } from "@/providers/UserContext";

export default function HomePage() {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  return <div>Home - {user ? `Welcome ${user.name}` : "Please sign in"}</div>;
}
