"use client";
import { loginWithGoogle, checkAuthStatus } from "@/appwrite/auth";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignIn() {
  const router = useRouter();
  useEffect(() => {
    const checkAuthStatusOnLoad = async () => {
      try {
        // Check authentication status using helper function
        const { authenticated } = await checkAuthStatus();
        if (authenticated) {
          // If user is authenticated, redirect to home
          router.push("/");
        }
      } catch (err: any) {
        // No active session found - this is expected for sign-in page
        // User should stay on sign-in page to authenticate
        console.log("No active session found - user needs to sign in");
      }
    };

    checkAuthStatusOnLoad();
  }, [router]);
  return (
    <main className="auth">
      <section className="glassmorphism flex-center size-full px-6">
        <div className="sign-in-card">
          <header className="header">
            <Link href="/">
              <Image src="/pro-logo.svg" alt="logo" width={80} height={30} />
            </Link>
          </header>
          <article className="text-center">
            <h2 className="text-dark-100 p-28-semibold">
              Your travel, Your way
            </h2>
            <p className="p-18-regular !leading-7 text-gray-600">
              Sign in with google to manage destinations, itineraries, and user
              activity with ease.{" "}
            </p>
          </article>
          <ButtonComponent
            iconCss="e-search-icon"
            className="button-class !h-11 !w-full"
            type="button"
            onClick={loginWithGoogle}
          >
            <Image
              src="/icons/google.svg"
              alt="google icon"
              width={24}
              height={24}
              className="mr-1.5 size-5"
            />
            <span className="p-18-semibold text-white">
              Sign in with Google
            </span>
          </ButtonComponent>
        </div>
      </section>
    </main>
  );
}
