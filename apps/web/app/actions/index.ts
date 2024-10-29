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
import {
  newDealSchema,
  NewDealSchemaZodType,
} from "../components/forms/CreateNewDealForm";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../lib/firebase";

export const addDealToFirebase = async (data: NewDealSchemaZodType) => {
  try {
    const validatedFields = newDealSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        type: "error",
        message: "Server Side Error from Zod",
      };
    }

    console.log("went to add deal to firebase......");

    const docRef = await addDoc(collection(db, "deals"), {
      ...validatedFields.data,
    });

    console.log("Document written with ID: ", docRef.id);

    return {
      type: "success",
      message: "Deal saved successfully",
      documentId: docRef.id,
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
