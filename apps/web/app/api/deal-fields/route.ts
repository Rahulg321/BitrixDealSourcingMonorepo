import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await axios.post(
      `https://darkalphacapital.bitrix24.com/rest/21/${process.env.BITRIX_SECRET_KEY}/crm.deal.fields.json`
    );

    console.log("response.data.result => ", response.data.result);

    return NextResponse.json({ result: response.data.result }, { status: 200 });
  } catch (error) {
    console.error("Error fetching CRM deal fields:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
