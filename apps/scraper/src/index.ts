import puppeteer, { Page, Browser } from "puppeteer";
import dotenv from "dotenv";
import * as cheerio from "cheerio";

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
    }))
    .get(); // .get() converts the cheerio object to a plain array
}

async function extractDetailsFromDedicatedPage(page: Page, url: string) {
  try {
    await page.goto(url, { waitUntil: "networkidle2" });

    // Extract all main text content from the dedicated page
    const html = await page.content();
    const $ = cheerio.load(html);

    // Select all heading tags (h1 to h6) and paragraph tags
    const mainContent = $("h1, h2, h3, h4, h5, h6, p")
      .map((_: any, element: any) => {
        const tagName = element.name;
        const text = $(element).text().trim();
        return `[${tagName.toUpperCase()}] ${text}`;
      })
      .get()
      .join("\n\n");

    return {
      main_content: mainContent,
    };
  } catch (error: any) {
    console.error(
      "Error occurred while extracting details from dedicated page",
      error.message
    );
    return {};
  }
}

async function navigateToNextPage(page: Page): Promise<boolean> {
  const html = await page.content();
  const $ = cheerio.load(html);

  const nextPageButton = $("ul.wpgb-pagination li.wpgb-page a").filter(
    (_: number, element: cheerio.Element) =>
      $(element).text().includes("Next →")
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

async function main() {
  let browser: Browser | null = null;

  try {
    const result = await initializeBrowser(
      "https://americanhealthcarecapital.com/current-listings/"
    );
    if (!result) {
      console.log("Could not load page using headless browser");
      return;
    }

    browser = result.browser;
    const page = result.page;
    const allScrapedData = [];

    let hasNextPage = true;
    while (hasNextPage) {
      const html = await page.content();
      const scrapedData = await extractTextContent(html);
      allScrapedData.push(...scrapedData);
      console.log("Scraped Data from current page:", scrapedData);

      hasNextPage = await navigateToNextPage(page);
    }

    console.log("All scraped data is ", allScrapedData);
    console.log("Done scraping all pages");
  } catch (error: any) {
    console.error("Error occurred", error.message);
  } finally {
    if (browser) {
      await browser.close();
      console.log("Browser closed");
    }
  }
}

export async function initializeBrowser(url: string) {
  try {
    console.log("setting up browser");
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--disable-http2", "--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    console.log("page->", page);
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

main();
