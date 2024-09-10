import { collection, addDoc } from "firebase/firestore";
import { db } from "./init.js";

export const addToDb = async (collectionName: string, data: any) => {
  try {
    // collectionName is dynamic, so it can be "deals" or any other collection
    const docRef = await addDoc(collection(db, collectionName), {
      ...data, // Spread the dynamic data into the document
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const addDealsToDatabase = async (deals: any[]) => {
  for (const deal of deals) {
    try {
      // Call the addToDb function for each deal
      await addToDb("deals", deal);
    } catch (e) {
      console.error("Error adding deal: ", e);
      // Optionally handle failed deal adds differently, e.g., logging or retrying
    }
  }
};
