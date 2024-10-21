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
import { Badge } from "@repo/ui/components/badge";
import {
  Check,
  CloudHailIcon,
  CreditCard,
  Cross,
  DollarSignIcon,
  Edit,
  EyeIcon,
  Globe,
  Handshake,
  Hash,
  MapPinIcon,
  MinusCircle,
  Tag,
} from "lucide-react";
import Link from "next/link";
import ScreenDealDialog from "./dialogs/ScreenDealDialog";
import PublishBitrixDialog from "./dialogs/PublishBitrixDialog";
import { MdMoney } from "react-icons/md";
import { SnapshotDeal } from "../../lib/db";

type DealCardProps = {
  deal: SnapshotDeal;
  fileContent: string;
};

const DealCard = ({ deal, fileContent }: DealCardProps) => {
  const {
    title,
    id,
    description,
    status,
    link,
    category,
    revenue,
    source,
    under_contract,
    listing_code,
    state,
    location,
    cashFlow,
    asking_price,
    main_content,
  } = deal;

  return (
    <Card className="relative  overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          <div className="flex gap-2 flex-col">
            <ConfirmDeleteDialog id={id} title={title} />
            <Button variant="outline" size="icon" asChild>
              <Link href={`/raw-deals/${id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            {link && (
              <Button className="w-full" size={"icon"} asChild>
                <Link href={link}>
                  <Globe className=" h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
        {/* <Badge className="mt-1 w-fit">{industry}</Badge> */}
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          {status === "Approved" && (
            <div className="flex items-center gap-2">
              <Check className="mr-2 h-4 w-4" />
              <span className="font-medium">Status:</span>
              <Badge variant="outline">Approved</Badge>
            </div>
          )}
          {status === "Rejected" && (
            <div className="flex items-center gap-2">
              <Cross className="mr-2 h-4 w-4" />
              <span className="font-medium">Status:</span>
              <Badge variant="destructive">Rejected</Badge>
            </div>
          )}
          {!status && (
            <div className="flex items-center gap-2">
              <MinusCircle className="mr-2 h-4 w-4" />
              <span className="font-medium">Status:</span>
              <Badge variant="secondary">Unchecked</Badge>
            </div>
          )}
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
            <CloudHailIcon className="mr-2 h-4 w-4" />
            <span className="font-medium">Source:</span>
            <span className="ml-2">{source}</span>
          </div>
          {under_contract && (
            <div className="flex items-center">
              <Handshake className="mr-2 h-4 w-4" />
              <span className="font-medium">Under Contract:</span>
              <span className="ml-2">{under_contract}</span>
            </div>
          )}
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
              <span className="font-medium">State:</span>
              <span className="ml-2">{state}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center ">
              <MapPinIcon className="mr-2 h-4 w-4" />
              <span className="font-medium">Location:</span>
              <span className="ml-2">{location}</span>
            </div>
          )}
          {cashFlow && (
            <div className="flex items-center ">
              <MdMoney className="mr-2 h-4 w-4" />
              <span className="font-medium">Cashflow:</span>
              <span className="ml-2">{cashFlow}</span>
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
      <CardFooter className="flex flex-col gap-4">
        <PublishBitrixDialog deal={deal} />

        <Button className="w-full" variant={"outline"} asChild>
          <Link href={`/raw-deals/${id}`}>
            <EyeIcon className="mr-2 h-4 w-4" /> View Details
          </Link>
        </Button>

        <ScreenDealDialog
          dealContent={{
            title,
            under_contract,
            revenue,
            link,
            asking_price,
            listing_code,
            state,
            status,
            category,
            main_content,
            id,
          }}
          fileContent={fileContent}
        />
      </CardFooter>
    </Card>
  );
};

export default DealCard;
