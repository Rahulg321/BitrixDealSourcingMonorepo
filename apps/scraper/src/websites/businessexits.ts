// const puppeteer = require("puppeteer");
// const cheerio = require("cheerio");

// // Initialize the browser and navigate to the main listings page
// async function initializeBrowser(url) {
//   try {
//     const browser = await puppeteer.launch({
//       headless: true, // Set to false for debugging
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });

//     const page = await browser.newPage();

//     // Set a user-agent to avoid being blocked by the website's security
//     await page.setUserAgent(
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
//     );

//     console.log("Loading the main listings page...");
//     await page.goto(url, { waitUntil: "networkidle2", timeout: 120000 });
//     console.log("Main listings page loaded successfully.");
//     return { browser, page };
//   } catch (error) {
//     console.error("Error initializing the browser:", error);
//     return null;
//   }
// }

// // Extract listings from the main page
// async function extractListings(page) {
//   // Get the HTML content of the page
//   const html = await page.content();
//   const $ = cheerio.load(html);

//   const listings = [];

//   // Iterate through each listing on the page
//   $("div.listing").each((i, element) => {
//     const title = $(element).find("h3").text().trim(); // Extract title
//     const revenue = $(element).find("span.revenue").text().trim(); // Extract revenue
//     const income = $(element).find("span.income").text().trim(); // Extract income
//     const price = $(element).find("span.price").text().trim(); // Extract price
//     const link = $(element).find("a").attr("href"); // Extract link to individual deal page

//     // Push the extracted data into the listings array
//     listings.push({
//       title,
//       revenue,
//       income,
//       price,
//       link: `https://businessexits.com${link}`,
//     });
//   });

//   return listings;
// }

// // Extract detailed information from individual deal pages
// async function scrapeDealDetails(page, dealUrl) {
//   try {
//     await page.goto(dealUrl, { waitUntil: "networkidle2", timeout: 120000 });
//     const html = await page.content();
//     const $ = cheerio.load(html);

//     // Extract additional information from the deal page
//     const description = $("div.business-description").text().trim(); // Extract business description
//     return { description };
//   } catch (error) {
//     console.error(`Error scraping details from ${dealUrl}:`, error);
//     return null;
//   }
// }

// // Handle pagination to scrape through multiple pages
// async function navigateToNextPage(page) {
//   // Check if a next page button exists
//   const nextPageButton = await page.$("a.next");
//   if (nextPageButton) {
//     await Promise.all([
//       page.click("a.next"), // Click the next page button
//       page.waitForNavigation({ waitUntil: "networkidle2" }), // Wait for the new page to load
//     ]);
//     return true; // Successfully navigated to the next page
//   }
//   return false; // No next page, stop scraping
// }

// // Main function to scrape all listings and their details
// async function scrapeAllPages() {
//   const { browser, page } = await initializeBrowser(
//     "https://businessexits.com/listings/"
//   );
//   if (!browser || !page) return; // Exit if the browser fails to initialize

//   let hasNextPage = true; // Flag to check if there are more pages
//   const allListings = []; // Store all listings across pages

//   while (hasNextPage) {
//     // Extract listings from the current page
//     const listings = await extractListings(page);
//     allListings.push(...listings); // Append listings to the global array

//     // For each listing, scrape detailed data from the individual deal page
//     for (const listing of listings) {
//       console.log(`Scraping details for: ${listing.title}`);
//       const details = await scrapeDealDetails(page, listing.link);
//       if (details) {
//         listing.description = details.description; // Add the description to the listing
//       }
//     }

//     // Navigate to the next page if available
//     hasNextPage = await navigateToNextPage(page);
//   }

//   console.log(`Total Listings Scraped: ${allListings.length}`);
//   console.log(allListings); // Output all scraped listings
//   await browser.close(); // Close the browser when done
//   console.log("Browser closed. Scraping completed.");
// }

// // Start the scraping process
// scrapeAllPages();
