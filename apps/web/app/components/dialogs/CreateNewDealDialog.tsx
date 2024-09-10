"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { Button } from "@repo/ui/components/button";
import { PlusIcon, TrashIcon } from "lucide-react";

const CreateNewDealDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-green-500 text-white hover:bg-green-600">
          <PlusIcon className="mr-2 h-4 w-4" /> Create New Deal
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Deal</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewDealDialog;
