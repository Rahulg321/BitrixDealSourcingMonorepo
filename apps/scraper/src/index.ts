import { addSampleDataToDb } from "@repo/firebase-client/db";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("running the main function");
  console.log("value of key", process.env.RESEND_API_KEY);
}

main()
  .then(() => {
    console.log("successfully added to database");
  })
  .catch((e) => console.log(e));
