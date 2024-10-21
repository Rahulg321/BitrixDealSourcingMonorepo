import React from "react";
import { fetchSpecificDeal } from "../../../../lib/db";
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
  Handshake,
  Hash,
  MapPinIcon,
  MinusCircle,
  Tag,
  Edit,
  ExternalLink,
  WebhookIcon,
} from "lucide-react";
import Link from "next/link";
import ScreenDealDialog from "../../../components/dialogs/ScreenDealDialog";
import path from "path";
import * as fs from "fs/promises"; // Importing fs.promises to use the async methods
import PublishBitrixDialog from "../../../components/dialogs/PublishBitrixDialog";
import PreviousPageButton from "../../../components/buttons/go-back-button";
import { Metadata } from "next";
import { MdOutlineNumbers } from "react-icons/md";

export async function generateMetadata({
  params,
}: {
  params: { uid: string };
}): Promise<Metadata> {
  try {
    const fetchedDeal = await fetchSpecificDeal(params.uid);
    return {
      title: fetchedDeal?.title || "Dark Alpha Capital",
      description: fetchedDeal?.main_content || "Generated by create next app",
    };
  } catch (error) {
    return {
      title: "Not Found",
      description: "The page you are looking for does not exist",
    };
  }
}

const DealSpecificPage = async ({ params }: { params: { uid: string } }) => {
  const fetchedDeal = await fetchSpecificDeal(params.uid);

  if (!fetchedDeal) {
    return (
      <section className="text-center mt-10 text-xl">Deal not found</section>
    );
  }

  const filePath = path.join(
    process.cwd(),
    "app/(main-site)/raw-deals",
    "DealScreen.txt"
  );
  let fileContent;

  fileContent = await fs.readFile(filePath, "utf-8");

  const {
    id,
    first_name,
    last_name,
    direct_phone,
    work_phone,
    title,
    cashFlow,
    under_contract,
    revenue,
    source,
    ebitda,
    link,
    scraped_by,
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
      <div className="container py-4 mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Previous Page Button */}
          <div className="w-full md:w-auto">
            <PreviousPageButton />
          </div>

          {/* Actions: Edit, Visit Website, Publish */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full md:w-auto">
            <Button asChild className="w-full md:w-auto">
              <Link href={`/raw-deals/${params.uid}/edit`}>
                <Edit className="mr-2 h-4 w-4" /> Edit Deal
              </Link>
            </Button>

            {link && (
              <Button asChild variant="outline" className="w-full md:w-auto">
                <Link href={link}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit Website
                </Link>
              </Button>
            )}

            <PublishBitrixDialog
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
          </div>
        </div>
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
                  <div>
                    <Check className="mr-2 h-5 w-5 text-green-500" />
                    <Badge variant="outline">Approved</Badge>
                  </div>
                ) : status === "Rejected" ? (
                  <div>
                    <Cross className="mr-2 h-5 w-5 text-red-500" />
                    <Badge variant="destructive">Rejected</Badge>
                  </div>
                ) : (
                  <div>
                    <MinusCircle className="mr-2 h-5 w-5" />
                    <Badge variant="secondary">Unchecked</Badge>
                  </div>
                )}
              </div>

              {id && (
                <div className="flex items-center gap-2">
                  <MdOutlineNumbers className="mr-2 h-5 w-5" />
                  <span className="font-medium">Deal ID:</span>
                  <span className="ml-2">{id}</span>
                </div>
              )}

              {first_name && (
                <div className="flex items-center gap-2">
                  <Tag className="mr-2 h-5 w-5" />
                  <span className="font-medium">First Name:</span>
                  <span className="ml-2">{first_name}</span>
                </div>
              )}

              {last_name && (
                <div className="flex items-center gap-2">
                  <Tag className="mr-2 h-5 w-5" />
                  <span className="font-medium">Last Name:</span>
                  <span className="ml-2">{last_name}</span>
                </div>
              )}

              {direct_phone && (
                <div className="flex items-center gap-2">
                  <Tag className="mr-2 h-5 w-5" />
                  <span className="font-medium">Direct Phone:</span>
                  <span className="ml-2">{direct_phone}</span>
                </div>
              )}

              {work_phone && (
                <div className="flex items-center gap-2">
                  <Tag className="mr-2 h-5 w-5" />
                  <span className="font-medium">Work Phone:</span>
                  <span className="ml-2">{work_phone}</span>
                </div>
              )}

              {cashFlow && (
                <div className="flex items-center gap-2">
                  <Tag className="mr-2 h-5 w-5" />
                  <span className="font-medium">Cash Flow:</span>
                  <span className="ml-2">{cashFlow}</span>
                </div>
              )}

              {ebitda && (
                <div className="flex items-center gap-2">
                  <Tag className="mr-2 h-5 w-5" />
                  <span className="font-medium">Ebitda:</span>
                  <span className="ml-2">{ebitda}</span>
                </div>
              )}

              {category && (
                <div className="flex items-center gap-2">
                  <Tag className="mr-2 h-5 w-5" />
                  <span className="font-medium">Category:</span>
                  <span className="ml-2">{category}</span>
                </div>
              )}

              {source && (
                <div className="flex items-center gap-2">
                  <WebhookIcon className="mr-2 h-5 w-5" />
                  <span className="font-medium">Source:</span>
                  <span className="ml-2">{source}</span>
                </div>
              )}

              {revenue && (
                <div className="flex items-center gap-2">
                  <DollarSignIcon className="mr-2 h-5 w-5" />
                  <span className="font-medium">Revenue:</span>
                  <span className="ml-2">{revenue}</span>
                </div>
              )}

              {under_contract && (
                <div className="flex items-center gap-2">
                  <Handshake className="mr-2 h-5 w-5" />
                  <span className="font-medium">Under Contract:</span>
                  <span className="ml-2">{under_contract}</span>
                </div>
              )}

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

              {scraped_by && (
                <div className="flex items-center gap-2">
                  <CreditCard className="mr-2 h-5 w-5" />
                  <span className="font-medium">Scraped By:</span>
                  <span className="ml-2">{scraped_by}</span>
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
                explanation,
                id,
              }}
              fileContent={fileContent}
            />
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};

export default DealSpecificPage;
