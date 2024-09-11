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
import { Button } from "@repo/ui/components/button";
import {
  CreditCard,
  DollarSignIcon,
  EyeIcon,
  Globe,
  Handshake,
  Hash,
  MapPinIcon,
  SendIcon,
  Tag,
} from "lucide-react";
import Link from "next/link";

export type DealCardProps = {
  id: string;
  title: string;
  under_contract: string;
  revenue: string;
  link?: string;
  asking_price?: string;
  listing_code?: string;
  state?: string;
  category: string;
};

const DealCard = ({
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
  return (
    <Card className="relative  overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <div className="flex gap-2 flex-col">
            <ConfirmDeleteDialog id={id} title={title} />
            <EditDealDialog
              id={id}
              title={title}
              under_contract={under_contract}
              revenue={revenue}
              link={link}
              asking_price={asking_price}
              listing_code={listing_code}
              state={state}
              category={category}
            />
          </div>
        </div>
        {/* <Badge className="mt-1 w-fit">{industry}</Badge> */}
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex items-start">
            <Tag className="mr-2 h-4 w-4" />
            <span className="font-medium">Category:</span>
            <span className="ml-2">{category}</span>
          </div>
          <div className="flex items-center">
            <DollarSignIcon className="mr-2 h-4 w-4" />
            <span className="font-medium">Revenue:</span>
            <span className="ml-2">{revenue}</span>
          </div>
          <div className="flex items-center">
            <Handshake className="mr-2 h-4 w-4" />
            <span className="font-medium">Under Contract:</span>
            <span className="ml-2">{under_contract}</span>
          </div>
          {listing_code && (
            <div className="flex items-center">
              <Hash className="mr-2 h-4 w-4" />
              <span className="font-medium">Listing Code:</span>
              <span className="ml-2">{listing_code}</span>
            </div>
          )}
          {state && (
            <div className="flex items-center ">
              <MapPinIcon className="mr-2 h-4 w-4" />
              <span className="font-medium">Location:</span>
              <span className="ml-2">{state}</span>
            </div>
          )}
          {asking_price && (
            <div className="flex items-center ">
              <CreditCard className="mr-2 h-4 w-4" />
              <span className="font-medium">Asking Price:</span>
              <span className="ml-2">{asking_price}</span>
            </div>
          )}
          {/* <div className="flex items-center ">
            <Wifi className="mr-2 h-4 w-4" />
            <span className="font-medium">Brokerage:</span>
            <span className="ml-2">{brokerage}</span>
          </div> */}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button className="w-full">
          <SendIcon className="mr-2 h-4 w-4" /> Publish To Bitrix
        </Button>
        <Button className="w-full" variant={"secondary"}>
          <EyeIcon className="mr-2 h-4 w-4" /> View Details
        </Button>

        {link && (
          <Button className="w-full" variant={"outline"} asChild>
            <Link href={link}>
              <Globe className="mr-2 h-4 w-4" /> Visit Site
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DealCard;
