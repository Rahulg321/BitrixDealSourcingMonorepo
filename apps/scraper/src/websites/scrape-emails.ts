// import * as fs from "fs/promises"; // Use fs/promises for promise-based file operations
// import path from "path";
// import process from "process";
// import { OAuth2Client } from "google-auth-library";
// import { google } from "googleapis";
// import { authenticate } from "@google-cloud/local-auth";
// import { Base64 } from "js-base64"; // npm install js-base64
// import { extractDealFromScrapedEmail } from "./ai/index.js";

// If modifying these scopes, delete token.json.
// const SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
// const TOKEN_PATH = path.join(process.cwd(), "token.json");
// const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
// async function loadSavedCredentialsIfExist() {
//   try {
//     // Read the token file using the promise-based fs module
//     const content = await fs.readFile(TOKEN_PATH, "utf-8"); // Make sure to specify the encoding to get a string
//     const credentials = JSON.parse(content);

//     // Create OAuth2Client from the credentials
//     return google.auth.fromJSON(credentials);
//   } catch (err) {
//     console.error("Error loading saved credentials:", err);
//     return null; // Return null if there's any error (e.g., file not found)
//   }
// }

/**
 * Serializes credentials to a file compatible with GoogleAuth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
// async function saveCredentials(client: any) {
//   const content = await fs.readFile(CREDENTIALS_PATH, "utf-8");
//   const keys = JSON.parse(content);
//   const key = keys.installed || keys.web;
//   const payload = JSON.stringify({
//     type: "authorized_user",
//     client_id: key.client_id,
//     client_secret: key.client_secret,
//     refresh_token: client.credentials.refresh_token,
//   });

//   await fs.writeFile(TOKEN_PATH, payload);
// }

/**
 * Load or request or authorization to call APIs.
 *
 */
// async function authorize() {
//   let client = null;
//   client = await loadSavedCredentialsIfExist();

//   if (client) {
//     return client;
//   }

//   client = await authenticate({
//     scopes: SCOPES,
//     keyfilePath: CREDENTIALS_PATH,
//   });

//   if (client.credentials) {
//     await saveCredentials(client);
//   }
//   return client;
// }

// async function listEmails(auth: OAuth2Client) {
//   const gmail = google.gmail({ version: "v1", auth });
//   const res = await gmail.users.messages.list({
//     userId: "me",
//     maxResults: 10,
//     labelIds: ["INBOX"],
//   });

//   const messages = res.data.messages;

//   if (!messages || messages.length === 0) {
//     console.log("No messages found.");
//     return;
//   }

//   let scrapedEmails = [];

//   for (const message of messages) {
//     const messageData = await gmail.users.messages.get({
//       userId: "me",
//       id: message.id!,
//       format: "full",
//     });

//     const payload = messageData.data.payload;
//     if (!payload) continue;

//     const headers = payload.headers;
//     const subjectHeader =
//       headers?.find((header) => header.name === "Subject")?.value ||
//       "No Subject";
//     const fromHeader =
//       headers?.find((header) => header.name === "From")?.value ||
//       "Unknown Sender";
//     const dateHeader =
//       headers?.find((header) => header.name === "Date")?.value ||
//       "Unknown Date";

//     // Extract body parts
//     const parts = payload.parts || [payload];
//     let emailBody = "";

//     for (const part of parts) {
//       if (part.mimeType === "text/plain") {
//         const bodyData = part.body?.data;
//         if (bodyData) {
//           emailBody = Base64.decode(
//             bodyData.replace(/-/g, "+").replace(/_/g, "/")
//           );
//           break;
//         }
//       }
//     }

//     // Log the relevant email details
//     // console.log("=====================================");
//     // console.log(`From: ${fromHeader}`);
//     // console.log(`Date: ${dateHeader}`);
//     // console.log(`Subject: ${subjectHeader}`);
//     // console.log(`Body: ${emailBody}`);
//     // console.log("=====================================\n");

//     scrapedEmails.push({
//       fromHeader,
//       dateHeader,
//       subjectHeader,
//       emailBody,
//     });
//   }

//   return scrapedEmails;
// }

// async function main() {
//   try {
//     const auth = await authorize();
//     let clientScrapedEmails = await listEmails(auth as OAuth2Client);

//     if (!clientScrapedEmails) return "Could not scrape emails";

//     let aiDealScreeningResults = [];

//     for (let email of clientScrapedEmails) {
//       console.log("email being screened by ai", email);
//       const dealScreenResult = await extractDealFromScrapedEmail(email);
//       console.log("dealScreenResult", dealScreenResult);
//       aiDealScreeningResults.push(dealScreenResult);
//     }

//     console.log("aiDealScreeningResults", aiDealScreeningResults);
//   } catch (error: any) {
//     console.error(
//       "an error occured while trying to read emails",
//       error,
//       error.message,
//       error.statusCode
//     );
//   }
// }

// main();
/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
// async function listLabels(auth: any) {
//   const gmail = google.gmail({ version: "v1", auth });
//   const res = await gmail.users.labels.list({
//     userId: "me",
//   });

//   const response = await gmail.users.messages.list({
//     userId: "me",
//     labelIds: ["INBOX"],
//   });

//   const messages = response.data.messages;
//   if (!messages || messages.length === 0) {
//     console.log("No messages found.");
//     return;
//   }

//   console.log("messages", response.data.messages);

//   for (const message of messages) {
//     const messageData = await gmail.users.messages.get({
//       userId: "me",
//       id: message.id!,
//       format: "full",
//     });

//     console.log("message data is", messageData);
//     // const headers = messageData.data.payload.headers;
//     // const subjectHeader = headers.find((header) => header.name === "Subject");
//     // console.log(`Subject: ${subjectHeader.value}`);
//   }

//   const labels = res.data.labels;

//   if (!labels || labels.length === 0) {
//     console.log("No labels found.");
//     return;
//   }

//   console.log("Labels:");
//   labels.forEach((label) => {
//     console.log(`- ${label.name}`);
//   });
// }
