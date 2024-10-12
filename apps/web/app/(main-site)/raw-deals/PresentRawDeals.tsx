"use client";

import React, { useState } from "react";

import DealCard from "../../components/DealCard";
import { Button } from "@repo/ui/components/button";
import { DataTable } from "./table-view/data-table";
import { columns, DataTableDeal } from "./table-view/columns";
import { Divide, TableProperties } from "lucide-react";
import DealPagination from "../../components/DealPagination";
import { RawDeal, SnapshotDeal } from "@repo/firebase-client/db";

const PresentRawDeals = ({
  deals,
  fileContent,
}: {
  fileContent: any;
  deals: SnapshotDeal[];
}) => {
  const [showTableView, setShowTableView] = useState(false);

  const dataTableDeals: DataTableDeal[] = deals.map((e) => {
    return {
      id: e.id,
      title: e.title,
      revenue: e.revenue,
      asking_price: e.asking_price,
      category: e.category,
      status: e.status,
      location: e.state,
      link: e.link,
    };
  });
  return (
    <div>
      <div className="mb-4">
        <Button
          onClick={() => {
            setShowTableView(!showTableView);
          }}
        >
          {showTableView ? (
            <React.Fragment>
              <TableProperties className="mr-2 h-4 w-4" /> Toggle Card View
            </React.Fragment>
          ) : (
            <React.Fragment>
              <TableProperties className="mr-2 h-4 w-4" />
              Toggle Table View
            </React.Fragment>
          )}
        </Button>
      </div>
      {!showTableView && (
        <div>
          <div></div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {deals.map((deal) => {
              return (
                <DealCard
                  key={deal.id}
                  id={deal.id}
                  title={deal.title}
                  category={deal.category}
                  under_contract={deal.under_contract}
                  revenue={deal.revenue}
                  link={deal.link}
                  asking_price={deal.asking_price}
                  listing_code={deal.listing_code}
                  main_content={deal.main_content}
                  state={deal.state}
                  fileContent={fileContent}
                  status={deal.status}
                  source={deal.source}
                  cashFlow={deal.cashFlow}
                />
              );
            })}
          </div>
        </div>
      )}
      {showTableView && <DataTable columns={columns} data={dataTableDeals} />}
    </div>
  );
};

export default PresentRawDeals;
