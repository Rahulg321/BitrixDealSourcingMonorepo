"use client";

import { Button } from "@repo/ui/components/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const PreviousPageButton = () => {
  const router = useRouter();

  return (
    <Button
      variant={"outline"}
      size={"icon"}
      onClick={() => {
        router.back();
      }}
    >
      <ArrowLeft className="h-4 w-4" />
    </Button>
  );
};

export default PreviousPageButton;
