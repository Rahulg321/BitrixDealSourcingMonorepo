import React from "react";

import DealCard from "../../components/DealCard";
import { SnapshotDeal } from "../../../lib/db";

const PresentRawDeals = ({
  deals,
  fileContent,
}: {
  fileContent: any;
  deals: SnapshotDeal[];
}) => {
  return (
    <div>
      <div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => {
            return (
              <DealCard key={deal.id} deal={deal} fileContent={fileContent} />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PresentRawDeals;
