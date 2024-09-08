"use client";

import { Button } from "@repo/ui/components/button";
import React, { useTransition } from "react";
import { addDeal, createCompanyIfNotExists } from "../actions";
import { IoAddCircle } from "react-icons/io5";
import { useToast } from "@repo/ui/hooks/use-toast";
import { error } from "console";

const AddCompanyButton = () => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const onClickHandler = () => {
    startTransition(async () => {
      const response = await createCompanyIfNotExists("Vercel");
      if (response.success) {
        toast({
          title: "Created Company ",
          variant: "success",
          description: response.message,
        });
      } else if (response.error) {
        toast({
          title: "ERROR",
          variant: "destructive",
          description: response.message,
        });
      }
    });
  };

  return (
    <Button onClick={onClickHandler} disabled={isPending} variant={"secondary"}>
      <IoAddCircle className="mr-2 h-4 w-4" />
      {isPending ? "Adding....." : "Add Company"}
    </Button>
  );
};

export default AddCompanyButton;
