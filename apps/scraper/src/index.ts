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

// import { algoliasearch } from "algoliasearch";
// import {
//   addDealsToDatabase,
//   getEntireCollection,
// } from "@repo/firebase-client/db";

// // Connect and authenticate with your Algolia app
// const client = algoliasearch("KNMFQH2NOH", "fed7b7792e56f780f46731b918a639a3");

// // Fetch and index objects in Algolia
// const processRecords = async () => {
//   const objects = await getEntireCollection("deals");
//   return client.saveObjects({ indexName: "deals_index", objects });
// };

// processRecords()
//   .then(() => console.log("Successfully indexed objects!"))
//   .catch((err) => console.error(err));

import puppeteer, { Page, Browser } from "puppeteer";
import * as dotenv from "dotenv";
import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { addDealsToDatabase } from "@repo/firebase-client/db";
import { clearInterval } from "timers";

dotenv.config();

async function extractTextContent(html: string) {
  const $ = cheerio.load(html);

  return $("article.wpgb-card")
    .map((_: number, element: any) => ({
      title: $(element).find("h3 a").text().trim() || "",
      link: $(element).find("h3 a").attr("href") || "",
      state: $(element).find("div.wpgb_state span").html() || "",
      category: $(element).find("div.wpgb_category span").html() || "",
      asking_price: $(element).find("div.wpgb_price").html() || "",
      listing_code: $(element).find("div.wpgb_code").html() || "",
      under_contract: $(element).find("div.wpgb_loi").html() || "",
      revenue: $(element).find("div.wpgb_revenue").html() || "",
      main_content: "", // Placeholder for content from the dedicated page
    }))
    .get(); // .get() converts the cheerio object to a plain array
}

// async function navigateToNextPage(page: Page): Promise<boolean> {
//   const html = await page.content();
//   const $ = cheerio.load(html);

//   const nextPageButton = $("ul.wpgb-pagination li.wpgb-page a").filter(
//     (_: number, element: any) => $(element).text().includes("Next →")
//   );

//   if (nextPageButton.length > 0) {
//     const nextPageHref = nextPageButton.attr("href");
//     if (nextPageHref) {
//       await page.goto(nextPageHref, { waitUntil: "networkidle2" });
//       return true;
//     }
//   }

//   return false; // No next page
// }

async function navigateWithRetry(page: Page, url: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
      return;
    } catch (error) {
      console.log(`Navigation attempt ${i + 1} failed. Retrying...`);
      if (i === maxRetries - 1) throw error;
    }
  }
}

async function extractDetailsFromDedicatedPage(
  page: Page,
  url: string,
  title: string
): Promise<string> {
  try {
    await navigateWithRetry(page, url, 3);

    const html = await page.content();
    const $ = cheerio.load(html);

    const mainContent = $("div.elementor-widget-container")
      .find("h1, h2, h3, h4, h5, h6, p")
      .map((index: number, element: any) => {
        const text = $(element).text().trim();
        return `${text}`;
      })
      .get()
      .join("\n\n");

    return mainContent;
  } catch (error: any) {
    console.error(
      `Error occurred while extracting details from ${title}:`,
      error.message
    );
    return "";
  }
}

async function extractDetailsFromListingPage(page: Page, listingUrl: string) {
  try {
    // Navigate to the listing's dedicated page
    console.log(`Navigating to dedicated page for ${listingUrl}...`);
    await page.goto(listingUrl, { waitUntil: "networkidle2", timeout: 120000 });

    // Extract content from the listing page
    const html = await page.content();
    const $ = cheerio.load(html);

    // Extract the main image
    const mainImage =
      $("img.mainPhoto-print").attr("src") || "No image available";

    // Extract financial details
    const askingPrice =
      $("p.price:contains('Asking Price:') .normal").text().trim() || "N/A";
    const cashFlow =
      $("p.price:contains('Cash Flow:') .normal").text().trim() || "N/A";
    const grossRevenue =
      $("p:contains('Gross Revenue:') .normal").text().trim() || "N/A";
    const ebitda = $("p:contains('EBITDA:') .normal").text().trim() || "N/A";
    const ffe = $("p:contains('FF&E:') .normal").text().trim() || "N/A";
    const inventory =
      $("p:contains('Inventory:') .normal").text().trim() || "N/A";
    const established =
      $("p:contains('Established:') .normal").text().trim() || "N/A";

    // Extract the business description
    const businessDescription =
      $("div.businessDescription").text().trim() || "No description available";

    // Extract the number of employees
    const employees =
      $("dt:contains('Employees:')").next("dd").text().trim() || "N/A";

    // Return all the extracted information
    return {
      mainImage,
      askingPrice,
      cashFlow,
      grossRevenue,
      ebitda,
      ffe,
      inventory,
      established,
      businessDescription,
      employees,
    };
  } catch (error) {
    console.error(
      `Could not navigate to dedicated page for ${listingUrl}:`,
      error
    );
    console.error(`Error while scraping details from ${listingUrl}:`, error);
    return null;
  }
}

