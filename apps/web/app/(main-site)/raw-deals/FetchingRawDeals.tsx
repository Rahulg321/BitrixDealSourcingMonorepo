import { getDocumentsWithLimit } from "@repo/firebase-client/db";
import React from "react";
import DealCard from "../../components/DealCard";
import * as fs from "fs/promises"; // Importing fs.promises to use the async methods
import path from "path";
import PresentRawDeals from "./PresentRawDeals";

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
    <div>
      <PresentRawDeals fileContent={fileContent} deals={deals} />
    </div>
  );
};

export default FetchingRawDeals;
