import { cookies } from "next/headers";
import HeroSection from "../components/sections/hero-section";
import React from "react";
import { useAuth } from "../components/auth-provider";

export const metadata = {
  title: "Home",
  description:
    "Source deals, screen deals and upload them directly from this platform.",
};

export default async function Home() {
  const cookieStore = cookies();

  let token = cookieStore.get("firebaseIdToken")?.value;

  console.log("token", token);

  return (
    <React.Fragment>
      <HeroSection />
    </React.Fragment>
  );
}
