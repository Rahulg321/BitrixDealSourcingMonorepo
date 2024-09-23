import { getDocumentsWithLimit } from "@repo/firebase-client/db";
import React from "react";
import DealCard from "../../components/DealCard";
import * as fs from "fs/promises"; // Importing fs.promises to use the async methods
import path from "path";
import { Button } from "@repo/ui/components/button";
import Link from "next/link";
import { CaseUpper, Home } from "lucide-react";
import FilterDealDialog from "../../components/dialogs/filter-deal-dialog";

const ScrapedDealsPage = async () => {
  const deals = await getDocumentsWithLimit("deals");
  const filePath = path.join(
    process.cwd(),
    "app/(main-site)/raw-deals",
    "DealScreen.txt"
  ); // Adjust the path based on the location of your file
  let fileContent;

  fileContent = await fs.readFile(filePath, "utf-8");

  return (
    <section className="container block-space">
      <div>
        <FilterDealDialog />
        <h1 className="mb-4 text-center md:mb-6 lg:mb-8">Available Deals</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal: any) => {
            return (
              <DealCard
                key={deal.id}
                id={deal.id}
                title={deal.data.title}
                category={deal.data.category}
                under_contract={deal.data.under_contract}
                revenue={deal.data.revenue}
                link={deal.data.link}
                asking_price={deal.data.asking_price}
                listing_code={deal.data.listing_code}
                main_content={deal.data.main_content}
                state={deal.data.state}
                fileContent={fileContent}
                status={deal.data.status}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ScrapedDealsPage;
