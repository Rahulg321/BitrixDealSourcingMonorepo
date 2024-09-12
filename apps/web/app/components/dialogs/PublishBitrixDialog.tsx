"use client";

import React, { useState, useTransition } from "react";
import { DealCardProps } from "../DealCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { useToast } from "@repo/ui/hooks/use-toast";
import { Send, SendIcon } from "lucide-react";
import { Button } from "@repo/ui/components/button";
import { addDealToCRM } from "../../actions/actions";

const PublishBitrixDialog = (dealProps: DealCardProps) => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="default" className="w-full">
          <Send className="h-4 w-4 mr-2" /> Publish to Bitrix
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publish this Deal?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will publish {dealProps.title} to
            bitrix.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Button
            variant={"destructive"}
            className="w-full"
            onClick={() => {
              startTransition(async () => {
                const response = await addDealToCRM(dealProps);
                if (response.type === "success") {
                  toast({
                    variant: "success",
                    title: "Successfully Added Deal 🎉",
                    description: response.message,
                  });
                  setOpenDialog(false);
                }
                if (response.type === "error") {
                  toast({
                    variant: "destructive",
                    title: "Error Occured",
                    description: response.message,
                  });
                }
              });
            }}
            disabled={isPending}
          >
            <SendIcon className="h-4 w-4 mr-2" />
            {isPending ? "Publishing...." : "Confirm Publish"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PublishBitrixDialog;
