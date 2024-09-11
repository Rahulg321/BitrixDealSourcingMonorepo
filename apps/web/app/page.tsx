import { Button } from "@repo/ui/components/button";
import Link from "next/link";
import HeroSection from "./components/sections/hero-section";

export default async function Home() {
  // const response = await axios("http://localhost:3000/api/deal-fields");
  return <HeroSection />;
}
