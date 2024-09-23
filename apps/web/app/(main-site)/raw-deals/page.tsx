import { getDocumentsWithLimit } from "@repo/firebase-client/db";
import React, { Suspense } from "react";
import DealCard from "../../components/DealCard";

import { Button } from "@repo/ui/components/button";
import Link from "next/link";
import { CaseUpper, Home } from "lucide-react";
import FilterDealDialog from "../../components/dialogs/filter-deal-dialog";
import FetchingRawDeals from "./FetchingRawDeals";
import DealCardSkeleton from "../../components/skeletons/DealCardSkeleton";

const ScrapedDealsPage = async ({
  searchParams,
}: {
  searchParams?: {
    revenueOrder?: "asc" | "desc" | undefined;
    query?: string;
    dateOrder?: string;
    page?: string;
  };
}) => {
  const query = searchParams?.query || "";
  const revenueOrder = searchParams?.revenueOrder || "asc";
  const dateOrder = searchParams?.dateOrder || "asc";
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <section className="container block-space">
      <div>
        <FilterDealDialog />
        <h1 className="mb-4 text-center md:mb-6 lg:mb-8">Available Deals</h1>
        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <DealCardSkeleton />
              <DealCardSkeleton />
              <DealCardSkeleton />
              <DealCardSkeleton />
              <DealCardSkeleton />
              <DealCardSkeleton />
            </div>
          }
        >
          <FetchingRawDeals revenueOrder={revenueOrder} searchQuery={query} />
        </Suspense>
      </div>
    </section>
  );
};

export default ScrapedDealsPage;
