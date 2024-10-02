// async function extractTextContent(html: string) {
//   const $ = cheerio.load(html);

//   return $("article.wpgb-card")
//     .map((_: number, element: any) => ({
//       title: $(element).find("h3 a").text().trim() || "",
//       link: $(element).find("h3 a").attr("href") || "",
//       state: $(element).find("div.wpgb_state span").html() || "",
//       category: $(element).find("div.wpgb_category span").html() || "",
//       asking_price: $(element).find("div.wpgb_price").html() || "",
//       listing_code: $(element).find("div.wpgb_code").html() || "",
//       under_contract: $(element).find("div.wpgb_loi").html() || "",
//       revenue: $(element).find("div.wpgb_revenue").html() || "",
//       main_content: "", // Placeholder for content from the dedicated page
//     }))
//     .get();
// }

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
