"use client";

import { logoutUser } from "@/appwrite/auth";
import { sidebarItems } from "@/constants";
import { useUser } from "@/providers/UserContext";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function NavItems({
  handleClick,
}: {
  handleClick?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUser();
  const handleLogout = async () => {
    try {
      console.log("Initiating logout...");
      await logoutUser();
      console.log("Logout successful, redirecting to sign-in...");
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still redirect to sign-in even if logout fails
      router.push("/sign-in");
    }
  };

  return (
    <section className="nav-items">
      <Link href="/" className="link-logo">
        <Image
          alt="logo"
          height={80}
          width={200}
          src="/pro-logo.svg"
          className="size-[50px]"
        />
      </Link>
      <div className="container">
        <nav>
          {sidebarItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href);

            return (
              <Link key={item.id} href={item.href} onClick={handleClick}>
                <Image
                  alt={item.label}
                  height={24}
                  width={24}
                  src={item.icon}
                  className={`size-0 group-hover:brightness-0 group-hover:invert ${isActive ? "brightness-0 invert" : "text-dark-200"}`}
                />
                <span
                  className={cn("group nav-item", {
                    "bg-primary-800 !text-white": isActive,
                  })}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>{" "}
        <footer className="nav-footer">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="size-7 animate-pulse rounded-full bg-gray-200" />
              <div className="flex flex-col gap-1">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ) : user ? (
            <>
              <Image
                alt={user?.name || "user-avatar"}
                height={40}
                width={40}
                src={user?.imageUrl || "/images/favicon.png"}
                className="size-7 rounded-full"
              />
              <article>
                <h2>{user?.name || "User"}</h2>
                <p>{user?.email || "user@example.com"}</p>
              </article>
              <button
                onClick={handleLogout}
                className="cursor-pointer transition-opacity hover:opacity-80"
                title="Logout"
              >
                <Image
                  alt="logout"
                  height={24}
                  width={24}
                  src="/icons/logout.svg"
                  className="ml-2 size-5"
                />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="size-7 animate-pulse rounded-full bg-gray-200" />
              <div className="flex flex-col gap-1">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          )}
        </footer>
      </div>
    </section>
  );
}
