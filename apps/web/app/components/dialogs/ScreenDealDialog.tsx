"use client";

import React, { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { Button } from "@repo/ui/components/button";
import { Brain } from "lucide-react";
import { experimental_useObject as useObject } from "ai/react";
import { LoaderIcon } from "lucide-react"; // Using the LoaderIcon from Lucide for the spinner
import { updateDealStatus } from "../../actions";
import { useToast } from "@repo/ui/hooks/use-toast";
import { dealScreenSchema } from "../schemas";
import { SnapshotDeal } from "../../../lib/db";

type ScreenDealDialogProps = {
  dealContent: {
    title: string;
    under_contract?: string;
    revenue?: string;
    link?: string;
    asking_price?: string;
    listing_code?: string;
    state?: string;
    status?: "Approved" | "Rejected";
    category?: string;
    main_content?: string;
    explanation?: string;
    id: string;
  };
  fileContent: string;
};

const ScreenDealDialog = ({
  fileContent,
  dealContent,
}: ScreenDealDialogProps) => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const { object, submit, isLoading, stop } = useObject({
    api: "/api/screen-deal",
    schema: dealScreenSchema,
  });

  const saveResultToDatabase = async () => {
    if (!object || !object.approvalStatus || !object.explanation) {
      console.error("No valid data to save.");
      throw new Error("Deal Explanation is not available");
    }

    try {
      console.log("Saving result to the database", object);
      startTransition(async () => {
        const response = await updateDealStatus(
          dealContent.id,
          object.approvalStatus as "Approved" | "Rejected",
          object.explanation as string
        );

        console.log("response", response);
        if (response.type === "success") {
          toast({
            variant: "success",
            title: "Saved Status of Screening Deal 🎉",
            description: response.message,
          });
          setOpenDialog(false);
        }
        if (response.type === "error") {
          toast({
            variant: "destructive",
            title: "Could not save Deal Save Status",
            description: response.message,
          });
        }
      });
    } catch (error: any) {
      console.error("Error saving result to the database", error);
      toast({
        variant: "destructive",
        title: "Could not save Deal Save Status",
        description: `An error occured: ${error.message}`,
      });
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant={"success"} className="w-full">
          <Brain className="h-4 w-4 mr-2" /> Screen Deal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-full max-w-4xl lg:max-w-3xl md:max-w-xl sm:max-w-md sm:mx-auto sm:px-4 p-4 overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-base">
            Screen Deal Against Questionnaire?
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-xs">
            This action will screen your deal against the questionnaire using
            the latest OPENAI Model.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <LoaderIcon className="animate-spin h-6 w-6 text-gray-500 mr-2" />
              <span className="text-base sm:text-sm">
                Screening in progress...
              </span>
              <button
                className="ml-4 text-red-500 text-sm"
                type="button"
                onClick={() => stop()}
              >
                Stop
              </button>
            </div>
          ) : (
            <div>
              {object && (
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
                  <h3 className="font-semibold text-lg sm:text-base text-black dark:text-white">
                    Screening Results
                  </h3>
                  <div className="mt-2">
                    <div className="text-sm sm:text-xs">
                      <span className="font-medium text-black dark:text-white">
                        Approval Status:
                      </span>{" "}
                      <span
                        className={
                          object.approvalStatus === "Approved"
                            ? "text-green-600 font-bold text-lg"
                            : "text-red-600 font-bold text-lg"
                        }
                      >
                        {object.approvalStatus}
                      </span>
                    </div>
                    <div className="text-sm sm:text-xs mt-2">
                      <span className="font-medium text-black dark:text-white">
                        Explanation:
                      </span>{" "}
                      <p className=" font-semibold text-black dark:text-white">
                        {object.explanation}
                      </p>
                    </div>
                  </div>
                  <Button
                    className="mt-4 w-full sm:w-auto"
                    variant="success"
                    onClick={saveResultToDatabase}
                  >
                    Save Result to Database
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <Button
          className="mt-6 w-full sm:w-auto"
          onClick={() => submit({ ...dealContent, fileContent })}
          disabled={isLoading}
        >
          Screen This Deal
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ScreenDealDialog;
