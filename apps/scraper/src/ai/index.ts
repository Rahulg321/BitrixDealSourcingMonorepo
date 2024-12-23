import { generateObject, generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { streamObject } from "ai";
import dotenv from "dotenv";
import { object, z } from "zod";

dotenv.config();

const openai = createOpenAI({
  // custom settings, e.g.
  apiKey: process.env.AI_API_KEY,
  compatibility: "strict", // strict mode, enable when using the OpenAI API
});

type ScrapedEmailBody = {
  fromHeader: string;
  dateHeader: string;
  subjectHeader: string;
  emailBody: string;
};

const dealSchema = z.object({
  title: z.string().nullable(),
  revenue: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  main_content: z.string().nullable(),
  listing_code: z.string().optional().nullable(),
  link: z.string().url().optional().nullable(),
  category: z.string().nullable(),
  asking_price: z.string().optional().nullable(),
  does_not_contain_deal_information: z.boolean(),
});

function generatePrompt(emailContent: ScrapedEmailBody): string {
  return `
    I received the following email:

    From: ${emailContent.fromHeader}
    Date: ${emailContent.dateHeader}
    Subject: ${emailContent.subjectHeader}
    Body: ${emailContent.emailBody}

    Please analyze the email content and extract the following deal-related information, if it exists:
    - Title of the deal
    - Revenue generated by the business (if available)
    - Location of the business or deal (if available)
    - Detailed description or main content of the deal
    - Listing code (if any)
    - Link to the deal page (if available)
    - Category of the deal
    - Asking price for the deal (if available)


    if any of the fields for that deal is not present just return null

    If the email does not contain any information related to a potential business deal, return:
    - "does_not_contain_deal_information": true
    - All other fields (title, revenue, location, main_content, listing_code, link, category, asking_price) should be null.
  `;
}

export async function extractDealFromScrapedEmail(
  emailContent: ScrapedEmailBody
) {
  try {
    // Generate the deal object using the model and zod schema
    const result = await generateObject({
      model: openai("gpt-4-turbo"),
      schema: dealSchema,
      schemaName: "deal",
      schemaDescription: "anatomy of a deal structure",
      prompt: generatePrompt(emailContent),
    });

    // If the GPT model detects that the email contains no deal information
    console.log("usage for prompt was", result.usage);
    // Return the extracted deal information if present
    return result.object;
  } catch (error) {
    console.error("Error extracting deal from email:", error);
    return null; // Return null in case of an error
  }
}

export async function generateResponse() {
  console.log("generating text using ai");

  const { text } = await generateText({
    model: openai("gpt-4o"),
    prompt: "Write a vegetarian lasagna recipe for 4 people.",
  });

  return text;
}
