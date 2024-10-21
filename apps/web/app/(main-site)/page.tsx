import { redirect } from "next/navigation";
import { auth } from "../../auth";
import HeroSection from "../components/sections/hero-section";
import React from "react";

export const metadata = {
  title: "Home",
  description:
    "Source deals, screen deals and upload them directly from this platform.",
};

export default async function Home() {
  const session = await auth();

  if (!session) {
    return redirect("/auth/login");
  }

  return (
    <React.Fragment>
      <HeroSection />
    </React.Fragment>
  );
}
