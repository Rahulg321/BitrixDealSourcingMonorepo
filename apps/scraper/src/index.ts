import { Page, Browser, executablePath } from "puppeteer";
import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import dotenv from "dotenv";
import { addDealsToDatabase } from "@repo/firebase-client/db";

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
  let currentPageNumber = 1; // Initialize page counter
  const maxPageLimit = 9; // Set a maximum limit to avoid infinite loops
  const startTime = new Date();
  try {
    let url = `https://americanhealthcarecapital.com/current-listings/?_filter_revenue=2024000%2C132000000&_result_pagination=7`;

    console.log(`Initializing browser for loop.net page... ${url}`);
    const result = await initializeBrowser(url);

    if (!result) {
      throw Error("Could not load page using headless browser");
    }

    browser = result.browser;
    const page = result.page;

    // Scrape all listings on the page
    const listings: any = await extractListingsFromPage(page);
    console.log("Total listings extracted:", listings.length);
    // console.log("first listing",);

    for (const listing of listings) {
      console.log(`Navigating to deal page: ${listing.link}`);

      const dealDetails = await extractDetailsFromDealPage(page, listing.link);

      if (dealDetails) {
        console.log(
          `Extracted specific details for deal -> ${listing.title} ✅`
        );
        listing.main_content = dealDetails.main_content;

        console.log(`detail for ${listing.title} is`, listing);
      } else {
        console.error(
          `Skipping listing ${listing.title} due to extraction failure or url not provided.`
        );
        continue;
      }
    }
    // Append to the global array of listings
    allListings.push(...listings);

    console.log("listings are", allListings);

    console.log("adding listings to database 🟡");
    await addDealsToDatabase(listings);
    console.log("Successfully added all listings to database 💚");
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
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-http2"], // Disable HTTP/2],
    });

    const page = await browser.newPage();

    // Set a user agent to avoid being blocked by the site
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
    );

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

// Function to extract listings from the page
async function extractListingsFromPage(page: Page) {
  // Wait for the listings to load
  await page.waitForSelector("article.wpgb-card");

  // Get the page content as HTML
  const html = await page.content();

  // Load the HTML content into Cheerio
  const $ = cheerio.load(html);

  // Find and map over all the listings using the topmost `article` element
  const listings = $("article.wpgb-card")
    .map((i, element) => {
      const listingElement = $(element);

      // Extract details from each listing based on the new markup structure
      const title = listingElement.find("h3.wpgb-block-1 a").text().trim();
      const link = listingElement.find("h3.wpgb-block-1 a").attr("href");
      const location = listingElement
        .find("div.wpgb-block-13 span")
        .text()
        .trim();
      const category = listingElement
        .find("div.wpgb-block-12 span")
        .text()
        .trim();
      const revenue = listingElement.find("div.wpgb-block-11").text().trim();
      const price = listingElement.find("div.wpgb-block-10").text().trim();
      const code = listingElement.find("div.wpgb-block-9").text().trim();
      const loi = listingElement.find("div.wpgb-block-2").text().trim();

      // Return the extracted details as an object
      return {
        title,
        link: link ? link : "No link", // Return the link or default to 'No link'
        location: location ? location : "N/A",
        category: category ? category : "N/A",
        revenue: revenue ? revenue : "N/A",
        asking_priceprice: price ? price : "N/A",
        listing_code: code ? code : "N/A",
        loi: loi ? loi : "N/A",
        source: "American Health Care Capital",
      };
    })
    .get(); // Get plain array from Cheerio map

  return listings;
}

// Start scraping
scrapeAllPages();
