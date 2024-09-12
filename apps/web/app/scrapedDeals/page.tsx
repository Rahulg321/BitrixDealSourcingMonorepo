import { getDocumentsWithLimit } from "@repo/firebase-client/db";
import React from "react";
import DealCard from "../components/DealCard";
import * as fs from "fs/promises"; // Importing fs.promises to use the async methods
import path from "path";
import { Button } from "@repo/ui/components/button";
import Link from "next/link";
import { CaseUpper, Home } from "lucide-react";

const ScrapedDealsPage = async () => {
  const deals = await getDocumentsWithLimit("deals");
  const filePath = path.join(
    process.cwd(),
    "app/scrapedDeals",
    "DealScreen.txt"
  ); // Adjust the path based on the location of your file
  let fileContent;
  fileContent = await fs.readFile(filePath, "utf-8");

  console.log("deals", deals);

  return (
    <section className="container block-space">
      <div className="flex gap-4 items-center  mb-4">
        <Button asChild variant={"default"} className="">
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        <Button asChild variant={"secondary"}>
          <Link href="/deals">
            <CaseUpper className="h-4 w-4 mr-2" />
            View Published Deals
          </Link>
        </Button>
      </div>
      <div>
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
