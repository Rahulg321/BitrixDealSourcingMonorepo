import React from "react";
import CreateNewDealForm from "../../../components/forms/CreateNewDealForm";
import { Button } from "@repo/ui/components/button";
import BulkImportDealsButton from "../../../components/forms/BulkImportDealsButton";

const NewDealPage = () => {
  return (
    <section className="container block-space">
      <div className="mb-6 text-center">
        <h1>Add New Deal</h1>
        <p>
          Add a new Deal to the Database by bulk importing or adding it manually
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 bg-white shadow-lg rounded-lg border border-gray-200 h-fit">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Bulk Import Deals
          </h2>
          <p className="text-gray-600 mb-2 text-center">
            Quickly import multiple deals at once by uploading a file. Save time
            and effort with bulk import functionality.
          </p>

          <p className="text-red-600 mb-6 text-center">
            keep in mind that the excel sheet should be in a specific format for
            bulk upload
          </p>
          <div className="flex justify-center">
            <BulkImportDealsButton />
          </div>
        </div>
        <CreateNewDealForm />
      </div>
    </section>
  );
};

export default NewDealPage;
