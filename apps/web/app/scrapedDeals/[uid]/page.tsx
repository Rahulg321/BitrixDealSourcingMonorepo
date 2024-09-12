import React from "react";
import { fetchSpecificDeal } from "@repo/firebase-client/db";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Check,
  CreditCard,
  Cross,
  DollarSignIcon,
  Globe,
  Handshake,
  Hash,
  MapPinIcon,
  MinusCircle,
  Tag,
  EyeIcon,
  Home,
  CaseUpper,
} from "lucide-react";
import Link from "next/link";
import EditDealDialog from "../../components/dialogs/EditDealDialog";

const DealSpecificPage = async ({ params }: { params: { uid: string } }) => {
  const fetchedDeal = await fetchSpecificDeal(params.uid);

  if (!fetchedDeal) {
    return <div className="text-center mt-10 text-xl">Deal not found</div>;
  }

  const {
    id,
    title,
    under_contract,
    revenue,
    link,
    asking_price,
    listing_code,
    state,
    category,
    status,
    main_content,
  } = fetchedDeal;

  return (
    <section className="container mx-auto px-4 mt-10">
      <div className="flex gap-4 items-center  mb-4">
        <Button asChild variant={"default"} className="">
          <Link href="/">
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        <Button asChild variant={"secondary"}>
          <Link href="/scrapedDeals">
            <CaseUpper className="h-4 w-4 mr-2" />
            View Scraped Deals
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-4">View Deal</h1>

      <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
            <div className="flex gap-2">
              {link && (
                <Button className="" variant={"outline"} size={"icon"} asChild>
                  <Link href={link}>
                    <Globe className="h-4 w-4" />
                  </Link>
                </Button>
              )}
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
                main_content={main_content}
                fileContent={"helloworld"}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-2">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {status === "Approved" ? (
                <>
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <Badge variant="outline">Approved</Badge>
                </>
              ) : status === "Rejected" ? (
                <>
                  <Cross className="mr-2 h-5 w-5 text-red-500" />
                  <Badge variant="destructive">Rejected</Badge>
                </>
              ) : (
                <>
                  <MinusCircle className="mr-2 h-5 w-5" />
                  <Badge variant="secondary">Unchecked</Badge>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Tag className="mr-2 h-5 w-5" />
              <span className="font-medium">Category:</span>
              <span className="ml-2">{category}</span>
            </div>

            <div className="flex items-center gap-2">
              <DollarSignIcon className="mr-2 h-5 w-5" />
              <span className="font-medium">Revenue:</span>
              <span className="ml-2">{revenue}</span>
            </div>

            <div className="flex items-center gap-2">
              <Handshake className="mr-2 h-5 w-5" />
              <span className="font-medium">Under Contract:</span>
              <span className="ml-2">{under_contract}</span>
            </div>

            {listing_code && (
              <div className="flex items-center gap-2">
                <Hash className="mr-2 h-5 w-5" />
                <span className="font-medium">Listing Code:</span>
                <span className="ml-2">{listing_code}</span>
              </div>
            )}

            {state && (
              <div className="flex items-center gap-2">
                <MapPinIcon className="mr-2 h-5 w-5" />
                <span className="font-medium">Location:</span>
                <span className="ml-2">{state}</span>
              </div>
            )}

            {asking_price && (
              <div className="flex items-center gap-2">
                <CreditCard className="mr-2 h-5 w-5" />
                <span className="font-medium">Asking Price:</span>
                <span className="ml-2">{asking_price}</span>
              </div>
            )}
          </div>
          <p className="mt-4 text-sm whitespace-pre-wrap">{main_content}</p>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" variant={"outline"} asChild>
            <Link href={`/deals/${id}`}>
              <EyeIcon className="mr-2 h-5 w-5" /> View Full Deal
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
};

export default DealSpecificPage;
