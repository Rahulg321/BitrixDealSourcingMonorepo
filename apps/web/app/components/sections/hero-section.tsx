import { Button } from "@repo/ui/components/button";
import { ArrowRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900">
      <div className="relative z-10 container mx-auto px-4 py-24 sm:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
            Dark Alpha Capital
            <span className="block mt-2">Deal Origination</span>
          </h1>
          <p className="mt-6 text-xl text-gray-300 dark:text-gray-200 max-w-2xl mx-auto">
            Uncover hidden opportunities and stay ahead of the market with our
            advanced deal sourcing platform. We scrape, analyze, and deliver
            high-potential deals directly to you.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="px-8 py-6 rounded-full text-white font-semibold transition-all duration-300 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              asChild
            >
              <Link href="/scrapedDeals">
                Explore Deals
                <Search className="inline-block ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              className="px-8 py-6 rounded-full text-white font-semibold transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-75 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              asChild
            >
              <Link href={"/get-started"}>
                Get Started
                <ArrowRight className="inline-block ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}