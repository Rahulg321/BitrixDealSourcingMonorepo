"use client";

import {
  fetchDocumentsWithPagination,
  RawDeal,
  SnapshotDeal,
} from "@repo/firebase-client/db";
import React, { useEffect, useState } from "react";
import PresentRawDeals from "./PresentRawDeals";
import { Button } from "@repo/ui/components/button";

const FetchingRawDeals = ({ fileContent }: { fileContent: any }) => {
  const [data, setData] = useState<SnapshotDeal[]>([]);
  const [page, setPage] = useState(1);
  const [isNextAvailable, setIsNextAvailable] = useState(false);
  const [isPreviousAvailable, setIsPreviousAvailable] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const documents = await fetchDocumentsWithPagination("deals", 3);
      console.log("fetchedDeals", documents);
      setData(documents);
      setIsNextAvailable(documents.length >= 3);
    };
    fetchData();
  }, []);

  const showNext = async (item: SnapshotDeal) => {
    if (data.length === 0) {
      alert("No more deals to show");
    } else {
      const nextItems = await fetchDocumentsWithPagination(
        "deals",
        3,
        "next",
        item
      );
      if (nextItems.length > 0) {
        setData(nextItems);
        setPage(page + 1);
        setIsPreviousAvailable(true);
        setIsNextAvailable(nextItems.length >= 3);
      }
    }
  };

  const showPrevious = async (item: SnapshotDeal) => {
    const previousItems = await fetchDocumentsWithPagination(
      "deals",
      3,
      "previous",
      item
    );
    if (previousItems.length > 0) {
      setData(previousItems);
      setPage(page - 1);
      setIsNextAvailable(true); // Enable Next button
      setIsPreviousAvailable(page > 2); // Enable Previous button only if page > 2
    }
  };

  return (
    <div>
      {/* Display the deals */}
      <PresentRawDeals fileContent={fileContent} deals={data} />

      {/* Pagination controls */}
      <div className="space-x-2 justify-end mt-4 w-full">
        <Button
          onClick={() => {
            showPrevious(data[0] as SnapshotDeal);
          }}
          disabled={!isPreviousAvailable}
        >
          Previous
        </Button>

        <Button
          onClick={() => {
            showNext(data[data.length - 1] as SnapshotDeal);
          }}
          disabled={!isNextAvailable}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default FetchingRawDeals;
