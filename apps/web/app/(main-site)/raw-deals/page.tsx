import { getDocumentsWithLimit } from "@repo/firebase-client/db";
import React, { Suspense } from "react";
import DealCard from "../../components/DealCard";

import { Button } from "@repo/ui/components/button";
import Link from "next/link";
import { CaseUpper, Home, PlusCircle, PlusIcon } from "lucide-react";
import FilterDealDialog from "../../components/dialogs/filter-deal-dialog";
import FetchingRawDeals from "./FetchingRawDeals";
import DealCardSkeleton from "../../components/skeletons/DealCardSkeleton";
import * as fs from "fs/promises"; // Importing fs.promises to use the async methods
import path from "path";
import BulkUploadDealsDialog from "../../components/dialogs/BulkUploadDealsDialog";

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
          <BulkUploadDealsDialog />
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
