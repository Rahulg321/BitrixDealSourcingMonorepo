import { NextRequest, NextResponse } from "next/server";
import { firestore } from "../../../lib/firebase-admin";

export async function GET(request: NextRequest) {
  try {
    if (!firestore) {
      console.log("firestore is not initialized");
      return NextResponse.json(
        { error: "firestore is not initialized" },
        { status: 500 }
      );
    }

    const response = await firestore.collection("inferred-deals").get();

    const items = response.docs.map((e) => e.data());

    return NextResponse.json(
      {
        items,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    console.log("a firebase error occured", error.message);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
