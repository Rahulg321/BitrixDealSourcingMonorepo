// async function navigateWithRetry(page: Page, url: string, maxRetries = 3) {
//   for (let i = 0; i < maxRetries; i++) {
//     try {
//       await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
//       return;
//     } catch (error) {
//       console.log(`Navigation attempt ${i + 1} failed. Retrying...`);
//       if (i === maxRetries - 1) throw error;
//     }
//   }
// }

// async function extractDetailsFromListingPage(page: Page, listingUrl: string) {
//   try {
//     // Navigate to the listing's dedicated page
//     console.log(`Navigating to dedicated page for ${listingUrl}...`);
//     await page.goto(listingUrl, {
//       waitUntil: "load",
//       timeout: 60000,
//     });

//     // Extract content from the listing page
//     const html = await page.content();
//     const $ = cheerio.load(html);

//     // Extract the main image
//     const mainImage =
//       $("img.mainPhoto-print").attr("src") || "No image available";

//     // Extract financial details
//     const askingPrice =
//       $("p.price:contains('Asking Price:') .normal").text().trim() || "N/A";
//     const cashFlow =
//       $("p.price:contains('Cash Flow:') .normal").text().trim() || "N/A";
//     const grossRevenue =
//       $("p:contains('Gross Revenue:') .normal").text().trim() || "N/A";
//     const ebitda = $("p:contains('EBITDA:') .normal").text().trim() || "N/A";
//     const ffe = $("p:contains('FF&E:') .normal").text().trim() || "N/A";
//     const inventory =
//       $("p:contains('Inventory:') .normal").text().trim() || "N/A";
//     const established =
//       $("p:contains('Established:') .normal").text().trim() || "N/A";

//     // Extract the business description
//     const businessDescription =
//       $("div.businessDescription").text().trim() || "No description available";

//     // Extract the number of employees
//     const employees =
//       $("dt:contains('Employees:')").next("dd").text().trim() || "N/A";

//     // Return all the extracted information
//     return {
//       mainImage,
//       askingPrice,
//       cashFlow,
//       grossRevenue,
//       ebitda,
//       ffe,
//       inventory,
//       established,
//       businessDescription,
//       employees,
//     };
//   } catch (error) {
//     console.error(
//       `Could not navigate to dedicated page for ${listingUrl}:`,
//       error
//     );
//     return null;
//   }
// }

// // Extract content from the main listings page
// async function extractTextContentFromAllListings(page: Page) {
//   // await page.waitForSelector("app-listing-showcase.ng-star-inserted", {
//   //   timeout: 120000,
//   // });
//   const html = await page.content();
//   const $ = cheerio.load(html);
//   // console.log("html", $.html());
//   // Select all <a> elements inside the <app-listing-showcase> components
//   // const listings = $("app-listing-showcase.ng-star-inserted")
//   const listings = $("div.listing")
//     .map((_: number, element: any) => {
//       const title = $(element).find("h3.title").text().trim() || "";
//       const location = $(element).find("p.location").text().trim() || "";
//       const description = $(element).find("p.description").text().trim() || "";
//       const askingPrice = $(element).find("p.asking-price").text().trim() || "";
//       const cashFlow = $(element).find("p.cash-flow").text().trim() || "";

//       // Extract the URL to the dedicated page (href attribute)
//       // const dedicatedPageUrl = $(element).attr("href") || "";
//       const dedicatedPageUrl = $(element).closest("a").attr("href") || "";

//       return {
//         title,
//         location,
//         description,
//         askingPrice,
//         cashFlow,
//         dedicatedPageUrl: `https://www.bizbuysell.com${dedicatedPageUrl}`, // Complete URL
//       };
//     })
//     .get(); // .get() converts the cheerio object to a plain array

//   if (listings.length === 0) {
//     console.log("could not find any listings");
//     return [];
//   }

//   console.log(`Total listings extracted from the page: ${listings.length}`);

//   return listings;
// }

// async function loadPageWithRetry(page: Page, url: string, retries = 3) {
//   for (let attempt = 1; attempt <= retries; attempt++) {
//     try {
//       console.log(`Loading page ${url}, attempt ${attempt}...`);
//       await page.goto(url, { waitUntil: "networkidle2", timeout: 120000 }); // Increased timeout
//       return true; // Page loaded successfully
//     } catch (error) {
//       if (attempt === retries) {
//         console.error(`Failed to load page after ${retries} attempts:`, error);
//         return false; // If all retries fail, return false
//       }
//       console.log(`Retrying page load for ${url} (${attempt}/${retries})...`);
//     }
//   }
// }

// async function safeGoBack(page: Page, retries = 3) {
//   for (let attempt = 1; attempt <= retries; attempt++) {
//     try {
//       console.log(`Attempting to go back to the listings page...`);

//       await page.goBack({ waitUntil: "domcontentloaded", timeout: 120000 });

//       return true; // Successfully went back
//     } catch (error) {
//       if (attempt === retries) {
//         console.error(
//           "Failed to go back to the listings page after multiple attempts.",
//           error
//         );
//         return false;
//       }
//       console.log(`Retrying goBack... (${attempt}/${retries})`);
//     }
//   }
// }

// async function scrapeAllPages() {
//   let browser: Browser | null = null;
//   const allListings: Array<any> = []; // To store all listings from all pages
//   let currentPageNumber = 1; // Initialize page counter
//   const maxPageLimit = 9; // Set a maximum limit to avoid infinite loops

