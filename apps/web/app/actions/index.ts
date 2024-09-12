"use server";

import {
  deleteDealFromDatabase,
  editDealInDatabase,
  updateDealStatusFirebase,
} from "@repo/firebase-client/db";
import { revalidatePath } from "next/cache";
import {
  dealSchema,
  DealSchemaZodType,
} from "../components/forms/EditDealForm";

export const editDealFromFirebase = async (
  dealId: string,
  data: DealSchemaZodType
) => {
  if (!dealId) {
    return {
      type: "error",
      message: "Deal ID is required",
    };
  }

  if (!data) {
    return {
      type: "error",
      message: "Data is required",
    };
  }

  // const validatedFields = dealSchema.safeParse(data);
  // if (!validatedFields.success) {
  //   return {
  //     type: "error",
  //     message: validatedFields.error.message,
  //   };
  // }

  try {
    await editDealInDatabase(dealId, data);
    revalidatePath("/scrapedDeals");
    return {
      type: "success",
      message: "Successfully edited deal from firebase",
    };
  } catch (error) {
    console.error("an error occured", error);
    return {
      type: "error",
      message: "Could not edit deal from firebase",
    };
  }
};

export const updateDealStatus = async (
  dealId: string,
  status: "Approved" | "Rejected",
  explanation: string
) => {
  try {
    if (!dealId || !status || !explanation) {
      return {
        type: "error",
        message: "Deal ID, status, and explanation are required",
      };
    }

    await updateDealStatusFirebase(dealId, status, explanation);
    revalidatePath("/scrapedDeals");
    return {
      type: "success",
      message: "Successfully deleted deal from firebase",
    };
  } catch (error) {
    console.error("an error occured", error);
    return {
      type: "error",
      message: "Could not delete deal from firebase",
    };
  }
};

export const deleteDealFromFirebase = async (dealId: string) => {
  if (!dealId) {
    return {
      type: "error",
      message: "Deal ID is required",
    };
  }

  try {
    await deleteDealFromDatabase(dealId);
    revalidatePath("/scrapedDeals");
    return {
      type: "success",
      message: "Successfully deleted deal from firebase",
    };
  } catch (error) {
    console.error("an error occured", error);
    return {
      type: "error",
      message: "Could not delete deal from firebase",
    };
  }
};
