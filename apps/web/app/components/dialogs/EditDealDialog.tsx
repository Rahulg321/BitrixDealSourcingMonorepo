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
import { Pen } from "lucide-react";
import EditDealForm from "../forms/EditDealForm";
import { DealCardProps } from "../DealCard";

const EditDealDialog = ({
  id,
  title,
  under_contract,
  revenue,
  link,
  asking_price,
  listing_code,
  state,
  category,
}: DealCardProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant={"secondary"} size={"icon"} className="">
          <Pen className="h-4 w-4 " />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-full max-w-6xl overflow-y-auto">
        <DialogHeader></DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-4 content-center">
            <DialogTitle className="text-xl font-bold flex items-center">
              Edit Deal <Pen className="h-4 w-4 ml-2" />
            </DialogTitle>
            <DialogDescription className="text-md">
              This will edit the deal {title} within the database
            </DialogDescription>
          </div>
          <EditDealForm
            id={id}
            title={title}
            under_contract={under_contract}
            revenue={revenue}
            link={link}
            asking_price={asking_price}
            listing_code={listing_code}
            state={state}
            category={category}
            setOpenDialog={setOpenDialog}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditDealDialog;
