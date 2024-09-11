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
import { TrashIcon } from "lucide-react";
import { deleteDealFromFirebase } from "../../actions";
import { useToast } from "@repo/ui/hooks/use-toast";

type ConfirmDeleteDialogProps = {
  id: string;
  title: string;
  // under_contract: string;
  // revenue: string;
  // link?: string;
  // asking_price?: string;
  // listing_code?: string;
  // state?: string;
  // category: string;
};

const ConfirmDeleteDialog = ({ id, title }: ConfirmDeleteDialogProps) => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon" className="">
          <TrashIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this Deal?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete deal{" "}
            {title} from the database.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Button
            variant={"destructive"}
            className="w-full"
            onClick={() => {
              startTransition(async () => {
                const response = await deleteDealFromFirebase(id);
                if (response.type === "success") {
                  toast({
                    variant: "success",
                    title: "Successfully Deleted Deal 🎉",
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
            <TrashIcon className="h-4 w-4 mr-2" />
            {isPending ? "Deleting...." : "Confirm Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
