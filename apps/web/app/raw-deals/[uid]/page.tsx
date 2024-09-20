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
  Divide,
  Mail,
  Edit,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import ScreenDealDialog from "../../components/dialogs/ScreenDealDialog";
import path from "path";
import * as fs from "fs/promises"; // Importing fs.promises to use the async methods

const DealSpecificPage = async ({ params }: { params: { uid: string } }) => {
  const fetchedDeal = await fetchSpecificDeal(params.uid);

  if (!fetchedDeal) {
    return (
      <section className="text-center mt-10 text-xl">Deal not found</section>
    );
  }

  const filePath = path.join(process.cwd(), "app/raw-deals", "DealScreen.txt"); // Adjust the path based on the location of your file
  let fileContent;

  fileContent = await fs.readFile(filePath, "utf-8");

  const {
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
    explanation,
  } = fetchedDeal;

  return (
    <section className="py-4">
      <div className="flex gap-2 container py-4">
        <Button asChild>
          <Link href={`/raw-deals/${params.uid}/edit`}>
            {" "}
            <Edit className="mr-2 h-4 w-4" /> Edit Deal
          </Link>
        </Button>
        <Button asChild variant={"outline"}>
          <Link href={link}>
            {" "}
            <ExternalLink className="mr-2 h-4 w-4" />
            Visit Website
          </Link>
        </Button>
      </div>
      <div className="narrow-container mb-8 md:mb-10 lg:mb-12 ">
        <h1 className="text-4xl font-bold mb-4 text-center text-gray-900">
          Deal Overview: {title}
        </h1>
        <p className="text-lg text-gray-600 text-center leading-relaxed text-pretty">
          You are viewing detailed information about the {category} deal titled{" "}
          <strong>{title}</strong>. This deal is currently{" "}
          <span className="font-semibold">{status || "unchecked"}</span>. Below,
          you will find key details such as the deal's revenue, asking price,
          location, and other relevant metrics. Use this information to make an
          informed decision, and feel free to screen the deal with our AI tool
          to get further insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 container">
        <Card className="relative overflow-hidden  bg-muted transition-all duration-300 hover:shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold">{title}</CardTitle>
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
            <h3 className="my-4 underline">Deal Teaser</h3>
            <p className="whitespace-pre-wrap">{main_content}</p>
          </CardContent>

          <CardFooter className="flex flex-col gap-4"></CardFooter>
        </Card>
        <Card className="relative  bg-muted overflow-hidden transition-all duration-300 hover:shadow-lg h-fit">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-gray-900">
              AI Reasoning
            </CardTitle>
          </CardHeader>

          <CardContent className="pb-2">
            <div className="mt-4 whitespace-pre-wrap">
              {explanation ? (
                <div>{explanation}</div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M19 12a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-600">
                    No explanation available at the moment.
                  </h3>
                  <span className=" text-gray-500">
                    You can provide additional details or review the deal for
                    further information.
                  </span>
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <ScreenDealDialog
              id={params.uid}
              title={title}
              under_contract={under_contract}
              revenue={revenue}
              link={link}
              asking_price={asking_price}
              listing_code={listing_code}
              state={state}
              category={category}
              fileContent={fileContent}
              main_content={main_content}
            />
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};

export default DealSpecificPage;