//   try {
//     // browser = await puppeteer.launch({
//     //   headless: true,
//     //   args: ["--disable-http2", "--no-sandbox", "--disable-setuid-sandbox"],
//     // });
//     // const page = await browser.newPage();
//     // https://www.bizbuysell.com/businesses-for-sale/?q=Y2Zmcm9tPTEwMDAwMDAmaTI9ODEsMTE4LDMxLDU3JmxjPUprYzlNVEFtUXoxVlV3PT0mbHQ9MzAsNDAsODAmcGZyb209MTAwMDAwMA%3D%3D

//     const baseUrl = "https://www.bizbuysell.com/businesses-for-sale/";

//     let url = `${baseUrl}${currentPageNumber}/?q=Y2Zmcm9tPTEwMDAwMDAmaTI9ODEsMTE4LDMxLDU3JmxjPUprYzlNVEFtUXoxVlV3PT0mbHQ9MzAsNDAsODAmcGZyb209MTAwMDAwMA%3D%3D`;

//     const result = await initializeBrowser(url);

//     if (!result) {
//       console.log("Could not load page using headless browser");
//       return;
//     }

//     browser = result.browser;
//     const page = result.page;

//     let hasNextPage = true;

//     // Loop through each page and scrape listings
//     while (hasNextPage && currentPageNumber <= maxPageLimit) {
//       url = `${baseUrl}${currentPageNumber}/?q=Y2Zmcm9tPTEwMDAwMDAmaTI9ODEsMTE4LDMxLDU3JmxjPUprYzlNVEFtUXoxVlV3PT0mbHQ9MzAsNDAsODAmcGZyb209MTAwMDAwMA%3D%3D`;
//       console.log(`Scraping page ${currentPageNumber}...${url}`);

//       // Load the page
//       // await page.goto(url, { waitUntil: "networkidle2", timeout: 120000 });

//       const success = await loadPageWithRetry(page, url);

//       if (!success) {
//         console.log("Unable to load page, stopping pagination.");
//         break;
//       }

//       // await page.waitForSelector("a.showcase", { timeout: 120000 });
//       // console.log("Listings detected, extracting content...");

//       console.log(`navigated to the page ${currentPageNumber} successfully `);
//       // Extract the content from all the listings on the page
//       const listings: any = await extractTextContentFromAllListings(page);

//       console.log("total listings extracted are", listings.length);

//       if (listings.length === 0) {
//         console.log("could not find any listings on the page");
//         break;
//       }

//       for (const listing of listings) {
//         console.log(`Scraping details for listing: ${listing.title}...`);

//         // Navigate to the dedicated listing page and extract details
//         const details = await extractDetailsFromListingPage(
//           page,
//           listing.dedicatedPageUrl
//         );

//         console.log(
//           `Extracted specific details for deal -> ${listing.title} ✅`
//         );

//         if (details) {
//           listing.mainImage = details.mainImage;
//           listing.askingPrice = details.askingPrice;
//           listing.cashFlow = details.cashFlow;
//           listing.grossRevenue = details.grossRevenue;
//           listing.ebitda = details.ebitda;
//           listing.ffe = details.ffe;
//           listing.inventory = details.inventory;
//           listing.established = details.established;
//           listing.businessDescription = details.businessDescription;
//           listing.employees = details.employees;
//         } else {
//           console.error(
//             `Skipping listing ${listing.title} due to extraction failure.`
//           );
//           continue;
//         }
//         // Clear localStorage, sessionStorage, and cookies after scraping each dedicated listing page

//         // console.log("clearning local storage and session storage ❌");
//         // await page.evaluate(() => {
//         //   localStorage.clear();
//         //   sessionStorage.clear();
//         // });

//         // console.log("clearning browser cookie ❌");
//         // await page.deleteCookie(...(await page.cookies()));

//         // Add a small delay before going back to the listings page
//         // await page.waitForTimeout(2000); // Wait for 2 seconds

//         // Go back to the original listings page
//         // const success = await safeGoBack(page);

//         // if (!success) {
//         //   console.log("Stopping scrape due to navigation issues.");
//         //   break;
//         // }
//         // Go back to the original listings page
//         // await page.goBack({ waitUntil: "domcontentloaded", timeout: 60000 });

//         // Append the fully populated listing to the allListings array
//         // allListings.push(listing);
//       }

//       console.log("*******************************************************");
//       console.log("moving to the next page");
//       console.log("first scraped deal from that page was", listings[0].title);
//       console.log("*******************************************************");
//       currentPageNumber++;
//       // hasNextPage = true;
//     }
//   } catch (error: any) {
//     console.error("Error occurred while scraping", error);

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

// scrapeAllPages();
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

// export async function initializeBrowser(url: string) {
//   try {
//     // @ts-ignore
//     const browser = await puppeteer.launch({
//       headless: false,
//       executablePath: executablePath(),
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });

//     const page = await browser.newPage();

//     // Set a user agent to avoid being blocked by the site
//     await page.setUserAgent(
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
//     );

//     console.log("loading the page");
//     await page.goto(url, { waitUntil: "networkidle2", timeout: 1200000 });
//     console.log("page loaded successfully");
//     return { browser, page };
//   } catch (error: any) {
//     console.error(
//       "An error occurred while trying to initialize the browser:",
//       error
//     );
//     return null;
//   }
// }
// export async function initializeBrowser(url: string) {
//   try {
//     const browser = await puppeteer.launch({
//       headless: true,
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });

//     const page = await browser.newPage();

//     // Set a user agent to avoid being blocked by the site
//     await page.setUserAgent(
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
//     );

//     console.log("loading the page");
//     await page.goto(url, { waitUntil: "networkidle2", timeout: 1200000 });
//     console.log("page loaded successfully");
//     return { browser, page };
//   } catch (error: any) {
//     console.error(
//       "An error occurred while trying to initialize the browser:",
//       error
//     );
//     return null;
//   }
// }
