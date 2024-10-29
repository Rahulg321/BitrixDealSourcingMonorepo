"use server";

import { addDoc, collection } from "firebase/firestore";
import { InferDealSchema } from "../components/schemas/infer-deal-schema";
import { db } from "../../lib/firebase";

// create a sample zod schema

export default async function SaveInferredDeal({
  generation,
}: {
  generation: string;
}) {
  try {
    const parsedDeal = await JSON.parse(generation);

    const validatedFields = InferDealSchema.safeParse(parsedDeal);

    if (!validatedFields.success) {
      return {
        type: "error",
        message: `Invalid deal ${validatedFields.error.message}`,
      };
    }

    console.log("parsed deal in save inferred deal is", parsedDeal);

    console.log("saving inferred deals.....");

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
    console.log(error);
    return {
      type: "error",
      message: "Something went wrong",
    };
  }
}
