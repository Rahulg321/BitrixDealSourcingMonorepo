import puppeteer, { Page, Browser } from "puppeteer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
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
  title: string,
  mainPageUrl: string
) {
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

    console.log("Saving main content to a file");

    // Navigate back to the main listings page
    await page.goto(mainPageUrl, { waitUntil: "networkidle2" });
  } catch (error: any) {
    console.error(
      "Error occurred while extracting details from dedicated page",
      error.message
    );
    await page.goto(mainPageUrl, { waitUntil: "networkidle2" });
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
    const allScrapedData = [];

    let hasNextPage = true;

    while (hasNextPage) {
      const html = await page.content();
      const scrapedData = await extractTextContent(html);

      const currentPageUrl = page.url();

      for (const card of scrapedData) {
        await extractDetailsFromDedicatedPage(
          page,
          card.link,
          card.title,
          currentPageUrl
        );
      }

      console.log("scrapedData", scrapedData);
      allScrapedData.push(...scrapedData);
      console.log("Scraped Data from current page:", scrapedData);

      hasNextPage = await navigateToNextPage(page);
    }

    console.log("All scraped data is ", allScrapedData);
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
