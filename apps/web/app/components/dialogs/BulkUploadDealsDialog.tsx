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
import { PlusSquare, Upload } from "lucide-react";
import { Button } from "@repo/ui/components/button";

import { useToast } from "@repo/ui/hooks/use-toast";
import BulkImportDealsButton from "../forms/BulkImportDealsButton";

const BulkUploadDealsDialog = () => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Bulk Upload Deals
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogHeader>
            <DialogTitle>Bulk Upload Deals</DialogTitle>
            <DialogDescription>
              Bulk Upload Deals to the Database .
            </DialogDescription>
          </DialogHeader>
          <DialogDescription>
            <BulkImportDealsButton />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default BulkUploadDealsDialog;
