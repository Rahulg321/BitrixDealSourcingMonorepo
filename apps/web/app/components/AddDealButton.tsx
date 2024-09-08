"use client";

import { Button } from "@repo/ui/components/button";
import React, { useTransition } from "react";
import { addDeal } from "../actions";
import { IoAddCircle } from "react-icons/io5";
import { useToast } from "@repo/ui/hooks/use-toast";
import { error } from "console";

const AddDealButton = () => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const onClickHandler = () => {
    startTransition(async () => {
      const response = await addDeal(
        "Vercel",
        "Jaime Lannister",
        "jaime@westores.org",
        "9876543210"
      );
      if (response.success) {
        toast({
          title: "Scheduled: Catch up",
          variant: "success",
          description: response.success,
        });
      } else if (response.error) {
        toast({
          title: "ERROR",
          variant: "destructive",
          description: response.error,
        });
      }
    });
  };

  return (
    <Button onClick={onClickHandler} disabled={isPending}>
      <IoAddCircle className="mr-2 h-4 w-4" />
      {isPending ? "Adding....." : "Add Deal"}
    </Button>
  );
};

export default AddDealButton;
