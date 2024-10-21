"use server";

import {
  addToDb,
  deleteDealFromDatabase,
  editDealInDatabase,
  updateDealStatusFirebase,
} from "../../lib/db";
import { revalidatePath } from "next/cache";
import {
  dealSchema,
  DealSchemaZodType,
} from "../components/forms/EditDealForm";
import { NewDealSchemaZodType } from "../components/forms/CreateNewDealForm";

export const addDealToFirebase = async (data: NewDealSchemaZodType) => {
  try {
    console.log("data in server is", data);
    await addToDb("deals", data);

    revalidatePath("/raw-deals");

    return {
      type: "success",
      message: "Successfully edited deal from firebase",
    };
  } catch (error) {
    console.error("an error occured adding deal to firebase", error);
    return {
      type: "error",
      message: "Could not add deal to firebase",
    };
  }
};

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

    revalidatePath("/raw-deals");
    revalidatePath(`/raw-deals/${dealId}`);

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
    console.log("dealId, status, and explanation", dealId, status, explanation);

    // Check if all required fields are provided
    if (!dealId || !status || !explanation) {
      console.log("Deal ID, status, and explanation are required");
      return {
        type: "error",
        message: "Deal ID, status, and explanation are required",
      };
    }

    await updateDealStatusFirebase(dealId, status, explanation);

    revalidatePath("/raw-deals");

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
    revalidatePath("/raw-deals");
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
