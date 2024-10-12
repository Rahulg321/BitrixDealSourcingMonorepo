import { Page, Browser, executablePath } from "puppeteer";
// import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import dotenv from "dotenv";
import { addDealsToDatabase } from "@repo/firebase-client/db";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import fs from "fs";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
// fix the type error
// @ts-ignore
puppeteer.use(StealthPlugin());

dotenv.config();
// Function to extract deal details from the specific deal page
async function extractDetailsFromDealPage(page: Page, url: string | undefined) {
  if (!url) {
    return false;
  }

  try {
    // Navigate to the deal page
    await page.goto(url, { waitUntil: "networkidle0", timeout: 180000 });

    // Get the page content as HTML
    const html = await page.content();
    const $ = cheerio.load(html);

    // Extract the company overview
    const companyOverview = $("h5:contains('Company Overview')")
      .next("p")
      .text()
      .trim();

    // Extract the financial overview
    const financialOverview = $("h5:contains('Financial Overview')")
      .next("p")
      .text()
      .trim();

    // Combine company overview and financial overview into one field
    const main_content = `${companyOverview}\n\n${financialOverview}`;

    return {
      main_content,
    };
  } catch (error) {
    console.error(`Failed to extract details from deal page ${url}`, error);
    return null;
  }
}

async function scrapeAllPages() {
  let browser: Browser | null = null;
  const allListings: Array<any> = []; // To store all listings from all pages
  const startTime = new Date();

  try {
    let url = `https://businessexits.com/listings/`;

    console.log(`Initializing browser for business exits... ${url}`);
    const result = await initializeBrowser(url);

    if (!result) {
      throw Error("Could not load page using headless browser");
    }

    browser = result.browser;
    const page = result.page;

    console.log("connection to page established");

    // Scrape all listings on the page
    const listings: any = await extractListingsFromPage(page);
    console.log("Total listings extracted:", listings.length);
    console.log("listings are", listings);

    // for (const listing of listings) {
    //   console.log(`Navigating to deal page: ${listing.link}`);

    //   const dealDetails = await extractDetailsFromDealPage(page, listing.link);

    //   if (dealDetails) {
    //     console.log(
    //       `Extracted specific details for deal -> ${listing.title} ✅`
    //     );
    //     listing.main_content = dealDetails.main_content;

    //     console.log(`detail for ${listing.title} is`, listing);
    //   } else {
    //     console.error(
    //       `Skipping listing ${listing.title} due to extraction failure or url not provided.`
    //     );
    //     continue;
    //   }
    // }
    // // Append to the global array of listings
    // allListings.push(...listings);

    // console.log("listings are", allListings);

    // console.log("adding listings to database 🟡");
    // await addDealsToDatabase(listings);
    // console.log("Successfully added all listings to database 💚");
  } catch (error: any) {
    console.error("Error occurred while scraping:", error);
  } finally {
    if (browser) {
      await browser.close();
      console.log("Browser closed");
    }
  }

  const endTime = new Date();
  const timeTaken = (endTime.getTime() - startTime.getTime()) / 1000; // in seconds
  console.log(`Total time taken: ${timeTaken} seconds ⌛`);
}

// Function to initialize the browser
export async function initializeBrowser(url: string) {
  try {
    const userAgentList = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:79.0) Gecko/20100101 Firefox/79.0",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0",
    ];

    const randomUserAgent =
      userAgentList[Math.floor(Math.random() * userAgentList.length)];

    // @ts-ignore
    const browser = await puppeteer.launch({
      headless: false, // Disable headless to mimic a real browser
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Set a user agent to avoid being blocked by the site
    console.log("random user agent was", randomUserAgent);
    // await page.setUserAgent(randomUserAgent);
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0"
    );

    await page.setExtraHTTPHeaders({
      "accept-language": "en-US,en;q=0.9",
      "accept-encoding": "gzip, deflate, br",
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    });

    await page.evaluateOnNewDocument(() => {
      const getParameter = WebGLRenderingContext.prototype.getParameter;
      WebGLRenderingContext.prototype.getParameter = function (parameter) {
        if (parameter === 37445) return "Intel Open Source Technology Center";
        if (parameter === 37446) return "Mesa DRI Intel(R) Ivybridge Mobile";
        return getParameter(parameter);
      };
      Object.defineProperty(navigator, "hardwareConcurrency", { get: () => 4 });
    });

    console.log("Loading the page...");
    await page.goto(url, { waitUntil: "networkidle2", timeout: 120000 });

    console.log("Page loaded successfully");
    return { browser, page };
  } catch (error: any) {
    console.error(
      "An error occurred while trying to initialize the browser:",
      error
    );
    return null;
  }
}

async function extractListingsFromPage(page: Page) {
  // Wait for the listings to load

  console.log("extracting listings from the site");

  await page.waitForSelector("div.tb-fields-and-text", { timeout: 30000 });

  await page.waitForSelector("div.key-listings ", { timeout: 30000 });

  // console.log("key listings loaded");

  // Get the page content as HTML
  const html = await page.content();

  if (html) {
    console.log("converted to html", html);
  } else {
    console.log("❌ Could not convert to html", html);
  }

  // const __filename = fileURLToPath(import.meta.url);
  // const __dirname = dirname(__filename);
  // // Define the path to the file (ensure it's in the same directory)
  // const filePath = join(__dirname, "yourfile.txt");

  // // Load the HTML content into Cheerio
  const $ = cheerio.load(html);
  // const data = fs.readFileSync(filePath, "utf8");
  // console.log("File contents:", data);
  // Find and map over all the listings using the new markup structure
  const listings = $("div.key-listings")
    .map((i, element) => {
      const listingElement = $(element);
      console.log("listing element is", listingElement);
      // Extract details from each listing based on the new markup structure
      const title = listingElement.find("div.listing_title").text().trim();
      const link = listingElement.find("a").attr("href");
      const revenue = listingElement
        .find("div.listing_revenue")
        .text()
        .replace("Revenue: ", "")
        .trim();
      const income = listingElement
        .find("div.listing_income")
        .text()
        .replace("Income: ", "")
        .trim();

      const price = listingElement
        .find("div.listing_price")
        .text()
        .replace("Listing Price: ", "")
        .trim();
      const category = listingElement.find("div.listing_type").text().trim();

      // Return the extracted details as an object
      return {
        title,
        link: link ? link : "No link", // Return the link or default to 'No link'
        revenue: revenue ? revenue : "N/A",
        income: income ? income : "N/A",
        asking_price: price ? price : "N/A",
        category: category ? category : "N/A",
        source: "Business Exits",
      };
    })
    .get(); // Get plain array from Cheerio map

  return listings;
}

// Start scraping
scrapeAllPages();
