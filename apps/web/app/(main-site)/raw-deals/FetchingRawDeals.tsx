import { getDocumentsWithLimit } from "@repo/firebase-client/db";
import React from "react";
import DealCard from "../../components/DealCard";
import * as fs from "fs/promises"; // Importing fs.promises to use the async methods
import path from "path";

const FetchingRawDeals = async ({
  revenueOrder,
  searchQuery,
}: {
  revenueOrder?: "asc" | "desc";
  searchQuery?: string;
}) => {
  console.log(revenueOrder, searchQuery);

  const deals = await getDocumentsWithLimit(
    "deals",
    10,
    revenueOrder,
    searchQuery
  );
  const filePath = path.join(
    process.cwd(),
    "app/(main-site)/raw-deals",
    "DealScreen.txt"
  ); // Adjust the path based on the location of your file
  let fileContent;

  fileContent = await fs.readFile(filePath, "utf-8");

  return (
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
  );
};

export default FetchingRawDeals;
