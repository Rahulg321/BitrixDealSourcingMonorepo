"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import ConfirmDeleteDialog from "./dialogs/ConfirmDeleteDialog";
import EditDealDialog from "./dialogs/EditDealDialog";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  DollarSignIcon,
  EyeIcon,
  MapPinIcon,
  SendIcon,
  TrendingUpIcon,
  Wifi,
} from "lucide-react";

type DealCardProps = {
  name: string;
  industry: string;
  revenue: string;
  location: string;
  ebitda: string;
  brokerage: string;
};

const DealCard = ({
  name,
  industry,
  revenue,
  location,
  ebitda,
  brokerage,
}: DealCardProps) => {
  return (
    <Card className="relative  overflow-hidden transition-all duration-300 hover:shadow-lg">
      <ConfirmDeleteDialog />
      <EditDealDialog />
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">{name}</CardTitle>
        <Badge className="mt-1 w-fit">{industry}</Badge>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex items-center">
            <DollarSignIcon className="mr-2 h-4 w-4" />
            <span className="font-medium">Revenue:</span>
            <span className="ml-2">{revenue}</span>
          </div>
          <div className="flex items-center ">
            <MapPinIcon className="mr-2 h-4 w-4" />
            <span className="font-medium">Location:</span>
            <span className="ml-2">{location}</span>
          </div>
          <div className="flex items-center ">
            <TrendingUpIcon className="mr-2 h-4 w-4" />
            <span className="font-medium">EBITDA:</span>
            <span className="ml-2">{ebitda}</span>
          </div>
          <div className="flex items-center ">
            <Wifi className="mr-2 h-4 w-4" />
            <span className="font-medium">Brokerage:</span>
            <span className="ml-2">{brokerage}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button className="w-full">
          <SendIcon className="mr-2 h-4 w-4" /> Publish To Bitrix
        </Button>
        <Button className="w-full" variant={"secondary"}>
          <EyeIcon className="mr-2 h-4 w-4" /> View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DealCard;
