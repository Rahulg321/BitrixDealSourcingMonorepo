// import { Page, Browser, executablePath } from "puppeteer";
// import puppeteer from "puppeteer";
// import * as cheerio from "cheerio";
// import dotenv from "dotenv";
// import { addDealsToDatabase } from "@repo/firebase-client/db";

// dotenv.config();
// // Function to extract deal details from the specific deal page
// async function extractDetailsFromDealPage(page: Page, url: string | undefined) {
//   if (!url) {
//     return false;
//   }

//   try {
//     await page.goto(url, { waitUntil: "networkidle0", timeout: 180000 });

//     const html = await page.content();
//     const $ = cheerio.load(html);

//     const grossRevenue = $("span:contains('Gross Revenue')")
//       .parent()
//       .next()
//       .find("span.pricing-detail-align.text-finance")
//       .text()
//       .trim();

//     const cashFlow = $("span:contains('Cash Flow')")
//       .parent()
//       .next()
//       .find("span.pricing-detail-align.text-finance")
//       .text()
//       .trim();

//     const ebitda = $("span:contains('EBITDA')")
//       .parent()
//       .next()
//       .find("span.pricing-detail-align.text-finance")
//       .text()
//       .trim();

//     const inventory = $("span:contains('Inventory')")
//       .parent()
//       .next()
//       .find("span.pricing-detail-align.text-finance")
//       .text()
//       .trim();

//     const businessDescription = $("p.descriptionAd").text().trim();
//     const employees = $("div:contains('Employees')").next().text().trim();

//     return {
//       grossRevenue,
//       cashFlow,
//       ebitda,
//       inventory,
//       main_content: businessDescription,
//     };
//   } catch (error) {
//     console.error(`Failed to extract details from deal page ${url}`, error);
//     return null;
//   }
// }

// async function scrapeAllPages() {
//   let browser: Browser | null = null;
//   const allListings: Array<any> = []; // To store all listings from all pages
//   let currentPageNumber = 1; // Initialize page counter
//   const maxPageLimit = 9; // Set a maximum limit to avoid infinite loops
//   const startTime = new Date();
//   try {
//     const baseUrl =
//       "https://www.loopnet.com/biz/online-and-technology-businesses-for-sale/";

//     const skParam =
//       "Y2Zmcm9tPTIwMDAwMDAmaTI9MTE1LDU3LDIwJmx0PTMwLDQwJnBmcm9tPTIwMDAwMDA%3D"; // This parameter may need to be updated based on the session
//     let url = `${baseUrl}3/?q=${skParam}`;

//     console.log(`Initializing browser for loop.net page... ${url}`);
//     const result = await initializeBrowser(url);

//     if (!result) {
//       throw Error("Could not load page using headless browser");
//     }

//     browser = result.browser;
//     const page = result.page;

//     // Scrape all listings on the page
//     const listings: any = await extractListingsFromPage(page);

//     console.log("Total listings extracted:", listings.length);

//     for (const listing of listings) {
//       console.log(`Navigating to deal page: ${listing.link}`);

//       const dealDetails = await extractDetailsFromDealPage(page, listing.link);

//       if (dealDetails) {
//         console.log(
//           `Extracted specific details for deal -> ${listing.title} ✅`
//         );
//         listing.grossRevenue = dealDetails.grossRevenue;
//         listing.cashFlow = dealDetails.cashFlow;
//         listing.ebitda = dealDetails.ebitda;
//         listing.inventory = dealDetails.inventory;
//         listing.main_content = dealDetails.main_content;

//         console.log(`detail for ${listing.title} is`, listing);
//       } else {
//         console.error(
//           `Skipping listing ${listing.title} due to extraction failure or url not provided.`
//         );
//         continue;
//       }
//     }
//     // Append to the global array of listings
//     allListings.push(...listings);

//     console.log("listings are", allListings);

//     console.log("adding listings to database 🟡");
//     await addDealsToDatabase(listings);
//     console.log("Successfully added all listings to database 💚");
//   } catch (error: any) {
//     console.error("Error occurred while scraping:", error);
//   } finally {
//     if (browser) {
//       await browser.close();
//       console.log("Browser closed");
//     }
//   }

//   const endTime = new Date();
//   const timeTaken = (endTime.getTime() - startTime.getTime()) / 1000; // in seconds
//   console.log(`Total time taken: ${timeTaken} seconds ⌛`);
// }

// // Function to initialize the browser
// export async function initializeBrowser(url: string) {
//   try {
//     const browser = await puppeteer.launch({
//       headless: true,
//       args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-http2"], // Disable HTTP/2],
//     });

//     const page = await browser.newPage();

//     // Set a user agent to avoid being blocked by the site
//     await page.setUserAgent(
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
//     );

//     console.log("Loading the page...");
//     await page.goto(url, { waitUntil: "networkidle2", timeout: 120000 });
//     console.log("Page loaded successfully");
//     return { browser, page };
//   } catch (error: any) {
//     console.error(
//       "An error occurred while trying to initialize the browser:",
//       error
//     );
//     return null;
//   }
// }

// // Function to extract listings from the page
// async function extractListingsFromPage(page: Page) {
//   // Wait for the listings to load

//   // await page.waitForNetworkIdle({ timeout: 120000 });

//   await page.waitForSelector("div.shell");
//   // await page.waitForSelector("p.cash-flow");

//   // Get the page content as HTML
//   const html = await page.content();

//   // Load the HTML content into Cheerio
//   const $ = cheerio.load(html);

//   // Find and map over all the listings using the topmost div
//   const listings = $("div.shell")
//     .map((i, element) => {
//       const listingElement = $(element);

//       // Extract details from each listing
//       const location = listingElement.find(".location").text().trim();
//       const price = listingElement.find(".price").text().trim();
//       const title = listingElement.find("h6").text().trim();
//       const description = listingElement.find(".description").text();

//       const cashFlow = listingElement.find("p.cash-flow").text().trim();

//       // const cashFlow = listingElement.find("p.cash-flow").text().trim();

//       // Extract the href (link) from the nearest <a> ancestor
//       const dealLink = listingElement.closest("a").attr("href");

//       // Return the extracted details as an object
//       return {
//         location: location ? location : "N/A",
//         asking_price: price,
//         title,
//         source: "Loop.net",
//         description,
//         // cashFlow,
//         link: dealLink ? `https://www.loopnet.com${dealLink}` : undefined, // Construct full URL
//       };
//     })
//     .get(); // Get plain array from Cheerio map

//   return listings;
// }

// // Start scraping
// scrapeAllPages();
