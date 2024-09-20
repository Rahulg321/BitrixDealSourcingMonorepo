"use client";

import { Button } from "@repo/ui/components/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const PreviousPageButton = () => {
  const router = useRouter();

  return (
    <Button
      onClick={() => {
        router.back();
      }}
    >
      <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
    </Button>
  );
};

export default PreviousPageButton;