// Extract content from the main listings page
async function extractTextContentFromAllListings(page: Page) {
  // await page.waitForSelector("app-listing-showcase.ng-star-inserted", {
  //   timeout: 120000,
  // });
  const html = await page.content();
  const $ = cheerio.load(html);
  console.log("html", $.html());
  // Select all <a> elements inside the <app-listing-showcase> components
  // const listings = $("app-listing-showcase.ng-star-inserted")
  const listings = $("div.listing")
    .map((_: number, element: any) => {
      const title = $(element).find("h3.title").text().trim() || "";
      const location = $(element).find("p.location").text().trim() || "";
      const description = $(element).find("p.description").text().trim() || "";
      const askingPrice = $(element).find("p.asking-price").text().trim() || "";
      const cashFlow = $(element).find("p.cash-flow").text().trim() || "";

      // Extract the URL to the dedicated page (href attribute)
      // const dedicatedPageUrl = $(element).attr("href") || "";
      const dedicatedPageUrl = $(element).closest("a").attr("href") || "";

      return {
        title,
        location,
        description,
        askingPrice,
        cashFlow,
        dedicatedPageUrl: `https://www.bizbuysell.com${dedicatedPageUrl}`, // Complete URL
      };
    })
    .get(); // .get() converts the cheerio object to a plain array

  if (listings.length === 0) {
    console.log("could not find any listings");
    return [];
  }

  console.log(`Total listings extracted from the page: ${listings.length}`);

  return listings;
}

