import {
  collection,
  addDoc,
  updateDoc,
  getDoc,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "./init.js";
import { getDocs, query, limit } from "firebase/firestore";
import { doc, deleteDoc } from "firebase/firestore";

export async function getEntireCollection(collectionName: string) {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef);
    const querySnapshot = await getDocs(q);

    const documents: any = [];
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    return documents;
  } catch (error) {
    console.error("Error fetching documents: ", error);
    return [];
  }
}

export async function getDocumentsWithLimit(
  collectionName: string,
  limitCount = 10,
  revenueOrder: "asc" | "desc" = "desc",
  searchQuery: string = "" // Add searchQuery parameter
) {
  try {
    console.log("updated query");
    const collectionRef = collection(db, collectionName);

    let q;

    if (searchQuery) {
      // Search in title, category, revenue, and askingPrice
      q = query(
        collectionRef,
        where("title", ">=", searchQuery),
        where("title", "<=", searchQuery + "\uf8ff"), // Range query for partial matches on title
        // where("category", ">=", searchQuery), // Range query for partial matches on category
        // where("category", "<=", searchQuery + "\uf8ff"),
        // where("revenue", ">=", searchQuery), // Range query for partial matches on revenue
        // where("revenue", "<=", searchQuery + "\uf8ff"),
        // where("askingPrice", ">=", searchQuery), // Range query for partial matches on askingPrice
        // where("askingPrice", "<=", searchQuery + "\uf8ff"),
        limit(limitCount)
      );
    } else {
      // If no searchQuery, just order by revenue
      q = query(
        collectionRef,
        orderBy("revenue", revenueOrder),
        limit(limitCount)
      );
    }

    const querySnapshot = await getDocs(q);
    const documents: any = [];
    querySnapshot.forEach((doc) => {
      documents.push({
        id: doc.id,
        data: doc.data(),
      });
    });

    return documents;
  } catch (error) {
    console.error("Error fetching documents: ", error);
    return [];
  }
}

// export async function getDocumentsWithLimit(
//   collectionName: string,
//   limitCount = 10,
//   revenueOrder: "asc" | "desc" = "desc",
//   searchQuery: string = "" // Add searchQuery parameter
// ) {
//   try {
//     const collectionRef = collection(db, collectionName);

//     let q;

//     if (searchQuery) {
//       // Use `where` to filter documents based on the searchQuery
//       q = query(
//         collectionRef,
//         where("title", ">=", searchQuery), // Assuming `title` is a field in your deals collection
//         where("title", "<=", searchQuery + "\uf8ff"), // Range query for partial matches
//         orderBy("title"), // Ensure that you order by the field you are filtering by
//         orderBy("revenue", revenueOrder),
//         limit(limitCount)
//       );
//     } else {
//       // If no searchQuery, just order by revenue
//       q = query(
//         collectionRef,
//         orderBy("revenue", revenueOrder),
//         limit(limitCount)
//       );
//     }

//     const querySnapshot = await getDocs(q);
//     const documents: any = [];
//     querySnapshot.forEach((doc) => {
//       documents.push({
//         id: doc.id,
//         data: doc.data(),
//       });
//     });

//     return documents;
//   } catch (error) {
//     console.error("Error fetching documents: ", error);
//     return [];
//   }
// }

// Example usage:
// const cities = await getDocumentsWithLimit(db, "cities", 5);
// console.log(cities);

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

export const deleteDealFromDatabase = async (dealId: string) => {
  try {
    await deleteDoc(doc(db, "deals", dealId));
    console.log("Document deleted successfully!");
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw new Error(`Failed to delete the deal with ID ${dealId}`);
  }
};

export const editDealInDatabase = async (
  dealId: string,
  updatedDeal: any
): Promise<void> => {
  try {
    // Reference to the specific deal document
    const dealRef = doc(db, "deals", dealId);

    // Update the deal document with the new values
    await updateDoc(dealRef, updatedDeal);

    console.log("Deal updated successfully!");
  } catch (error: any) {
    console.error("Error updating deal: ", error);
    throw new Error(`Failed to update the deal with ID ${dealId}`);
  }
};

/**
 * Adds or updates the status of a deal in the database.
 * If the deal exists, it will update the status and explanation.
 * If the deal does not exist, it will create a new deal with the status and explanation.
 *
 * @param dealId - The ID of the deal to update, if it exists. If null, a new deal will be added.
 * @param status - The status of the deal (e.g., "Approved" or "Rejected").
 * @param explanation - The explanation for why the deal was approved or rejected.
 * @param additionalData - Optional additional data for the deal.
 */
export const updateDealStatusFirebase = async (
  dealId: string, // Must provide dealId to update the document
  status: "Approved" | "Rejected",
  explanation: string,
  additionalData: any = {}
): Promise<void> => {
  try {
    // Check if the deal exists
    const dealRef = doc(db, "deals", dealId);
    const dealDoc = await getDoc(dealRef);

    if (!dealDoc.exists()) {
      throw new Error(`Deal with ID ${dealId} not found.`);
    }

    // Deal exists, update the document with the new status, explanation, and any additional data
    await updateDoc(dealRef, {
      status,
      explanation,
      ...additionalData, // Spread any additional data if provided
    });

    console.log(`Deal with ID ${dealId} updated successfully!`);
  } catch (error) {
    console.error("Error updating deal: ", error);
    throw new Error(`Failed to update the deal with ID ${dealId}.`);
  }
};

export async function fetchSpecificDeal(dealId: string) {
  try {
    const dealRef = doc(db, "deals", dealId); // Replace "deals" with your collection name
    const dealSnapshot = await getDoc(dealRef);

    if (dealSnapshot.exists()) {
      return dealSnapshot.data(); // Returns the deal data
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching the deal:", error);
    throw error;
  }
}
