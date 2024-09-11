"use client";

import React, { useState } from "react";
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
import { dealScreenSchema } from "../../api/screen-deal/route";

const ScreenDealDialog = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const { object, submit, isLoading, stop } = useObject({
    api: "/api/screen-deal",
    schema: dealScreenSchema,
  });
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant={"success"} className="w-full">
          <Brain className="h-4 w-4 mr-2" /> Screen Deal
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Screen Deal Against Questionaaire?</DialogTitle>
          <DialogDescription>
            This action will screen your deal against the questionaire using
            llama3.1.
          </DialogDescription>
        </DialogHeader>

        <div>
          <Button
            onClick={() => submit("Messages during finals week.")}
            disabled={isLoading}
          >
            Screen This Deal
          </Button>

          {isLoading && (
            <div>
              <div>Loading...</div>
              <button type="button" onClick={() => stop()}>
                Stop
              </button>
            </div>
          )}
          <div>
            {object?.approvalStatus}
            {object?.explanation}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScreenDealDialog;