async function loadPageWithRetry(page: Page, url: string, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Loading page ${url}, attempt ${attempt}...`);
      await page.goto(url, { waitUntil: "networkidle2", timeout: 120000 }); // Increased timeout
      return true; // Page loaded successfully
    } catch (error) {
      if (attempt === retries) {
        console.error(`Failed to load page after ${retries} attempts:`, error);
        return false; // If all retries fail, return false
      }
      console.log(`Retrying page load for ${url} (${attempt}/${retries})...`);
    }
  }
}

async function scrapeAllPages() {
  let browser: Browser | null = null;
  const allListings: Array<any> = []; // To store all listings from all pages
  let currentPageNumber = 2; // Initialize page counter
  const maxPageLimit = 3; // Set a maximum limit to avoid infinite loops

  try {
    // browser = await puppeteer.launch({
    //   headless: true,
    //   args: ["--disable-http2", "--no-sandbox", "--disable-setuid-sandbox"],
    // });
    // const page = await browser.newPage();

    const baseUrl = "https://www.bizbuysell.com/businesses-for-sale/";

    let url = `${baseUrl}${currentPageNumber}/?q=aTI9ODgsODEsMzEsNTcmbGM9SmtjOU1UQW1RejFWVXc9PSZsdD0zMCw0MCw4MCZwZnJvbT0xMDAwMDAw`;

    const result = await initializeBrowser(url);

    if (!result) {
      console.log("Could not load page using headless browser");
      return;
    }

    browser = result.browser;
    const page = result.page;

    let hasNextPage = true;

    // Loop through each page and scrape listings
    while (hasNextPage && currentPageNumber <= maxPageLimit) {
      url = `${baseUrl}${currentPageNumber}/?q=aTI9ODgsODEsMzEsNTcmbGM9SmtjOU1UQW1RejFWVXc9PSZsdD0zMCw0MCw4MCZwZnJvbT0xMDAwMDAw`;
      console.log(`Scraping page ${currentPageNumber}...${url}`);

      // Load the page
      // await page.goto(url, { waitUntil: "networkidle2", timeout: 120000 });

      const success = await loadPageWithRetry(page, url);

      if (!success) {
        console.log("Unable to load page, stopping pagination.");
        break;
      }

      // await page.waitForSelector("a.showcase", { timeout: 120000 });
      // console.log("Listings detected, extracting content...");

      console.log(`navigated to the page ${currentPageNumber} successfully `);
      // Extract the content from all the listings on the page
      const listings: any = await extractTextContentFromAllListings(page);

      console.log("total listings extracted are", listings);

      if (listings.length === 0) {
        console.log("could not find any listings on the page");
        break;
      }

      for (const listing of listings) {
        console.log(`Scraping details for listing: ${listing.title}...`);

        // Navigate to the dedicated listing page and extract details
        const details = await extractDetailsFromListingPage(
          page,
          listing.dedicatedPageUrl
        );

        console.log("Extracted details are", details);

        if (details) {
          listing.mainImage = details.mainImage;
          listing.askingPrice = details.askingPrice;
          listing.cashFlow = details.cashFlow;
          listing.grossRevenue = details.grossRevenue;
          listing.ebitda = details.ebitda;
          listing.ffe = details.ffe;
          listing.inventory = details.inventory;
          listing.established = details.established;
          listing.businessDescription = details.businessDescription;
          listing.employees = details.employees;
        }

        // Go back to the original listings page
        await page.goBack({ waitUntil: "networkidle2" });

        // Append the fully populated listing to the allListings array
        allListings.push(listing);
      }
    }

    console.log("all pages scraped successfully are", currentPageNumber);
    console.log(
      "Scraping complete. Extracted Listings Data:",
      allListings.length
    );

    console.log("last Deal", allListings[0], allListings[1], allListings[2]);
  } catch (error: any) {
    console.error("Error occurred", error.message);
    if (error.name === "TimeoutError") {
      console.error(
        "Navigation timeout. The website might be slow or unresponsive."
      );
    }
  } finally {
    if (browser) {
      await browser.close();
      console.log("Browser closed");
    }
  }
}

scrapeAllPages();
// async function main() {
//   let browser: Browser | null = null;
//   let allListings = [];
//   try {
//     // const mainPageUrl =
//     //   "https://americanhealthcarecapital.com/current-listings/";
//     const mainPageUrl =
//       "https://www.bizbuysell.com/businesses-for-sale/?q=aTI9ODgsODEsMzEsNTcmbGM9SmtjOU1UQW1RejFWVXc9PSZsdD0zMCw0MCw4MCZwZnJvbT0xMDAwMDAw";

//     const result = await initializeBrowser(mainPageUrl);

//     if (!result) {
//       console.log("Could not load page using headless browser");
//       return;
//     }

//     browser = result.browser;
//     const page = result.page;
//     let hasNextPage = true;
//     let currentPageNumber = 1;
//     // Loop through each page and scrape listings

//     console.log("started to scrape");
//     while (hasNextPage) {
//       // Get the page content
//       console.log("current page number", currentPageNumber);
//       const html = await page.content();

//       // Extract the content from all the listings on the page
//       const extractedData = await extractTextContentFromAllListings(html);

//       // Append extracted data to the allListings array
//       allListings.push(...extractedData);
//       console.log(`scraped page ${currentPageNumber}....`);
//       // Try to navigate to the next page
//       hasNextPage = await navigateToNextPage(page, currentPageNumber);

//       if (hasNextPage) {
//         currentPageNumber++;
//       }
//     }

//     console.log("total pages moved ✅", currentPageNumber);
//     console.log("Extracted Listings Data:", allListings.length);

//     // console.log("Extracted Data:", extractedData);
//     // console.log("Extracted Data length:", extractedData.length);
//   } catch (error: any) {
//     console.error("Error occurred", error.message);
//     if (error.name === "TimeoutError") {
//       console.error(
//         "Navigation timeout. The website might be slow or unresponsive."
//       );
//     }
//   } finally {
//     if (browser) {
//       await browser.close();
//       console.log("Browser closed");
//     }
//   }
// }

// main();

export async function initializeBrowser(url: string) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Set a user agent to avoid being blocked by the site
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
    );

    console.log("loading the page");
    await page.goto(url, { waitUntil: "networkidle2", timeout: 1200000 });
    console.log("page loaded successfully");
    return { browser, page };
  } catch (error: any) {
    console.error(
      "An error occurred while trying to initialize the browser:",
      error
    );
    return null;
  }
}
