import { getDocumentsWithLimit } from "@repo/firebase-client/db";
import React from "react";
import DealCard from "../components/DealCard";

const ScrapedDealsPage = async () => {
  const deals = await getDocumentsWithLimit("deals");

  return (
    <section className="container block-space">
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
                state={deal.data.state}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ScrapedDealsPage;
