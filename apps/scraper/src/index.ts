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

function saveContentToTxtFile(content: string, filename: string) {
  try {
    if (!filename.endsWith(".txt")) {
      filename += ".txt";
    }

    const filesDir = path.join(__dirname, "files");
    if (!fs.existsSync(filesDir)) {
      fs.mkdirSync(filesDir);
    }

    const filePath = path.join(filesDir, filename);
    fs.writeFileSync(filePath, content, "utf8");

    console.log(`Content successfully saved to ${filePath}`);
  } catch (error: any) {
    console.error(
      "Error occurred while saving content to txt file",
      error.message
    );
  }
}

async function navigateToNextPage(page: Page): Promise<boolean> {
  const html = await page.content();
  const $ = cheerio.load(html);

  const nextPageButton = $("ul.wpgb-pagination li.wpgb-page a").filter(
    (_: number, element: any) => $(element).text().includes("Next →")
  );

  if (nextPageButton.length > 0) {
    const nextPageHref = nextPageButton.attr("href");
    if (nextPageHref) {
      await page.goto(nextPageHref, { waitUntil: "networkidle2" });
      return true;
    }
  }

  return false; // No next page
}

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

async function main() {
  let browser: Browser | null = null;

  try {
    const mainPageUrl =
      "https://americanhealthcarecapital.com/current-listings/";

    const result = await initializeBrowser(mainPageUrl);

    if (!result) {
      console.log("Could not load page using headless browser");
      return;
    }

    browser = result.browser;
    const page = result.page;
    const allScrapedDeals = [];

    let hasNextPage = true;

    while (hasNextPage) {
      const html = await page.content();
      const scrapedData = await extractTextContent(html);

      for (const card of scrapedData) {
        console.log(`Scraping dedicated page for: ${card.title}`);
        const mainContent = await extractDetailsFromDedicatedPage(
          page,
          card.link,
          card.title
        );
        card.main_content = mainContent; // Add the scraped content to the card
      }

      allScrapedDeals.push(...scrapedData);

      hasNextPage = await navigateToNextPage(page);
    }

    console.log("All scraped data is", allScrapedDeals);
    console.log("adding to firebase");
    await addDealsToDatabase(allScrapedDeals);
    console.log("Done adding to firebase");
    console.log("Done scraping all pages");
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

main();

export async function initializeBrowser(url: string) {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--disable-http2", "--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    // Set a user agent to avoid being blocked by the site
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
    return { browser, page };
  } catch (error: any) {
    console.error(
      "An error occurred while trying to initialize the browser:",
      error.message
    );
    return null;
  }
}
