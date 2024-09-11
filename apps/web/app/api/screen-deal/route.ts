import { createOpenAI as createGroq } from "@ai-sdk/openai";
import { z } from "zod";
import { JSONParseError, TypeValidationError } from "ai";
import { streamObject } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export const dealScreenSchema = z.object({
  approvalStatus: z.enum(["Approved", "Rejected"]), // Status of deal screening
  explanation: z.string(), // Explanation for why the deal was approved or rejected
});

type DealScreen = z.infer<typeof dealScreenSchema>;

export async function POST(req: Request) {
  try {
    const context = await req.json();
    console.log("context was ", context);

    if (!process.env.GROQ_API_KEY) {
      return {
        type: "unknown-error",
        error: "Api key does not exist",
      };
    }
    const groq = createGroq({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey: process.env.GROQ_API_KEY,
    });

    const result = await streamObject({
      model: groq("llama-3.1-70b-versatile"),
      schema: dealScreenSchema,
      prompt: `Screen the following deal ${context} and provide approval status and an explanation.`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    if (TypeValidationError.isInstance(error)) {
      return { type: "validation-error", value: error.value };
    } else if (JSONParseError.isInstance(error)) {
      return { type: "parse-error", text: error.text };
    } else {
      return { type: "unknown-error", error };
    }
  }
}
