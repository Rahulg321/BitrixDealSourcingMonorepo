import { fetchSpecificDeal } from "@repo/firebase-client/db";
import React from "react";
import EditDealForm from "../../../components/forms/EditDealForm";
import path from "path";
import * as fs from "fs/promises"; // Importing fs.promises to use the async methods
import PreviousPageButton from "../../../components/buttons/go-back-button";

const EditDealPage = async ({ params }: { params: { uid: string } }) => {
  const fetchedDeal = await fetchSpecificDeal(params.uid);

  if (!fetchedDeal) {
    return (
      <section className="text-center mt-10 text-xl">Deal not found</section>
    );
  }

  const {
    id,
    title,
    under_contract,
    revenue,
    link,
    asking_price,
    listing_code,
    state,
    category,
    status,
    main_content,
    explanation,
  } = fetchedDeal;

  const filePath = path.join(process.cwd(), "app/raw-deals", "DealScreen.txt"); // Adjust the path based on the location of your file
  let fileContent;

  fileContent = await fs.readFile(filePath, "utf-8");

  return (
    <section className="block-space relative">
      <div className="absolute top-6 left-8">
        <PreviousPageButton />
      </div>

      <div className="mt-2">
        <div className="narrow-container mb-8 md:mb-10 lg:mb-12">
          <h1 className="text-4xl font-bold mb-4 text-center text-gray-900">
            Edit Deal: {title}
          </h1>
          <p className="text-lg text-gray-600 text-center leading-relaxed">
            You are currently editing the details of the{" "}
            <strong>{category}</strong> deal titled <strong>{title}</strong>.
            Please ensure that all fields, such as revenue, asking price,
            location, and contract status, are updated accurately. Once you're
            done, click on <span className="font-semibold">Save Changes</span>{" "}
            to apply your updates. Be mindful that your changes will impact the
            overall visibility and status of this deal in the system.
          </p>
        </div>

        <div className="narrow-container">
          <EditDealForm
            id={params.uid}
            title={title}
            under_contract={under_contract}
            revenue={revenue}
            link={link}
            asking_price={asking_price}
            listing_code={listing_code}
            state={state}
            category={category}
            fileContent={fileContent}
            main_content={main_content ? main_content : ""}
            explanation={explanation ? explanation : ""}
          />
        </div>
      </div>
    </section>
  );
};

export default EditDealPage;
