import React, { Suspense } from "react";

import { Button } from "@repo/ui/components/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import FilterDealDialog from "../../components/dialogs/filter-deal-dialog";
import FetchingRawDeals from "./FetchingRawDeals";
import DealCardSkeleton from "../../components/skeletons/DealCardSkeleton";
import * as fs from "fs/promises"; // Importing fs.promises to use the async methods
import path from "path";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Raw Deals",
  description: "View the raw deals scraped from listings site",
};

const ScrapedDealsPage = async ({ searchParams }: { searchParams?: {} }) => {
  const filePath = path.join(
    process.cwd(),
    "app/(main-site)/raw-deals",
    "DealScreen.txt"
  );

  let fileContent;

  fileContent = await fs.readFile(filePath, "utf-8");

  return (
    <section className="container block-space">
      <div>
        <div className="flex gap-4 items-center">
          <FilterDealDialog />
          <Button asChild>
            <Link href={"/raw-deals/new"}>
              Add Deal <PlusIcon className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
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
          <FetchingRawDeals fileContent={fileContent} />
        </Suspense>
      </div>
    </section>
  );
};

export default ScrapedDealsPage;
