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
import { DealCardProps } from "../DealCard";
import { updateDealStatus } from "../../actions";
import { useToast } from "@repo/ui/hooks/use-toast";
import { dealScreenSchema } from "../schemas";

const ScreenDealDialog = (dealProps: DealCardProps) => {
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
      return;
    }

    try {
      // Add your database save logic here
      console.log("Saving result to the database", object);
      startTransition(async () => {
        const response = await updateDealStatus(
          dealProps.id,
          object.approvalStatus as "Approved" | "Rejected",
          object.explanation as string
        );
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
    } catch (error) {
      console.error("Error saving result to the database", error);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant={"success"} className="w-full">
          <Brain className="h-4 w-4 mr-2" /> Screen Deal
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-full max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Screen Deal Against Questionnaire?</DialogTitle>
          <DialogDescription>
            This action will screen your deal against the questionnaire using
            llama3.1 AI model.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <LoaderIcon className="animate-spin h-6 w-6 text-gray-500 mr-2" />
              <span>Screening in progress...</span>
              <button
                className="ml-4 text-red-500"
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
                  <h3 className="font-semibold text-lg text-black dark:text-white">
                    Screening Results
                  </h3>
                  <div className="mt-2">
                    <div className="text-sm">
                      <span className="font-medium text-black dark:text-white">
                        Approval Status:
                      </span>{" "}
                      <span
                        className={
                          object.approvalStatus === "Approved"
                            ? "text-green-600 font-bold text-xl"
                            : "text-red-600 font-bold text-xl"
                        }
                      >
                        {object.approvalStatus}
                      </span>
                    </div>
                    <div className="text-sm mt-2">
                      <span className="font-medium text-black dark:text-white">
                        Explanation:
                      </span>{" "}
                      <p className=" font-semibold text-black dark:text-white">
                        {object.explanation}
                      </p>
                    </div>
                  </div>
                  <Button
                    className="mt-4"
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
          className="mt-6 w-full"
          onClick={() => submit(dealProps)}
          disabled={isLoading}
        >
          Screen This Deal
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ScreenDealDialog;
