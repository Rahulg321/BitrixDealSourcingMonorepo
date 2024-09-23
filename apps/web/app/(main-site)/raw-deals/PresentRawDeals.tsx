"use client";

import React, { useState } from "react";

import DealCard from "../../components/DealCard";
import { Button } from "@repo/ui/components/button";
import { DataTable } from "./table-view/data-table";
import { columns, DataTableDeal } from "./table-view/columns";
import { Divide, TableProperties } from "lucide-react";

const PresentRawDeals = ({
  deals,
  fileContent,
}: {
  fileContent: any;
  deals: any;
}) => {
  const [showTableView, setShowTableView] = useState(false);
  console.log("deals", deals);
  const dataTableDeals: DataTableDeal[] = deals.map((e: any) => {
    return {
      id: e.id,
      title: e.data.title,
      revenue: e.data.revenue,
      asking_price: e.data.asking_price,
      category: e.data.category,
      status: e.data.status,
      location: e.data.state,
      link: e.data.link,
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
      )}
      {showTableView && <DataTable columns={columns} data={dataTableDeals} />}
    </div>
  );
};

export default PresentRawDeals;
